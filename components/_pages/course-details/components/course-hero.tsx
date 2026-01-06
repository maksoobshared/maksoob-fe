import Image from "next/image";
import { Users, BookOpen, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useTranslation from "next-translate/useTranslation";
import { cn } from "@/lib/utils";
import useLang from "@/components/hooks/useLang";

type CourseHeroProps = {
  title?: string;
  description?: string;
  teacherName?: string;
  durationHours?: number;
  coverImageUrl?: string | null;
  onEnroll?: () => void;
  isEnrolling?: boolean;
};

const CourseHero = ({
  title = "Amazon FBA course",
  description = "Step into the world of e-commerce with our Amazon FBA Course, designed to guide you step-by-step from setting up your seller account to managing your store and generating consistent profits. You'll learn how to find winning products, work with suppliers, handle shipping and pricing, and analyze performance to scale your business effectively.",
  teacherName,
  durationHours,
  coverImageUrl,
  onEnroll,
  isEnrolling,
}: CourseHeroProps) => {
  const { t } = useTranslation("courses");
  const { isArabic } = useLang();

  const resolvedCoverImageUrl =
    coverImageUrl?.trim() ||
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop";

  const resolvedTeacherName = teacherName?.trim() || "—";
  const teacherInitials = resolvedTeacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <section className="lg:bg-secondary bg-white lg:text-white text-black relative z-30 overflow-visible ">
      <div className="container px-4 md:px-10 lg:px-24 overflow-visible mx-auto ">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-8 items-center overflow-visible">
          {/* Right - Image Card */}
          <div className="animate-scale-in relative lg:min-h-[420px] order-1 lg:order-2">
            <div className="bg-card rounded-3xl py-4  lg:p-4 overflow-hidden card-shadow w-full max-w-[390px] mx-auto lg:absolute lg:-bottom-8 lg:-end-8 lg:z-40">
              <div className="relative w-full h-[320px]">
                <Image
                  src={resolvedCoverImageUrl}
                  alt="Course preview"
                  fill
                  className="object-cover rounded-3xl"
                  sizes="(max-width: 1024px) 100vw, 390px"
                />
              </div>

              <div className="p-4 flex items-center justify-center">
                <Button
                  className="w-full font-normal h-12"
                  variant="secondary"
                  onClick={onEnroll}
                  disabled={isEnrolling}
                >
                  {t("courseHeroEnrollNow")}{" "}
                  <ArrowRight
                    className={cn("h-4 w-4 ms-2", isArabic && "rotate-180")}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Left Content */}
          <div className="animate-fade-in order-2 lg:order-1">
            <h1 className="text-2xl text-center lg:text-start md:text-4xl font-bold mb-4">
              {title}
            </h1>

            <p className="text-black lg:text-white lg:text-base text-xs mb-6 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Rating (placeholder) */}
            {/* <div className="flex items-center gap-3 text-sm mb-6">
              <div className="flex items-center gap-1">
                <span className="font-semibold">4.8</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-primary-foreground/70">
                (1,249 ratings)
              </span>
              <span className="text-primary-foreground/70">2,945 students</span>
            </div> */}

            {/* Instructor + Stats */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6 pt-6 pb-10 lg:pt-0 lg:pb-0 px-4 lg:px-0">
              <div className="flex items-center gap-3 ">
                <Avatar className="h-10 w-10 ">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback>{teacherInitials || "—"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{resolvedTeacherName}</p>
                  <p className="text-xs text-black lg:text-white">
                    {t("courseHeroInstructorAt")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
                <div className="flex items-center gap-2 text-sm bg-[#f0f0f0] md:bg-transparent p-2 md:p-0 rounded-xl md:rounded-none">
                  <Users className="h-4 w-4" />
                  <span>{t("courseHeroLearners", { count: "20,000+" })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm bg-[#f0f0f0] md:bg-transparent p-2 md:p-0 rounded-xl md:rounded-none">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {t("courseHeroDurationLabel")}{" "}
                    {typeof durationHours === "number"
                      ? `${durationHours}h`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
