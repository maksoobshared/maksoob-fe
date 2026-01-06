import React from "react";
import { PricingSection } from "./components/pricing-section";
import { FAQSection } from "./components/faq-section";
import type { Faq } from "@/components/services/faqs";

type AboutUsPageProps = {
  faqs: Faq[];
};

export default function AboutUsPage({ faqs }: AboutUsPageProps) {
  return (
    <div className="px-2 md:px-10 xl:px-24">
      <PricingSection />
      <FAQSection faqs={faqs} />
    </div>
  );
}
