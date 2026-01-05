import { Progress } from "@/components/ui/progress";
import useTranslation from "next-translate/useTranslation";

export function LearningJourney() {
  const { t } = useTranslation("my-courses");
  const percent = 45;

  return (
    <div className="mt-8 bg-white p-6 rounded-3xl">
      <h2 className="sm:text-lg text-center sm:text-start font-medium text-foreground">
        {t("myCoursesJourneyTitle")}
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
        {t("myCoursesJourneySubtitle")}
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {t("myCoursesJourneyOverallCompletion")}
          </p>
          <p className="text-sm font-medium text-teal">{percent}%</p>
        </div>
        <Progress
          value={percent}
          className="mt-2 h-4 w-full [&>div]:bg-primary "
        />
      </div>

      <div className="mt-5 rounded-xl bg-primary/10 border-primary border p-4">
        <p className="text-xs sm:text-sm text-black">
          {t("myCoursesJourneyCallout", { percent })}
        </p>
      </div>
    </div>
  );
}
