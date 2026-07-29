from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import stripe
import logging

from app.core.config import settings
from app.database.base import get_db
from app.models.user import User, SubscriptionPlan
from app.auth.jwt import get_current_active_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/billing", tags=["Billing"])

stripe.api_key = settings.STRIPE_SECRET_KEY

PRICE_TO_PLAN = {
    settings.STRIPE_PRICE_ID_PRO: SubscriptionPlan.PRO,
    settings.STRIPE_PRICE_ID_PREMIUM: SubscriptionPlan.PREMIUM,
}
PLAN_TO_PRICE = {
    "pro": settings.STRIPE_PRICE_ID_PRO,
    "premium": settings.STRIPE_PRICE_ID_PREMIUM,
}


class CheckoutRequest(BaseModel):
    plan: str


def _get_or_create_customer(user: User) -> str:
    if user.stripe_customer_id:
        return user.stripe_customer_id
    customer = stripe.Customer.create(email=user.email, name=user.full_name or None)
    return customer.id


@router.post("/checkout")
async def create_checkout_session(
    data: CheckoutRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    price_id = PLAN_TO_PRICE.get(data.plan)
    if not price_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown plan")

    customer_id = _get_or_create_customer(current_user)
    if current_user.stripe_customer_id != customer_id:
        current_user.stripe_customer_id = customer_id
        db.commit()

    session = stripe.checkout.Session.create(
        mode="subscription",
        customer=customer_id,
        client_reference_id=str(current_user.id),
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=f"{settings.FRONTEND_URL}/settings?checkout=success",
        cancel_url=f"{settings.FRONTEND_URL}/settings?checkout=cancelled",
        metadata={"user_id": str(current_user.id), "plan": data.plan},
        subscription_data={"metadata": {"user_id": str(current_user.id), "plan": data.plan}},
    )
    return {"url": session.url}


@router.post("/portal")
async def create_portal_session(current_user: User = Depends(get_current_active_user)):
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No billing account found. Upgrade first.")

    session = stripe.billing_portal.Session.create(
        customer=current_user.stripe_customer_id,
        return_url=f"{settings.FRONTEND_URL}/settings",
    )
    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature")

    event_type = event["type"]
    obj = event["data"]["object"]

    if event_type == "checkout.session.completed":
        user_id = obj.get("client_reference_id") or obj.get("metadata", {}).get("user_id")
        plan = obj.get("metadata", {}).get("plan")
        user = db.query(User).filter(User.id == user_id).first() if user_id else None
        if user:
            user.stripe_customer_id = obj.get("customer")
            user.stripe_subscription_id = obj.get("subscription")
            if plan in ("pro", "premium"):
                user.subscription_plan = SubscriptionPlan(plan)
            db.commit()
        else:
            logger.warning(f"Stripe checkout.session.completed: no user found for id {user_id}")

    elif event_type in ("customer.subscription.updated", "customer.subscription.deleted"):
        customer_id = obj.get("customer")
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            status_val = obj.get("status")
            if event_type == "customer.subscription.deleted" or status_val in ("canceled", "unpaid", "incomplete_expired"):
                user.subscription_plan = SubscriptionPlan.FREE
                user.stripe_subscription_id = None
            elif status_val in ("active", "trialing"):
                items = obj.get("items", {}).get("data", [])
                price_id = items[0]["price"]["id"] if items else None
                plan = PRICE_TO_PLAN.get(price_id)
                if plan:
                    user.subscription_plan = plan
                user.stripe_subscription_id = obj.get("id")
            db.commit()
        else:
            logger.warning(f"Stripe {event_type}: no user found for customer {customer_id}")

    return {"received": True}
