"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import momSonImg from "../assets/momson.png";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import useLang from "@/components/hooks/useLang";

export function CtaBanner() {
  const { isArabic } = useLang();
  const router = useRouter();
  const session = useAtomValue(sessionAtom);
  const isLoggedIn = Boolean(session?.token);

  return (
    <section className="px-6 md:px-10 lg:px-24 pt-4 lg:pt-20 pb-32">
      <div className="relative">
        <div className="bg-[#CCEAEC] rounded-3xl relative overflow-visible px-6 md:px-10 lg:px-24 py-10 md:py-12 lg:pr-[600px] text-center lg:text-start">
          <div className="lg:min-w-[500px]">
            <p className="text-black text-base sm:text-2xl xl:text-3xl font-semibold leading-relaxed pb-4">
              50% Offer For Very First 100
            </p>
            <p className="text-black text-base sm:text-2xl xl:text-3xl font-semibold leading-relaxed pb-2">
              Student’s & Teachers
            </p>

            <div className="mt-6">
              <Button
                className="h-12 w-full lg:w-auto"
                variant="secondary"
                onClick={() =>
                  void router.push(isLoggedIn ? "/courses" : "/login")
                }
              >
                Become a student
                <ArrowRight
                  className={cn("h-4 w-4", isArabic && "rotate-180")}
                  aria-hidden
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop/tablet image: sibling overlay so it can truly break out */}
        <div className="hidden lg:block absolute right-0 xl:right-10 bottom-0 lg:w-[430px] xl:w-[520px] lg:h-[500px] xl:h-[500px] z-20 pointer-events-none">
          <Image
            src={momSonImg}
            alt=""
            fill
            priority
            sizes="520px"
            className="object-contain object-bottom -scale-x-100"
          />
        </div>
      </div>
    </section>
  );
}
