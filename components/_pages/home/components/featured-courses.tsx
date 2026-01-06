"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CourseCard } from "@/components/_pages/courses/components/course-card";
import { cn } from "@/lib/utils";
import useLang from "@/components/hooks/useLang";
import useTranslation from "next-translate/useTranslation";
import {
  getGuestCourses,
  type GuestCourse,
} from "@/components/services/courses";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function FeaturedCourses() {
  const [courses, setCourses] = useState<GuestCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { isArabic } = useLang();
  const { t } = useTranslation("home");
  const router = useRouter();

  useEffect(() => {
    const computePageSize = () => {
      if (typeof window === "undefined") return 3;
      const w = window.innerWidth;
      if (w >= 1024) return 3; // lg+
      if (w >= 768) return 2; // md
      return 1; // mobile
    };

    const apply = () => setPageSize(computePageSize());

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        if (!cancelled) setIsLoading(true);
        const res = await getGuestCourses(1);
        if (!cancelled) {
          setCourses(res.slice(0, 15));
          setStartIndex(0);
        }
      } catch {
        if (!cancelled) {
          setCourses([]);
          toast.error(t("homeFeaturedLoadCoursesError"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    setStartIndex((prev) => {
      const maxStart = Math.max(0, courses.length - pageSize);
      return Math.min(prev, maxStart);
    });
  }, [courses.length, pageSize]);

  const visibleCourses = courses.slice(startIndex, startIndex + pageSize);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + pageSize < courses.length;

  return (
    <div className="mt-10 mb-8">
      <div className="flex items-center justify-between ">
        <h2 className="text-xl text-center sm:text-left  sm:text-2xl md:text-3xl font-medium text-white">
          {t("homeFeaturedHeadingPrefix")}{" "}
          <span className="text-primary">
            {t("homeFeaturedHeadingHighlight")}
          </span>
        </h2>
        <div className="hidden sm:block">
          <Button
            variant="outline"
            className=" gap-2 text-xs max-[410px]:text-[8px] sm:text-sm bg-transparent font-normal text-white border border-white rounded-xl h-[32px] sm:h-[48px] sm:min-w-[186px]"
            onClick={() => void router.push("/courses")}
          >
            {t("homeFeaturedAllCourses")}
            <ArrowRight
              className={cn(
                "h-4 w-4 hidden sm:block",
                isArabic && "rotate-180"
              )}
              aria-hidden
            />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 justify-items-center md:grid-cols-2 md:justify-items-stretch lg:grid-cols-3">
        {" "}
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10 text-secondary">
            <Spinner className="size-6" />
          </div>
        ) : (
          visibleCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={
                course.name ??
                t("homeFeaturedCourseFallbackTitle", { id: course.id })
              }
              description={course.description ?? ""}
              image={course.cover_image?.url ?? ""}
              lessonsCount={course.lessons_count}
              studentsCount={course.students_count}
              isEnrolled={false}
              onViewDetails={(id) => void router.push(`/courses/${id}`)}
            />
          ))
        )}
      </div>

      {!isLoading && courses.length > pageSize && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 rounded-full bg-primary text-white border-primary hover:bg-white hover:border-white hover:text-primary transation-colors"
            onClick={() =>
              setStartIndex((prev) => Math.max(0, prev - pageSize))
            }
            disabled={!canGoPrev}
            aria-label={t("homeFeaturedPrevAria")}
          >
            <ChevronLeft className={cn("h-5 w-5", isArabic && "rotate-180")} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 rounded-full bg-primary text-white border-primary hover:bg-white hover:border-white hover:text-primary transation-colors"
            onClick={() =>
              setStartIndex((prev) =>
                Math.min(
                  prev + pageSize,
                  Math.max(0, courses.length - pageSize)
                )
              )
            }
            disabled={!canGoNext}
            aria-label={t("homeFeaturedNextAria")}
          >
            <ChevronRight className={cn("h-5 w-5", isArabic && "rotate-180")} />
          </Button>
        </div>
      )}
    </div>
  );
}
