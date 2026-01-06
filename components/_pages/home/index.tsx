import useTranslation from "next-translate/useTranslation";
import React from "react";
import type { Banner } from "@/components/services/banners";
import BannersSlider from "./components/banners-slider";
import { AboutSection } from "./components/about-section";
import { CtaBanner } from "./components/cta-banner";
import { Testimonials } from "./components/testimonials";

type HomePageProps = {
  banners?: Banner[];
};

export default function HomePage({ banners = [] }: HomePageProps) {
  const { t } = useTranslation("home");

  return (
    <div>
      <BannersSlider banners={banners} />
      <AboutSection />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}
