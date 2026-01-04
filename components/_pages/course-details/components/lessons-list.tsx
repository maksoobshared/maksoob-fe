import { useState } from "react";
import { Play, Lock, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  isLocked: boolean;
  isPreview?: boolean;
  isDisabled?: boolean;
}

const lessons: Lesson[] = [
  { id: 1, title: "Intro", duration: "3:37", isLocked: false, isPreview: true },
  { id: 2, title: "Class Protect", duration: "2:55", isLocked: true },
  { id: 3, title: "Tools & Elements", duration: "4:10", isLocked: true },
  {
    id: 4,
    title: "Amazon FBA",
    duration: "7:23",
    isLocked: true,
    isDisabled: true,
  },
  { id: 5, title: "Finding Products", duration: "8:15", isLocked: true },
  { id: 6, title: "Supplier Research", duration: "6:42", isLocked: true },
  { id: 7, title: "Listing Optimization", duration: "5:18", isLocked: true },
  { id: 8, title: "Launch Strategy", duration: "9:05", isLocked: true },
];

const LessonsList = () => {
  const [activeLesson, setActiveLesson] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const displayedLessons = showAll ? lessons : lessons.slice(0, 4);

  return (
    <section className="container py-10 px-4 md:px-10 lg:px-24 mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-semibold text-secondary">
          Lessons in This Class
        </h2>
        <p className="text-black">39 Lessons (10h 33m)</p>
      </div>

      <div className="space-y-2">
        {displayedLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => !lesson.isDisabled && setActiveLesson(lesson.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200",
              activeLesson === lesson.id
                ? "bg-primary text-primary-foreground"
                : lesson.isDisabled
                ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                : "bg-card hover:bg-muted border border-border"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  activeLesson === lesson.id
                    ? "bg-primary-foreground/20"
                    : lesson.isDisabled
                    ? "bg-muted"
                    : "bg-muted"
                )}
              >
                {lesson.isPreview ? (
                  <Play
                    className={cn(
                      "h-4 w-4",
                      activeLesson === lesson.id
                        ? "text-primary-foreground"
                        : "text-primary"
                    )}
                  />
                ) : lesson.isDisabled ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <Lock
                    className={cn(
                      "h-4 w-4",
                      activeLesson === lesson.id
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "font-medium text-sm md:text-base",
                  lesson.isDisabled && "opacity-50"
                )}
              >
                {lesson.id}. {lesson.title}
              </span>
            </div>
            <span
              className={cn(
                activeLesson === lesson.id
                  ? "text-primary-foreground"
                  : lesson.isDisabled
                  ? "text-muted-foreground/50"
                  : "text-muted-foreground"
              )}
            >
              {lesson.duration}
            </span>
          </div>
        ))}
      </div>

      {!showAll && lessons.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-2 mx-auto mt-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          Show All Lessons
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="flex items-center gap-2 mx-auto mt-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          Show Less
          <ChevronDown className="h-4 w-4 rotate-180" />
        </button>
      )}
    </section>
  );
};

export default LessonsList;
