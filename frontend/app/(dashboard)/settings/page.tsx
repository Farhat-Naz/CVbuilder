"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { billingService } from "@/services/billing.service";
import { CheckCircle2, Zap, Crown, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const plans = [
  { id: "free", name: "Free", price: "$0/mo", features: ["5 resumes", "5 cover letters", "5 templates", "PDF export"], current: true },
  { id: "pro", name: "Pro", price: "$9/mo", features: ["Unlimited resumes", "All templates", "AI tools", "All exports"], popular: true },
  { id: "premium", name: "Premium", price: "$19/mo", features: ["Everything in Pro", "Analytics", "API access", "Priority support"] },
];

function SettingsPageContent() {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(authUser);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast.success("Payment received! Updating your plan…");
      authService.getMe().then(setUser).catch(() => {});
      router.replace("/settings");
    } else if (checkout === "cancelled") {
      toast.info("Checkout cancelled");
      router.replace("/settings");
    }
  }, [searchParams, router]);

  const handlePlanClick = async (planId: string) => {
    setPendingPlan(planId);
    try {
      if (user?.subscription_plan && user.subscription_plan !== "free") {
        const url = await billingService.createPortalSession();
        window.location.href = url;
      } else if (planId === "pro" || planId === "premium") {
        const url = await billingService.createCheckoutSession(planId as "pro" | "premium");
        window.location.href = url;
      }
    } catch {
      toast.error("Couldn't start billing session. Please try again.");
      setPendingPlan(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your subscription and preferences</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50">
              <div>
                <p className="font-semibold capitalize">{user?.subscription_plan || "Free"} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {user?.subscription_plan === "free" ? "5 resumes, 5 cover letters" : "Unlimited resumes and cover letters"}
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 capitalize">
                {user?.subscription_plan || "Free"}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {plans.map((plan) => (
                <div key={plan.id} className={`rounded-xl border p-4 relative ${plan.popular ? "border-blue-500" : ""}`}>
                  {plan.popular && <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] border-0">Popular</Badge>}
                  <p className="font-semibold text-sm">{plan.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{plan.price}</p>
                  <ul className="space-y-1 mb-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  {user?.subscription_plan === plan.id ? (
                    <Button size="sm" variant="outline" className="w-full h-7 text-xs" disabled>Current</Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full h-7 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                      disabled={pendingPlan === plan.id}
                      onClick={() => handlePlanClick(plan.id)}
                    >
                      {pendingPlan === plan.id ? "Redirecting…" : plan.id === "free" ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">Sign out from your account on this device</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => toast.error("This action is irreversible. Contact support to delete your account.")}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsPageContent />
    </Suspense>
  );
}
