import api from "@/lib/api";

export const billingService = {
  async createCheckoutSession(plan: "pro" | "premium"): Promise<string> {
    const { data } = await api.post<{ url: string }>("/billing/checkout", { plan });
    return data.url;
  },

  async createPortalSession(): Promise<string> {
    const { data } = await api.post<{ url: string }>("/billing/portal");
    return data.url;
  },
};
