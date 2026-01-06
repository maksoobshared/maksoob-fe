import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PageSeo from "@/components/utils/PageSeo";
import CourseWatchPage from "@/components/_pages/course-details";

export default function CourseDetailsRoute() {
  const router = useRouter();
  const { t } = useTranslation("courses");
  const id = router.query.id;

  return (
    <main>
      <PageSeo
        title={t("courseDetailsSeoTitle", { id: String(id ?? "") })}
        description={t("courseDetailsSeoDescription")}
        canonicalPath={typeof id === "string" ? `/courses/${id}` : "/courses"}
      />

      <CourseWatchPage id={typeof id === "string" ? id : ""} />
    </main>
  );
}
