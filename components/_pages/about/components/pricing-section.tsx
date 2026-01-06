"use client";

import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "Start learning with free lessons and previews",
    price: "Free",
    features: [
      "Access to free lessons and course previews",
      "Learn on mobile, tablet, and desktop",
      "Track your progress across lessons",
      "Get recommendations for next courses",
    ],
    popular: false,
    showCta: false,
  },
  {
    name: "Monthly",
    description: "Full access billed monthly",
    price: "$20",
    priceSuffix: "/month",
    features: [
      "Everything in Free+",
      "Unlimited access to all courses",
      "Certificates on course completion",
      "Downloadable resources and templates",
    ],
    popular: true,
  },
  {
    name: "Yearly",
    description: "Best value billed yearly",
    price: "$200",
    priceSuffix: "/year",
    features: [
      "Everything in Free+",
      "Unlimited access to all courses",
      "Certificates on course completion",
      "Priority support",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-16">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-secondary text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
            Plans & Pricing
          </h2>
          <p className="mx-auto max-w-5xl text-xs sm:text-sm leading-relaxed">
            Choose the plan that matches your learning goals. Upgrade anytime to
            get full access to courses, certificates, and practice projects.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center sm:mb-10">
          <p className="text-primary text-xs sm:text-sm mt-2 mb-3 md:mb-6 font-bold">
            Save 20% with annual billing
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
          {plans.map((plan) =>
            plan.popular ? (
              <div
                key={plan.name}
                className="relative isolate z-10 w-full h-full rounded-4xl px-2 pb-2 overflow-visible"
              >
                <div className="absolute inset-x-0 -top-10 bottom-0 rounded-4xl bg-secondary shadow-lg z-0 pointer-events-none" />

                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20  text-white rounded-full text-[10px] sm:text-xs lg:text-[10px] xl:text-xs font-medium tracking-wide pointer-events-none xl:min-w-[180px]">
                  MOST POPULAR PLAN
                </div>

                <div className="relative z-10 w-full h-full bg-card overflow-hidden rounded-4xl border border-border shadow-md">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-6">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground lg:text-xs text-xs sm:text-sm xl:text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      {plan.priceSuffix && (
                        <span className="text-muted-foreground text-sm ml-1">
                          {plan.priceSuffix}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1 overflow-auto">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-sm"
                        >
                          <BadgeCheck
                            className={cn(
                              "w-6 h-6 text-white mt-0.5 flex-shrink-0 fill-primary ",
                              plan.name !== "Free" &&
                                index === 0 &&
                                "fill-[#EDEDED] text-foreground w-[22px] h-[22px]"
                            )}
                          />
                          <span
                            className={`text-foreground lg:text-xs text-xs sm:text-base xl:text-base ${
                              plan.name !== "Free" && index === 0
                                ? "font-semibold"
                                : ""
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button variant="secondary" className="h-12">
                      Choose plan
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={plan.name}
                className="relative z-0 w-full h-full rounded-4xl p-2"
              >
                <div className="relative z-10 w-full h-full rounded-4xl p-6 bg-card border border-border shadow-md flex flex-col ">
                  <div className="mb-6">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground lg:text-xs text-xs sm:text-sm xl:text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.priceSuffix && (
                      <span className="text-muted-foreground text-sm ml-1">
                        {plan.priceSuffix}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1 overflow-auto">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-sm"
                      >
                        <BadgeCheck
                          className={cn(
                            "w-6 h-6 text-white mt-0.5 flex-shrink-0 fill-primary ",
                            plan.name !== "Free" &&
                              index === 0 &&
                              "fill-[#EDEDED] text-foreground w-[22px] h-[22px]"
                          )}
                        />
                        <span
                          className={`text-foreground lg:text-xs text-xs sm:text-base xl:text-base ${
                            plan.name !== "Free" && index === 0
                              ? "font-semibold"
                              : ""
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.showCta === false ? (
                    <div className="h-12" />
                  ) : (
                    <Button variant="secondary" className="h-12">
                      Choose plan
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
