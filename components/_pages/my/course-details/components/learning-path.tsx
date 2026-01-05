import React from "react";
import { Video, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import useTranslation from "next-translate/useTranslation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useLang from "@/components/hooks/useLang";
import type {
  CourseLesson,
  CourseSection,
} from "@/components/services/courses";

interface LearningPathProps {
  sections: Array<CourseSection & { lessons: CourseLesson[] }>;
  currentLessonId: number | null;
  completedLessonIds: Set<number>;
  onSelectLesson: (lessonId: number) => void;
}

export function LearningPath({
  sections,
  currentLessonId,
  completedLessonIds,
  onSelectLesson,
}: LearningPathProps) {
  const { lang } = useLang();
  const { t } = useTranslation("my-courses");

  const defaultOpenSectionId = React.useMemo(() => {
    if (typeof currentLessonId !== "number") return sections[0]?.id;
    for (const section of sections) {
      if (section.lessons.some((lesson) => lesson.id === currentLessonId)) {
        return section.id;
      }
    }
    return sections[0]?.id;
  }, [currentLessonId, sections]);

  const allLessons = sections.flatMap((s) => s.lessons);
  const totalCount = allLessons.length;
  const completedCount = allLessons.reduce(
    (acc, lesson) => acc + (completedLessonIds.has(lesson.id) ? 1 : 0),
    0
  );
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const formatDuration = (seconds: number) => {
    if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "—";
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    if (hours > 0)
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const resolveLessonIcon = (lesson: CourseLesson) => {
    if (lesson.type === "pdf") return FileText;
    return Video;
  };

  const resolveLessonTypeLabel = (lesson: CourseLesson) => {
    if (lesson.type === "youtube") return t("lessonTypeVideo");
    if (lesson.type === "pdf") return t("lessonTypePDF");
    return lesson.type;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-foreground">
        {t("learningPathTitle")}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("learningPathSubtitle")}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {t("learningPathProgress")}
          </span>
          <span className="text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
        <Progress value={progressPercentage} className="mt-2 h-2" />
      </div>

      <div className="mt-6">
        <Accordion
          type="single"
          collapsible
          defaultValue={
            typeof defaultOpenSectionId === "number"
              ? String(defaultOpenSectionId)
              : undefined
          }
          className="w-full"
        >
          {sections.map((section) => {
            const sectionTitle =
              typeof section.name === "string"
                ? section.name
                : section.name?.[lang] ??
                  section.name?.en ??
                  section.name?.ar ??
                  "—";

            return (
              <AccordionItem key={section.id} value={String(section.id)}>
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="text-xs font-medium text-muted-foreground">
                    {sectionTitle}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="pb-0">
                  <div className="space-y-2">
                    {section.lessons.map((lesson, index) => {
                      const Icon = resolveLessonIcon(lesson);
                      const isCompleted = completedLessonIds.has(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;
                      const displayIndex = index + 1;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            "w-full text-left  flex items-center gap-3 rounded-lg cursor-pointer border p-4 min-h-[84px] transition-colors",
                            isCurrent
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium p-5",
                              isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "bg-border text-foreground"
                            )}
                          >
                            {displayIndex}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "text-xs md:text-sm font-medium leading-snug break-words overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]",
                                  isCurrent && "text-foreground"
                                )}
                              >
                                {lesson.name}
                              </span>
                              {isCompleted && (
                                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "mt-0.5 flex items-center gap-1 text-xs",
                                "text-muted-foreground"
                              )}
                            >
                              <Icon className="h-3 w-3" />
                              <span>{resolveLessonTypeLabel(lesson)}</span>
                              <span className="ms-1">
                                {formatDuration(lesson.duration)}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
