import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import LoginPage from "@/components/_modules/auth/_pages/login";

export default function LoginPageRoute() {
  const { t } = useTranslation("auth");
  const pageTitle = t("loginPageSeoTitle");
  const pageDescription = t("loginPageSeoDescription");

  return (
    <main>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/login"
      />
      <LoginPage />
    </main>
  );
}
