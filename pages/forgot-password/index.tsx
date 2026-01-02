import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import HomePage from "@/components/_pages/home";

export default function ForgotPasswordPageRoute() {
  const { t } = useTranslation("auth");
  const pageTitle = t("forgotPasswordPageSeoTitle");
  const pageDescription = t("forgotPasswordPageSeoDescription");

  return (
    <div>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/forgot-password"
      />
      <HomePage />
    </div>
  );
}
