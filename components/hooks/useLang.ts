import { useRouter } from "next/router";

export type ILangType = "ar" | "en";

function useLang() {
  const router = useRouter();
  const { locale } = router;
  const lang: ILangType = locale === "ar" ? "ar" : "en";
  const isArabic = locale === "ar";
  const dir: "ltr" | "rtl" = isArabic ? "rtl" : "ltr";
  return { isArabic, lang, dir } as const;
}

export default useLang;
