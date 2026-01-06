import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Banner } from "@/components/services/banners";

type BannersSliderProps = {
  banners: Banner[];
  intervalMs?: number;
};

export default function BannersSlider({
  banners,
  intervalMs = 5000,
}: BannersSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileAspectById, setMobileAspectById] = useState<
    Record<number, number>
  >({});

  const normalizedBanners = useMemo(
    () => (Array.isArray(banners) ? banners.filter(Boolean) : []),
    [banners]
  );

  useEffect(() => {
    if (normalizedBanners.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % normalizedBanners.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, normalizedBanners.length]);

  useEffect(() => {
    if (activeIndex >= normalizedBanners.length) setActiveIndex(0);
  }, [activeIndex, normalizedBanners.length]);

  if (normalizedBanners.length === 0) return null;

  const activeBanner = normalizedBanners[activeIndex];
  const activeMobileAspect = activeBanner
    ? mobileAspectById[activeBanner.id] ?? 1
    : 1;

  return (
    <section className="relative w-full overflow-hidden xl:h-[90svh]">
      {/* Desktop (>=1280px): full-bleed sliding track */}
      <div
        className="hidden xl:flex w-full transition-transform duration-700 ease-in-out xl:h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {normalizedBanners.map((banner) => {
          const desktopUrl = banner.image?.url ?? null;

          return (
            <div
              key={banner.id}
              className="relative w-full flex-none xl:h-full"
              aria-label={banner.title}
            >
              <div className="absolute inset-0">
                {desktopUrl ? (
                  <Image
                    src={desktopUrl}
                    alt={banner.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile (<1280px): height follows active image (with max height) */}
      <div className="xl:hidden relative w-full flex justify-center">
        {/* Background is full width but only as tall as the image */}
        <div className="absolute inset-0">
          {(() => {
            const desktopUrl = activeBanner?.image?.url ?? null;
            const mobileUrl =
              activeBanner?.image_mobile?.url ??
              activeBanner?.image?.url ??
              null;
            const bgUrl = desktopUrl ?? mobileUrl;

            return bgUrl ? (
              <>
                <Image
                  src={bgUrl}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover scale-110 blur-2xl"
                />
                <div className="absolute inset-0 bg-primary/15" />
              </>
            ) : (
              <div className="h-full w-full bg-muted" />
            );
          })()}
        </div>

        <div
          className="relative z-10 w-full max-w-[420px] max-h-[85svh]"
          style={{ aspectRatio: String(activeMobileAspect) }}
        >
          {(() => {
            const mobileUrl =
              activeBanner?.image_mobile?.url ??
              activeBanner?.image?.url ??
              null;

            return mobileUrl ? (
              <Image
                src={mobileUrl}
                alt={activeBanner?.title ?? ""}
                fill
                priority
                sizes="(max-width: 1279px) 420px, 100vw"
                className="object-contain"
                onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                  if (!naturalWidth || !naturalHeight || !activeBanner) return;
                  const nextAspect = naturalWidth / naturalHeight;
                  setMobileAspectById((prev) => {
                    if (prev[activeBanner.id] === nextAspect) return prev;
                    return { ...prev, [activeBanner.id]: nextAspect };
                  });
                }}
              />
            ) : null;
          })()}
        </div>
      </div>

      {/* Dots (fixed; does not move with slides) */}
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {normalizedBanners.map((_, i) => (
          <div
            key={i}
            className={
              i === activeIndex
                ? "h-2 w-2 rounded-full bg-primary"
                : "h-2 w-2 rounded-full bg-muted-foreground/70"
            }
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
