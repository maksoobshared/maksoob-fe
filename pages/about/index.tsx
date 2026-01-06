import useTranslation from "next-translate/useTranslation";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import PageSeo from "@/components/utils/PageSeo";
import AboutUsPage from "@/components/_pages/about";
import { getFaqsList } from "@/components/services/faqs";

export const getServerSideProps: GetServerSideProps<{
  faqs: Awaited<ReturnType<typeof getFaqsList>>;
}> = async (ctx) => {
  try {
    const locale = (ctx.locale === "en" ? "en" : "ar") as "ar" | "en";
    const faqs = await getFaqsList(locale);
    return { props: { faqs } };
  } catch {
    return { props: { faqs: [] } };
  }
};

export default function AboutRoute({
  faqs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("about");

  return (
    <main>
      <PageSeo
        title={t("pageSeoTitle")}
        description={t("pageSeoDescription")}
        canonicalPath="/about"
      />
      <AboutUsPage faqs={faqs} />
    </main>
  );
}
