"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/_pages/courses/components/course-card";
import { cn } from "@/lib/utils";
import useLang from "@/components/hooks/useLang";
import useTranslation from "next-translate/useTranslation";
import {
  getUserCoursesPage,
  type UserCourse,
  type UserCoursesPagination,
} from "@/components/services/courses";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function ContinueWatching() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<UserCoursesPagination | null>(
    null
  );
  const { isArabic } = useLang();
  const { t } = useTranslation("my-courses");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        if (!cancelled) setIsLoading(true);
        const res = await getUserCoursesPage({
          page: currentPage,
          perPage: 15,
        });
        if (!cancelled) {
          setCourses(res.data);
          setPagination(res.pagination ?? null);
        }
      } catch {
        if (!cancelled) {
          setCourses([]);
          setPagination(null);
          toast.error(t("myCoursesLoadCoursesError"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [currentPage, t]);

  const pageLinks =
    pagination?.links?.filter((l) => typeof l.page === "number") ?? [];
  const hasMultiplePages = (pagination?.last_page ?? 1) > 1;

  return (
    <div className="mt-10 ">
      <div className="flex items-center justify-between ">
        <h2 className="max-[410px]:text-sm text-base sm:text-2xl md:text-3xl font-medium text-secondary">
          {t("myCoursesContinueWatchingTitle")}
        </h2>
        <Button
          variant="outline"
          className="gap-2 text-xs max-[410px]:text-[8px] sm:text-sm bg-white text-secondary border border-secondary rounded-lg h-[32px] sm:h-[48px] sm:min-w-[186px]"
        >
          {t("myCoursesAllCourses")}
          <ArrowRight
            className={cn("h-4 w-4 hidden sm:block", isArabic && "rotate-180")}
            aria-hidden
          />
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 justify-items-center md:grid-cols-2 md:justify-items-stretch lg:grid-cols-3">
        {" "}
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10 text-secondary">
            <Spinner className="size-6" />
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={
                course.name ??
                t("myCoursesCourseFallbackTitle", { id: course.id })
              }
              description={course.description ?? ""}
              image={course.cover_image?.url ?? ""}
              lessonsCount={course.lessons_count}
              studentsCount={course.students_count}
              isEnrolled
              onContinueLearning={(id) => void router.push(`/my/courses/${id}`)}
              onViewDetails={(id) => void router.push(`/courses/${id}`)}
            />
          ))
        )}
      </div>

      {hasMultiplePages && pageLinks.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {pageLinks.map((link) => (
            <Button
              key={link.page}
              type="button"
              variant={link.active ? "default" : "outline"}
              className="h-10 w-10 rounded-lg"
              onClick={() => setCurrentPage(link.page!)}
            >
              {link.page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
