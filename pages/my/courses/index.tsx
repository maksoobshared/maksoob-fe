import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import MyCoursesPage from "@/components/_pages/my/courses";

export default function CoursesPageRoute() {
  const { t } = useTranslation("my-courses");
  const pageTitle = t("myLearningPageSeoTitle");
  const pageDescription = t("myLearningPageSeoDescription");

  return (
    <main>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/courses"
      />
      <MyCoursesPage />
    </main>
  );
}
