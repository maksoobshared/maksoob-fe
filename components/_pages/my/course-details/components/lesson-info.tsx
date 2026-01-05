import { Check } from "lucide-react";
import useTranslation from "next-translate/useTranslation";
import { Button } from "@/components/ui/button";

interface LessonInfoProps {
  title: string;
  durationSeconds?: number;
  description: string;
  isCompleted?: boolean;
  isMarkingCompleted?: boolean;
  onMarkCompleted?: () => void;
}

function formatDuration(seconds?: number) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "—";
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function LessonInfo({
  title,
  durationSeconds,
  description,
  isCompleted,
  isMarkingCompleted,
  onMarkCompleted,
}: LessonInfoProps) {
  const { t } = useTranslation("my-courses");

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("lessonInfoDuration", {
                duration: formatDuration(durationSeconds),
              })}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2 bg-white shadow-none border-border h-10 rounded-lg"
          onClick={onMarkCompleted}
          disabled={
            !onMarkCompleted ||
            Boolean(isCompleted) ||
            Boolean(isMarkingCompleted)
          }
        >
          <Check className="h-4 w-4" />
          {isCompleted
            ? t("lessonInfoCompleted")
            : isMarkingCompleted
            ? t("lessonInfoMarking")
            : t("lessonInfoMarkAsCompleted")}
        </Button>
      </div>
      <p className="mt-4 text-sm text-center md:text-start leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
