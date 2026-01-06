import useTranslation from "next-translate/useTranslation";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import PageSeo from "@/components/utils/PageSeo";
import HomePage from "@/components/_pages/home";
import { getBannersList } from "@/components/services/banners";

export const getServerSideProps: GetServerSideProps<{
  banners: Awaited<ReturnType<typeof getBannersList>>;
}> = async () => {
  try {
    const banners = await getBannersList();
    return { props: { banners } };
  } catch {
    return { props: { banners: [] } };
  }
};

export default function HomePageRoute({
  banners,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("home");
  const pageTitle = t("pageSeoTitle");
  const pageDescription = t("pageSeoDescription");

  return (
    <div>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/"
      />
      <HomePage banners={banners} />
    </div>
  );
}
