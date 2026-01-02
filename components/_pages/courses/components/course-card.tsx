import Image from "next/image";
import { BookOpen, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useTranslation from "next-translate/useTranslation";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  lessonsCount?: number;
  studentsCount?: number;
  onViewDetails?: (id: number) => void;
}

export function CourseCard({
  id,
  title,
  description,
  image,
  lessonsCount,
  studentsCount,
  onViewDetails,
}: CourseCardProps) {
  const { t } = useTranslation("courses");
  return (
    <Card className="overflow-hidden border border-border rounded-2xl !p-6 shadow-2xs max-w-[400px]">
      {/* Image Section */}
      <div className="relative h-48 rounded-2xl bg-primary">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-contain object-bottom"
        />
      </div>

      {/* Content Section */}
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1 text-black">
            <BookOpen className="h-3.5 w-3.5 text-secondary" />
            {t("lesson")} {lessonsCount ?? 0}
          </span>
          <span className="flex items-center gap-1 text-black">
            <Users className="h-3.5 w-3.5 text-secondary" />
            {t("students")} {studentsCount ?? 0}
          </span>
          <span className="flex items-center gap-1 text-black">
            <Eye className="h-3.5 w-3.5 text-secondary" />
            {t("views")} 12K
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <Button
            type="button"
            className="font-normal h-10 text-xs w-[150px]"
            variant="secondary"
            onClick={() => onViewDetails?.(id)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
