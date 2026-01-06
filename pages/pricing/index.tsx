import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";
import PricingPage from "@/components/_pages/pricing";

export default function PricingRoute() {
  const { t } = useTranslation("pricing");

  return (
    <main>
      <PageSeo
        title={t("pageSeoTitle")}
        description={t("pageSeoDescription")}
        canonicalPath="/pricing"
      />
      <PricingPage />
    </main>
  );
}
