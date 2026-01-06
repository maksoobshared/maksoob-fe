import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import RegisterPage from "@/components/_modules/auth/_pages/register";

export default function RegisterPageRoute() {
  const { t } = useTranslation("auth");
  const pageTitle = t("registerPageSeoTitle");
  const pageDescription = t("registerPageSeoDescription");

  return (
    <main>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/register"
      />
      <RegisterPage />
    </main>
  );
}
