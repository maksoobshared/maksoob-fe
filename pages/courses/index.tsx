import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import CoursesPage from "@/components/_pages/courses";

export default function CoursesPageRoute() {
  const { t } = useTranslation("courses");
  const pageTitle = t("coursesPageSeoTitle");
  const pageDescription = t("coursesPageSeoDescription");

  return (
    <main>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/courses"
      />
      <CoursesPage />
    </main>
  );
}
