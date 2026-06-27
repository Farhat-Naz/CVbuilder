"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["2 resumes", "2 cover letters", "5 basic templates", "PDF export", "ATS score checker"],
    cta: "Get Started Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious job seekers",
    features: ["Unlimited resumes", "Unlimited cover letters", "25+ premium templates", "All export formats", "AI resume writing", "AI cover letter generator", "ATS optimization", "Priority support", "Custom sections", "Remove branding"],
    cta: "Start Pro Plan",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "$19",
    period: "per month",
    description: "For power users",
    features: ["Everything in Pro", "LinkedIn profile optimizer", "Job description analyzer", "Interview prep guide", "Resume analytics", "Team collaboration", "API access", "White-label option"],
    cta: "Start Premium",
    href: "/register?plan=premium",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-heading mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-8 border bg-card",
                plan.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 scale-105" : ""
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
                    <Zap className="w-3 h-3 mr-1" />Most Popular
                  </Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold font-heading mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-heading">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  className={cn("w-full", plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90" : "")}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
