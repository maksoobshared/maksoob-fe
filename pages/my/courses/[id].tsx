import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import MyCoursePage from "@/components/_pages/my/course-details";

export default function MyLearningPageRoute() {
  const { t } = useTranslation("my-courses");
  const pageTitle = t("myLearningCoursePageSeoTitle");
  const pageDescription = t("myLearningCoursePageSeoDescription");

  return (
    <main>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/my/courses/[id]"
      />
      <MyCoursePage />
    </main>
  );
}
