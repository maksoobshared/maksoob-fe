"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import useLang from "@/components/hooks/useLang";
import type { Faq } from "@/components/services/faqs";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  iconSide: "start" | "end";
};

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  iconSide,
}: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);
  const iconPlusRef = useRef<HTMLSpanElement | null>(null);
  const iconMinusRef = useRef<HTMLSpanElement | null>(null);
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    const contentEl = contentRef.current;
    const contentInnerEl = contentInnerRef.current;
    const plusEl = iconPlusRef.current;
    const minusEl = iconMinusRef.current;
    if (!contentEl || !contentInnerEl || !plusEl || !minusEl) return;

    gsap.killTweensOf([contentEl, plusEl, minusEl]);

    gsap.set([plusEl, minusEl], {
      transformOrigin: "50% 50%",
      rotate: 0,
      scale: 1,
    });

    // First mount: set styles instantly (no animation)
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (isOpen) {
        contentEl.style.height = `${contentInnerEl.offsetHeight}px`;
        contentEl.style.opacity = "1";
        plusEl.style.opacity = "0";
        minusEl.style.opacity = "1";
      } else {
        contentEl.style.height = "0px";
        contentEl.style.opacity = "0";
        plusEl.style.opacity = "1";
        minusEl.style.opacity = "0";
      }
      return;
    }

    if (isOpen) {
      const h = contentInnerEl.offsetHeight;
      gsap.to(contentEl, {
        height: h,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      const tl = gsap.timeline();
      tl.to(
        plusEl,
        {
          rotate: 180,
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        0
      );
      tl.fromTo(
        minusEl,
        { rotate: -180, opacity: 0 },
        {
          rotate: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        0
      );
    } else {
      gsap.to(contentEl, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });

      const tl = gsap.timeline();
      tl.to(
        minusEl,
        {
          rotate: 180,
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        0
      );
      tl.fromTo(
        plusEl,
        { rotate: -180, opacity: 0 },
        {
          rotate: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        0
      );
    }
  }, [isOpen]);

  const isStart = iconSide === "start";

  return (
    <div className="w-full bg-white rounded-lg shadow-lg px-2 sm:px-6 py-2 sm:py-6 data-[open=true]:shadow-sm ">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={
          "group w-full flex items-center cursor-pointer py-4 text-left hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 " +
          (isStart ? "flex-row" : "flex-row-reverse")
        }
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <span
            ref={iconPlusRef}
            className="absolute inset-0 flex items-center justify-center text-secondary text-3xl leading-none"
            aria-hidden
          >
            +
          </span>
          <span
            ref={iconMinusRef}
            className="absolute inset-0 flex items-center justify-center text-primary text-3xl leading-none"
            aria-hidden
          >
            −
          </span>
        </span>

        <span className={"flex-1 " + (isStart ? "ps-4" : "pe-4")}>
          <span className="block text-sm font-medium text-foreground">
            {question}
          </span>
        </span>
      </button>

      <div ref={contentRef} className="overflow-hidden">
        <div
          ref={contentInnerRef}
          className={isStart ? "ps-[52px] pb-4" : "pe-[52px] pb-4"}
        >
          <p className="text-xs sm:text-sm text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

type FAQSectionProps = {
  faqs: Faq[];
};

export function FAQSection({ faqs }: FAQSectionProps) {
  const { dir } = useLang();
  const iconSide: "start" | "end" = dir === "rtl" ? "end" : "start";

  const [openId, setOpenId] = useState<number | null>(
    () => faqs?.[0]?.id ?? null
  );

  // If the FAQs list changes (SSR -> client rehydrate edge cases), keep a sensible open item.
  useEffect(() => {
    if (!faqs?.length) {
      setOpenId(null);
      return;
    }
    setOpenId((prev) => {
      if (prev == null) return faqs[0].id;
      return faqs.some((f) => f.id === prev) ? prev : faqs[0].id;
    });
  }, [faqs]);

  const leftFaqs = useMemo(() => faqs.filter((_, i) => i % 2 === 0), [faqs]);
  const rightFaqs = useMemo(() => faqs.filter((_, i) => i % 2 === 1), [faqs]);

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed">
            <span className="  text-foreground">Frequently </span>
            <span className="font-semibold text-secondary">Asked</span>
          </h2>
          <h2 className="font-semibold text-secondary text-2xl sm:text-3xl md:text-4xl">
            Questions
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {leftFaqs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === faq.id ? null : faq.id))
                }
                iconSide={iconSide}
              />
            ))}
          </div>

          <div className="space-y-4">
            {rightFaqs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === faq.id ? null : faq.id))
                }
                iconSide={iconSide}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
