"use client";

import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTranslation from "next-translate/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  label: string;
  value: string;
}

interface CourseFiltersProps {
  onSortChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onSoftwareChange?: (value: string) => void;
}

export function CourseFilters({
  onSortChange,
  onCategoryChange,
  onSoftwareChange,
}: CourseFiltersProps) {
  const { t } = useTranslation("courses");
  const sortOptions: FilterOption[] = [
    { label: t("sortMostPopular"), value: "popular" },
    { label: t("sortNewest"), value: "newest" },
    { label: t("sortPriceLowToHigh"), value: "price-asc" },
    { label: t("sortPriceHighToLow"), value: "price-desc" },
  ];

  const categoryOptions: FilterOption[] = [
    { label: t("categoryAll"), value: "all" },
    { label: t("categoryEcommerce"), value: "ecommerce" },
    { label: t("categoryMarketing"), value: "marketing" },
    { label: t("categoryDesign"), value: "design" },
  ];

  const softwareOptions: FilterOption[] = [
    { label: t("softwareAll"), value: "all" },
    { label: t("softwareSoftware"), value: "software" },
    { label: t("softwareTools"), value: "tools" },
    { label: t("softwarePlatforms"), value: "platforms" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {/* Sort By */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-lg border-border bg-white gap-2"
          >
            <span className="text-muted-foreground">{t("sortBy")}</span>
            <span className="font-semibold text-foreground">
              {t("sortMostPopular")}
            </span>
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange?.(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-lg border-border bg-white gap-2"
          >
            <span className="font-medium text-foreground">{t("category")}</span>
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {categoryOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onCategoryChange?.(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Software */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-lg  bg-white gap-2">
            <span className="font-medium text-foreground">{t("software")}</span>
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {softwareOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSoftwareChange?.(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
