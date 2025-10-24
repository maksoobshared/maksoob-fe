import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";


export default function Home() {
  const { t } = useTranslation("home");

  const pageTitle = t("hero_title");
  const pageDescription = t("hero_subtitle");

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/"
      />
   

    </div>
  );
}
