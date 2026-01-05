"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import useTranslation from "next-translate/useTranslation";
import { sessionAtom } from "@/lib/atoms";
import { LessonInfo } from "./components/lesson-info";
import { LearningPath } from "./components/learning-path";
import { LessonPlayer } from "./components/lesson-player";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  completeLesson,
  getCourseSections,
  getSectionLessons,
  type CourseLesson,
  type CourseSection,
} from "@/components/services/courses";
import { getAccessToken, setAccessToken } from "@/components/services/cookies";
import useLang from "@/components/hooks/useLang";
import { cn } from "@/lib/utils";

type SectionWithLessons = CourseSection & { lessons: CourseLesson[] };

function getFirstLessonId(sections: SectionWithLessons[]): number | null {
  for (const section of sections) {
    const first = section.lessons[0];
    if (first) return first.id;
  }
  return null;
}

function findLessonById(
  sections: SectionWithLessons[],
  lessonId: number | null
): CourseLesson | null {
  if (!lessonId) return null;
  for (const section of sections) {
    const found = section.lessons.find((l) => l.id === lessonId);
    if (found) return found;
  }
  return null;
}

export default function MyCoursePage() {
  const router = useRouter();
  const session = useAtomValue(sessionAtom);
  const { t } = useTranslation("my-courses");
  const { isArabic } = useLang();
  const cookieToken = typeof window !== "undefined" ? getAccessToken() : null;
  const token = session?.token || cookieToken;
  const isAuthenticated = Boolean(token);

  const courseId = useMemo(() => {
    const raw = router.query?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value ? String(value) : null;
  }, [router.query?.id]);

  const [sections, setSections] = useState<SectionWithLessons[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(
    () => new Set()
  );
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (!isAuthenticated) {
      void router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session?.token && !getAccessToken()) {
      try {
        setAccessToken(session.token);
      } catch {
        // ignore
      }
    }
  }, [session?.token]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!router.isReady) return;
      if (!isAuthenticated) return;
      if (!courseId) return;

      try {
        if (!cancelled) setIsLoading(true);
        const courseSections = await getCourseSections(courseId);

        const sectionsWithLessons = await Promise.all(
          courseSections.map(async (section) => {
            try {
              const lessons = await getSectionLessons(section.id);
              return { ...section, lessons };
            } catch {
              return { ...section, lessons: [] };
            }
          })
        );

        if (cancelled) return;
        setSections(sectionsWithLessons);

        setCurrentLessonId((prev) => {
          if (typeof prev === "number") return prev;
          return getFirstLessonId(sectionsWithLessons);
        });
      } catch (e) {
        if (!cancelled) {
          setSections([]);
          toast.error(t("myCourseDetailsLoadError"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [courseId, isAuthenticated, router.isReady, t]);

  const currentLesson = useMemo(
    () => findLessonById(sections, currentLessonId),
    [currentLessonId, sections]
  );

  const currentLessonUrl = useMemo(() => {
    if (!currentLesson) return null;
    if (currentLesson.type === "pdf") {
      return (
        currentLesson.pdf?.url ||
        currentLesson.pdf_url ||
        currentLesson.file_url ||
        null
      );
    }
    return currentLesson.video_url || currentLesson.file_url || null;
  }, [currentLesson]);

  const handleSelectLesson = useCallback((lessonId: number) => {
    setCurrentLessonId(lessonId);
  }, []);

  const handleMarkCompleted = useCallback(async () => {
    if (!currentLesson) return;
    if (completedLessonIds.has(currentLesson.id)) return;

    try {
      setIsMarkingCompleted(true);
      await completeLesson(currentLesson.id);
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        next.add(currentLesson.id);
        return next;
      });
      toast.success(t("myCourseDetailsMarkedCompleted"));
    } catch {
      toast.error(t("myCourseDetailsMarkCompletedError"));
    } finally {
      setIsMarkingCompleted(false);
    }
  }, [completedLessonIds, currentLesson, t]);

  const hasAnyLessons = useMemo(
    () => sections.some((s) => s.lessons.length > 0),
    [sections]
  );

  if (isLoading) {
    return (
      <div className="flex items-center min-h-[100dvh] justify-center py-16 text-secondary">
        <Spinner className="size-6" />
        <span className="ms-3 text-sm">{t("myCourseDetailsLoading")}</span>
      </div>
    );
  }

  if (!hasAnyLessons) {
    return (
      <div className="py-16 text-center min-h-[40dvh] text-sm text-muted-foreground">
        {t("myCourseDetailsNoData")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="mx-auto  px-4 md:px-10 py-4">
        <div
          className={cn(
            "mt-4 flex flex-col gap-6 lg:flex-row",
            isArabic ? "lg:flex-row-reverse" : ""
          )}
        >
          <div className="flex-1">
            <LessonPlayer
              type={currentLesson?.type}
              url={currentLessonUrl}
              title={currentLesson?.name}
            />
            <LessonInfo
              title={currentLesson?.name ?? "—"}
              durationSeconds={currentLesson?.duration}
              description={currentLesson?.description ?? ""}
              isCompleted={
                currentLesson ? completedLessonIds.has(currentLesson.id) : false
              }
              isMarkingCompleted={isMarkingCompleted}
              onMarkCompleted={currentLesson ? handleMarkCompleted : undefined}
            />
          </div>

          <div className="w-full lg:w-96">
            <LearningPath
              sections={sections}
              currentLessonId={currentLessonId}
              completedLessonIds={completedLessonIds}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
