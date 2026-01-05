import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAtomValue } from "jotai";
import { sessionAtom } from "@/lib/atoms";
import { CourseFilters } from "./components/courses-filters";
import { CourseCard } from "./components/course-card";
import {
  getGuestCourses,
  getUserCourses,
  type GuestCourse,
} from "@/components/services/courses";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { t } = useTranslation("courses");
  const router = useRouter();
  const session = useAtomValue(sessionAtom);
  const isAuthenticated = Boolean(session?.token);

  const [courses, setCourses] = useState<GuestCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(
    () => new Set()
  );

  const pendingPageRef = React.useRef<number | null>(null);
  const scrollRafRef = React.useRef<number | null>(null);

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      if (nextPage === page) return;

      if (typeof window === "undefined") {
        setPage(nextPage);
        return;
      }

      // Scroll FIRST, then fetch/swap content after reaching top.
      pendingPageRef.current = nextPage;

      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }

      const isAlreadyAtTop = window.scrollY <= 2;
      if (isAlreadyAtTop) {
        setPage(nextPage);
        pendingPageRef.current = null;
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });

      const tick = () => {
        if (window.scrollY <= 2) {
          scrollRafRef.current = null;
          const pending = pendingPageRef.current;
          pendingPageRef.current = null;
          if (typeof pending === "number") setPage(pending);
          return;
        }

        scrollRafRef.current = window.requestAnimationFrame(tick);
      };

      scrollRafRef.current = window.requestAnimationFrame(tick);
    },
    [page]
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          const userCourses = await getUserCourses(100);
          if (!isCancelled) {
            setEnrolledCourseIds(new Set(userCourses.map((c) => c.id)));
          }
        } else {
          if (!isCancelled) setEnrolledCourseIds(new Set());
        }

        const data = await getGuestCourses(page);
        if (!isCancelled) setCourses(data);
      } catch (e) {
        toast.error(t("coursesLoadError"));
        if (!isCancelled) setCourses([]);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isCancelled = true;
    };
  }, [page, t, isAuthenticated]);

  const handleViewDetails = React.useCallback(
    async (id: number) => {
      await router.push(`/courses/${id}`);
    },
    [router]
  );

  const handleContinueLearning = React.useCallback(
    async (id: number) => {
      if (!isAuthenticated) {
        toast.message(t("loginRequiredToast"));
        return;
      }

      await router.push(`/my/courses/${id}`);
    },
    [isAuthenticated, router, t]
  );

  return (
    <main className="min-h-screen bg-background max-w-[1340px] mx-auto">
      <div className="container mx-auto px-4 py-8">
        <CourseFilters />

        {/* Course Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-secondary">
            <Spinner className="size-6" />
            <span className="ms-3 text-sm">{t("loadingCourses")}</span>
          </div>
        ) : (
          <>
            {courses.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                {t("noCourses")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-start">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.name}
                    description={course.description}
                    image={course.cover_image?.url ?? "/placeholder.svg"}
                    lessonsCount={course.lessons_count}
                    studentsCount={course.students_count}
                    isEnrolled={enrolledCourseIds.has(course.id)}
                    onViewDetails={handleViewDetails}
                    onContinueLearning={handleContinueLearning}
                  />
                ))}
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-2">
              {[1, 2, 3].map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={p === page ? "default" : "outline"}
                  className="h-10 w-10 rounded-lg"
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
