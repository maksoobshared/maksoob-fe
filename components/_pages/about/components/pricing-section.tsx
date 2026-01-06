"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BillingPeriod = "monthly" | "annual" | "lifetime";

const plans = [
  {
    name: "Starter",
    description: "Ideal for small projects",
    price: { monthly: "Free", annual: "Free", lifetime: "Free" },
    features: [
      "Access to all basic courses",
      "24/7 customer support",
      "Learn from any device",
      "Basic analytics dashboard",
      "Completion certificate provided",
    ],
    popular: false,
  },
  {
    name: "Professional",
    description: "For Freelancers and startups",
    price: { monthly: "$15", annual: "$12", lifetime: "$299" },
    priceLabel: "/per user",
    features: [
      "All starter features +",
      "All monthly plan features",
      "20% off on all paid courses",
      "Custom dashboards",
      "Access to exclusive premium content",
      "Personalized mentorship sessions",
    ],
    popular: true,
    contactSales: true,
  },
  {
    name: "Organization",
    description: "For fast-growing businesses",
    price: { monthly: "$30", annual: "$25", lifetime: "$599" },
    priceLabel: "/per user",
    features: [
      "All professional features +",
      "Lifetime access to all current & future courses",
      "Free updates forever",
      "Priority support access",
      '"Elite Learner" badge on your profile',
      "Custom integration support",
      "Compliance tools",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl md:text-5xl text-teal-800 mb-4">
            Plans & Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            Choose the plan that fits your needs. All plans include essential
            features to get you started, with options to scale as you grow. No
            hidden fees and the flexibility to change anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center mb-10">
          <div className="inline-flex rounded-full border border-border bg-muted p-1">
            {(["monthly", "annual", "lifetime"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-full transition-all capitalize",
                  billingPeriod === period
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {period === "lifetime"
                  ? "Life Time"
                  : period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-teal-600 text-sm mt-2">
            ~25% off on annual payments
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-6 bg-card border",
                plan.popular
                  ? "border-teal-700 shadow-lg md:-mt-4 md:mb-4"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-700 text-white text-xs font-medium px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular Plan
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-lg text-foreground">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">
                  {plan.price[billingPeriod]}
                </span>
                {plan.priceLabel && (
                  <span className="text-muted-foreground text-sm ml-1">
                    {plan.priceLabel}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full py-3 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors",
                  plan.popular
                    ? "bg-teal-700 text-white hover:bg-teal-800"
                    : "bg-teal-800 text-white hover:bg-teal-900"
                )}
              >
                Select plan
                <ArrowRight className="w-4 h-4" />
              </button>

              {plan.contactSales && (
                <p className="text-center text-sm text-muted-foreground mt-3 underline cursor-pointer hover:text-foreground">
                  or contact sales
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
