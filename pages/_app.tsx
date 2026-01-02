import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import useLang from "@/components/hooks/useLang";
import { createSEOConfig } from "@/components/utils/createSEOConfig";
import { useRouter } from "next/router";
import { TailwindIndicator } from "@/components/utils/TailwindIndicator";
import dynamic from "next/dynamic";
import { Cairo } from "next/font/google";
import localFont from "next/font/local";
import { Provider } from "jotai";
import {
  setSession,
  clearSession,
  hydrateSessionFromStorage,
  sessionStore,
} from "@/lib/atoms";
import {
  getAccessToken,
  clearAccessToken,
  setAccessToken,
} from "@/components/services/cookies";
import auth from "@/components/services/auth";
import axios from "axios";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false }
);

// Initialize fonts at module scope (required by next/font)
const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  display: "swap",
});

const ARP = localFont({
  variable: "--font-arp",
  display: "swap",
  src: [
    {
      path: "../fonts/ARP/extralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/ARP/light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/ARP/base.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ARP/semibold.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ARP/semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/ARP/bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/ARP/bold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  const { lang, isArabic } = useLang();
  const router = useRouter();

  const HIDE_CHROME_ROUTES = ["/login", "/register"];
  const shouldHideChrome = HIDE_CHROME_ROUTES.some(
    (route) => router.pathname === route
  );

  const seoConfig = createSEOConfig({
    locale: lang,
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL,
    path: router.asPath,
  });

  // Ensure <html dir> and lang update instantly on client when language toggles (no full refresh needed)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      htmlElement.setAttribute("dir", isArabic ? "rtl" : "ltr");
      htmlElement.setAttribute("lang", lang);

      const activeFontClass = isArabic ? cairo.className : ARP.className;
      const activeFontVariable = isArabic
        ? "var(--font-cairo)"
        : "var(--font-arp)";

      htmlElement.classList.add(cairo.variable, ARP.variable);
      [htmlElement, bodyElement].forEach((element) => {
        element.classList.remove(cairo.className, ARP.className);
        element.classList.add(activeFontClass);
        element.style.setProperty("--font-active", activeFontVariable);
      });
    }
  }, [isArabic, lang]);

  return (
    <Provider store={sessionStore}>
      {!shouldHideChrome && <Navbar />}
      <DefaultSeo {...seoConfig} />
      <SessionInitializer />
      <div
        className={`${cairo.variable} ${ARP.variable} ${
          lang === "ar" ? cairo.className : ARP.className
        }`}
      >
        <Component {...pageProps} />
        <Toaster />
        <TailwindIndicator />
        {!shouldHideChrome && <Footer />}
      </div>
    </Provider>
  );
}

function SessionInitializer() {
  useEffect(() => {
    let mounted = true;

    async function init() {
      const persisted = hydrateSessionFromStorage();
      const cookieToken = getAccessToken();
      const token = cookieToken || persisted?.token || null;

      if (!token) {
        clearSession();
        return;
      }

      // Seed session immediately from persisted data if available
      setSession({
        token,
        email: persisted?.email ?? null,
        name: persisted?.name ?? null,
        id: persisted?.id ?? null,
      });

      // ensure cookie persists if only storage had the token
      if (!cookieToken && typeof window !== "undefined") {
        try {
          setAccessToken(token);
        } catch (e) {
          /* ignore */
        }
      }

      try {
        const user = await auth.me();
        if (!mounted) return;
        setSession({
          token,
          email: (user as any)?.email ?? persisted?.email ?? null,
          name: (user as any)?.name ?? persisted?.name ?? null,
          id: (user as any)?.id ?? persisted?.id ?? null,
        });
      } catch (e) {
        // Only clear session for explicit unauthorized responses. Otherwise keep cached session/token.
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          try {
            clearAccessToken();
          } catch (_) {}
          clearSession();
        }
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
