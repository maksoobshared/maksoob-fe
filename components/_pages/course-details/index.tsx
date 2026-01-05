import React, { useCallback, useEffect, useMemo, useState } from "react";
import CourseHero from "./components/course-hero";
import CourseBenefits from "./components/course-benefits";
import LessonsList from "./components/lessons-list";
import {
  getGuestCourseDetails,
  GuestCourseDetails,
  enrollCourse,
} from "@/components/services/courses";
import { getAccessToken } from "@/components/services/cookies";
import { useRouter } from "next/router";
import { Popup } from "@/components/shared/popup";
import { ArrowRight } from "lucide-react";
import useTranslation from "next-translate/useTranslation";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import useLang from "@/components/hooks/useLang";

type CourseWatchPageProps = {
  id: string;
};

export default function CourseWatchPage({ id }: CourseWatchPageProps) {
  const { t } = useTranslation("courses");
  const { isArabic } = useLang();
  const router = useRouter();
  const [course, setCourse] = useState<GuestCourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrollSuccessOpen, setIsEnrollSuccessOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!id) return;
      try {
        if (!cancelled) setIsLoading(true);
        const res = await getGuestCourseDetails(id);
        if (!cancelled) setCourse(res);
      } catch {
        if (!cancelled) setCourse(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const durationHours = useMemo(() => {
    const seconds = course?.duration;
    if (typeof seconds !== "number") return undefined;
    return Math.round((seconds / 3600) * 10) / 10;
  }, [course?.duration]);

  const handleEnroll = useCallback(async () => {
    if (!id) return;

    const token = getAccessToken();
    if (!token) {
      const redirect = router.asPath || `/courses/${encodeURIComponent(id)}`;
      await router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    try {
      setIsEnrolling(true);
      await enrollCourse(id);
      setIsEnrollSuccessOpen(true);
    } finally {
      setIsEnrolling(false);
    }
  }, [id, router]);

  const handleEnrollSuccessOpenChange = useCallback(
    (open: boolean) => {
      setIsEnrollSuccessOpen(open);
      if (!open && id) {
        void router.push(`/my/courses/${encodeURIComponent(String(id))}`);
      }
    },
    [id, router]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-secondary">
        <Spinner className="size-6" />
        <span className="ms-3 text-sm">{t("courseDetailsLoading")}</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-16 min-h-[50dvh] text-center text-sm text-muted-foreground">
        {t("courseDetailsNoData")}
      </div>
    );
  }

  return (
    <div className="">
      <CourseHero
        title={course.name}
        description={course.description}
        teacherName={course.teacher?.name}
        durationHours={durationHours}
        coverImageUrl={course.cover_image?.url}
        onEnroll={handleEnroll}
        isEnrolling={isEnrolling}
      />
      <CourseBenefits />
      <LessonsList durationSeconds={course?.duration} />

      <Popup
        variant="success"
        open={isEnrollSuccessOpen}
        onOpenChange={handleEnrollSuccessOpenChange}
        showCloseButton={false}
        title={t("enrollSuccessTitle")}
        description={t("enrollSuccessDescription")}
        buttons={[
          {
            label: t("enrollSuccessGoToMyCourse"),
            variant: "secondary",
            onClick: () => handleEnrollSuccessOpenChange(false),
            icon: (
              <ArrowRight className={cn("h-4 w-4", isArabic && "rotate-180")} />
            ),
          },
        ]}
      />
    </div>
  );
}
