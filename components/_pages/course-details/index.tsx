import React from "react";
import CourseHero from "./components/course-hero";
import CourseBenefits from "./components/course-benefits";
import LessonsList from "./components/lessons-list";

type CourseWatchPageProps = {
  id: string;
};

export default function CourseWatchPage({ id }: CourseWatchPageProps) {
  return (
    <div className="">
      <CourseHero />
      <CourseBenefits />
      <LessonsList />
    </div>
  );
}
