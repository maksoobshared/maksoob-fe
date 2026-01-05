import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

import coursesGif from "../assets/courses.gif";
import lessonsGif from "../assets/lessons.gif";
import progressGif from "../assets/progress.gif";

export function StatsCards() {
  const { t } = useTranslation("my-courses");

  // TODO: Replace these static values with API meta once wired.
  const enrolledCoursesCount = 36;
  const lessonsCompletedCount = 50;
  const overallProgressPercent = 45;

  const cards = [
    {
      title: t("myCoursesStatsCoursesEnrolled"),
      value: t("myCoursesStatsCoursesValue", { count: enrolledCoursesCount }),
      image: coursesGif,
      alt: "Courses",
    },
    {
      title: t("myCoursesStatsLessonsCompleted"),
      value: t("myCoursesStatsLessonsValue", { count: lessonsCompletedCount }),
      image: lessonsGif,
      alt: "Lessons",
    },
    {
      title: t("myCoursesStatsOverallProgress"),
      value: `${overallProgressPercent}%`,
      image: progressGif,
      alt: "Progress",
    },
  ] as const;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex items-center justify-between rounded-3xl min-h-[130px] bg-white p-6"
        >
          <div className="min-w-0">
            <p className="text-sm sm:text-lg text-muted-foreground pb-2">
              {card.title}
            </p>
            <p className="text-base sm:text-xl font-bold text-foreground">
              {card.value}
            </p>
          </div>

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-teal/10">
            <Image
              src={card.image}
              alt={card.alt}
              width={80}
              height={80}
              className="h-20 w-20"
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}
