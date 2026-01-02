"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Search,
  Menu,
  X,
  User,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "./language-switcher";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms";
import { logout } from "@/components/services/auth";
import useTranslation from "next-translate/useTranslation";
import useLang from "@/components/hooks/useLang";

export function Navbar() {
  const router = useRouter();
  const { t } = useTranslation("navbar");
  const { isArabic } = useLang();
  const [activeLink, setActiveLink] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuIconRef = useRef<SVGSVGElement | null>(null);
  const closeIconRef = useRef<SVGSVGElement | null>(null);
  const session = useAtomValue(sessionAtom);
  const isAuthenticated = useMemo(
    () => Boolean(session?.token),
    [session?.token]
  );

  useEffect(() => {
    if (isMenuOpen) setIsMenuMounted(true);
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    const menuEl = mobileMenuRef.current;
    if (!menuEl || !isMenuMounted) return;

    gsap.killTweensOf(menuEl);

    if (isMenuOpen) {
      gsap.set(menuEl, { xPercent: -100 });
      gsap.to(menuEl, {
        xPercent: 0,
        duration: 0.75,
        ease: "power4.out",
      });
      return;
    }

    gsap.to(menuEl, {
      xPercent: -100,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => setIsMenuMounted(false),
    });
  }, [isMenuMounted, isMenuOpen]);

  useEffect(() => {
    const menuSvg = menuIconRef.current;
    const closeSvg = closeIconRef.current;
    if (!menuSvg || !closeSvg) return;

    gsap.killTweensOf([menuSvg, closeSvg]);

    if (isMenuOpen) {
      gsap.to(menuSvg, {
        autoAlpha: 0,
        rotate: -90,
        transformOrigin: "50% 50%",
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.fromTo(
        closeSvg,
        { autoAlpha: 0, rotate: 90 },
        {
          autoAlpha: 1,
          rotate: 0,
          transformOrigin: "50% 50%",
          duration: 0.3,
          ease: "power2.out",
        }
      );
      return;
    }

    gsap.to(closeSvg, {
      autoAlpha: 0,
      rotate: 90,
      transformOrigin: "50% 50%",
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.fromTo(
      menuSvg,
      { autoAlpha: 0, rotate: -90 },
      {
        autoAlpha: 1,
        rotate: 0,
        transformOrigin: "50% 50%",
        duration: 0.25,
        ease: "power2.out",
      }
    );
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuMounted]);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      isAuthenticated
        ? { id: "my-learning", label: t("myLearning"), href: "/my/courses" }
        : { id: "services", label: t("services"), href: "/services" },
      { id: "courses", label: t("courses"), href: "/courses" },
      { id: "about", label: t("aboutUs"), href: "/about" },
    ],
    [isAuthenticated, t]
  );

  return (
    <header className="w-full shadow-2xs h-[96px] flex items-center bg-secondary lg:bg-white">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-0 xl:px-[96px]">
        {/* Mobile: Menu button */}
        <button
          type="button"
          className="lg:hidden text-white"
          aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className="relative block h-6 w-6 cursor-pointer">
            <Menu ref={menuIconRef} className="absolute inset-0 h-6 w-6" />
            <X
              ref={closeIconRef}
              className="absolute inset-0 h-6 w-6 opacity-0"
            />
          </span>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white lg:text-primary lg:justify-self-auto lg:text-left flex-1 lg:flex-none text-center"
        >
          maksoob
        </Link>

        {/* Desktop: Search Bar */}
        <div className="relative hidden lg:flex items-center w-64 lg:w-80">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="ps-10 pe-4 h-10 rounded-xl border-[#9EA2AE] bg-white"
          />
        </div>

        {/* Desktop: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                activeLink === link.id
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setActiveLink(link.id)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Desktop: language switcher */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile: search (to courses) if logged in; otherwise Join Us */}
          <div className="lg:hidden">
            {isAuthenticated ? (
              <Link
                href="/courses"
                aria-label={t("goToCourses")}
                className="text-white"
              >
                <Search className="h-6 w-6" />
              </Link>
            ) : (
              <Link href="/login" className="text-white text-xs">
                {t("joinUs")}
              </Link>
            )}
          </div>

          {/* Desktop: Join Us OR user icon */}
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <button
                type="button"
                className="text-secondary cursor-pointer"
                aria-label={t("user")}
              >
                <User className="h-6 w-6" />
              </button>
            ) : (
              <Button
                className="ms-2 text-white rounded-lg px-6 h-10 font-normal"
                variant={"secondary"}
                asChild
              >
                <Link href="/login">{t("joinUs")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Full-screen menu */}
      {isMenuMounted && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-secondary lg:hidden transform-gpu will-change-transform"
        >
          <div className="h-[96px] flex items-center px-10">
            <button
              type="button"
              className="text-white"
              aria-label={t("closeMenu")}
              onClick={closeMenu}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex-1 text-center">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-white"
                onClick={closeMenu}
              >
                maksoob
              </Link>
            </div>
            <div className="w-6" />
          </div>

          <div className="px-10 py-8 flex flex-col gap-8 h-[calc(100vh-96px)]">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-white text-lg font-medium"
                  onClick={() => {
                    setActiveLink(link.id);
                    closeMenu();
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {isAuthenticated && (
                <button
                  type="button"
                  className="w-full h-11 rounded-lg bg-destructive text-white font-medium"
                  onClick={async () => {
                    try {
                      await logout();
                    } finally {
                      closeMenu();
                      try {
                        await router.replace("/");
                      } finally {
                        router.reload();
                      }
                    }
                  }}
                >
                  {t("logout")}
                </button>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="#"
                    className="text-white hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="text-white hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="text-white hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                </div>

                <LanguageSwitcher className="text-white me-0" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
