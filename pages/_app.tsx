import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import { Inter, Cairo } from "next/font/google";
import useLang from "@/components/hooks/useLang";
import { createSEOConfig } from "@/components/utils/createSEOConfig";
import { useRouter } from "next/router";
import { TailwindIndicator } from "@/components/utils/TailwindIndicator";
import dynamic from "next/dynamic";
const Toaster = dynamic(() => import("@/components/ui/sonner").then(m => m.Toaster), { ssr: false });

// Initialize fonts at module scope (required by next/font)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo", display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  const { lang, isArabic } = useLang();
  const router = useRouter();

  const seoConfig = createSEOConfig({
    locale: lang,
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL,
    path: router.asPath,
  });

  // Ensure <html dir> and lang update instantly on client when language toggles (no full refresh needed)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", isArabic ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
    }
  }, [isArabic, lang]);

  return (
    <>
      <DefaultSeo {...seoConfig} />
      <div className={`${inter.variable} ${cairo.variable} ${lang === "ar" ? cairo.className : inter.className}`}>
        <Component {...pageProps} />
        <Toaster />
        <TailwindIndicator />
      </div>
    </>
  );
}
