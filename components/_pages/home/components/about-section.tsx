import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import tutorsGif from "../assets/tutors.gif";
import skillsGif from "../assets/skills.gif";
import onlineDegreeGif from "../assets/online-degree.gif";
import personWithBg from "../assets/person-with-bg.png";
import { cn } from "@/lib/utils";
import { FeaturedCourses } from "./featured-courses";
import useTranslation from "next-translate/useTranslation";

export function AboutSection() {
  const { t } = useTranslation("home");

  const features = [
    {
      icon: tutorsGif,
      title: t("homeAboutFeature1Title"),
      description: t("homeAboutFeature1Description"),
    },
    {
      icon: skillsGif,
      title: t("homeAboutFeature2Title"),
      description: t("homeAboutFeature2Description"),
    },
    {
      icon: onlineDegreeGif,
      title: t("homeAboutFeature3Title"),
      description: t("homeAboutFeature3Description"),
    },
  ];

  return (
    <section className="bg-[#0C3131] py-16 px-6 md:px-10 lg:px-24 min-h-screen">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side - Image with Gear */}
        <div className="relative flex-shrink-0">
          <div className="relative w-[300px] h-[350px] md:w-[350px] md:h-[400px]">
            <Image
              src={personWithBg}
              alt={t("homeAboutImageAlt")}
              fill
              priority
              sizes="(max-width: 768px) 300px, 350px"
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 text-center lg:text-start">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white font-medium cursor-pointer text-[#0C3131] rounded-lg text-sm mb-8"
          >
            <Star className="w-5 h-5" />
            {t("homeAboutLinkLabel")}
          </Link>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-relaxed ">
            <span className="text-primary">
              {t("homeAboutHeadingHighlight")}
            </span>{" "}
            <span className="text-white">{t("homeAboutHeadingRest")}</span>
          </h2>

          <p className="text-white text-xs sm:text-sm md:text-lg font-normal leading-relaxed">
            {t("homeAboutParagraph")}
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 xl:gap-8 mt-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-6 rounded-3xl bg-[#0d4242] "
          >
            <div className="flex-shrink-0 w-15 h-15 xl:w-18 xl:h-18 rounded-full bg-[#115F5E] flex items-center justify-center md:hidden xl:flex">
              <Image
                src={feature.icon}
                alt=""
                width={64}
                height={64}
                unoptimized
                className={cn(
                  "w-13 h-13 xl:w-16 xl:h-16 object-contain",
                  feature.icon === onlineDegreeGif &&
                    "xl:w-13 xl:h-13 w-11 h-11"
                )}
              />
            </div>
            <div>
              <h3 className="text-primary text-base mb-1">{feature.title}</h3>
              <p className="text-white text-[10px] sm:text-xs md:text-[10px] xl:text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <FeaturedCourses />
    </section>
  );
}
