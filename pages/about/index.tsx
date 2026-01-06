import useTranslation from "next-translate/useTranslation";
import PageSeo from "@/components/utils/PageSeo";

export default function AboutRoute() {
  const { t } = useTranslation("common");

  return (
    <div>
      <PageSeo title="" description="" canonicalPath="/about" />
      <div className="mx-auto max-w-[1248px] px-4 py-10">
        <h1 className="text-2xl font-semibold">About</h1>
      </div>
    </div>
  );
}
