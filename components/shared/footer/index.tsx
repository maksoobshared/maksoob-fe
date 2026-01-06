import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import useTranslation from "next-translate/useTranslation";
import useLang from "@/components/hooks/useLang";

export function Footer() {
  const { t } = useTranslation("footer");
  const year = new Date().getFullYear();
  const { isArabic } = useLang();

  return (
    <footer>
      {/* Main Footer Content */}
      <div className="bg-[#0C3131]">
        <div className="max-w-[1330px] mx-auto px-6 py-[70px]">
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-0">
            {/* Left: Logo + Description */}
            <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-4 sm:gap-8 lg:pr-12">
              <Link
                href="/"
                className="text-white text-2xl font-bold tracking-wide whitespace-nowrap"
              >
                maksoob
              </Link>

              <p className="text-white text-xs max-w-md">{t("description")}</p>
            </div>

            {/* Right: Links + Social */}
            <div className="flex-1 pt-8 md:pt-0 lg:ps-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {/* Services */}
                <div className="text-center md:text-start">
                  <h3 className="text-primary font-semibold text-sm mb-4">
                    {t("services")}
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-white text-xs hover:text-primary transition-colors"
                      >
                        {t("linkExample")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-white text-xs hover:text-primary transition-colors"
                      >
                        {t("linkExample")}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* About */}
                <div className="text-center md:text-start">
                  <h3 className="text-primary font-semibold text-sm mb-4">
                    {t("about")}
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-white text-xs hover:text-primary transition-colors"
                      >
                        {t("linkExample")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-white text-xs hover:text-primary transition-colors"
                      >
                        {t("linkExample")}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Us */}
                <div className="text-center md:text-start">
                  <h3 className="text-primary text-sm font-semibold mb-4">
                    {t("contactUs")}
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-white text-xs hover:text-primary transition-colors"
                      >
                        {t("linkExample")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-white text-xs hover:text-primary transition-colors"
                      >
                        {t("linkExample")}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Follow Us */}
                <div className="text-center md:text-start">
                  <h3 className="text-primary text-sm font-semibold mb-4">
                    {t("followUs")}
                  </h3>
                  <div className="flex justify-center md:justify-start gap-4">
                    <Link
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      <span className="sr-only">{t("facebook")}</span>
                    </Link>
                    <Link
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="sr-only">{t("twitter")}</span>
                    </Link>
                    <Link
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="sr-only">{t("instagram")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-height separator (desktop only) */}
            <div className="hidden lg:block absolute start-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-primary/30" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/30 md:mx-0 !mx-6" />

        {/* Copyright */}
        <div className="bg-[#0C3131] py-[50px]">
          <p className="text-center text-white text-xs  px-[60px]">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
