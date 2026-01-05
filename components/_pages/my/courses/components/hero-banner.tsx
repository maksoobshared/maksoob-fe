import useTranslation from "next-translate/useTranslation";

export function HeroBanner() {
  const { t } = useTranslation("my-courses");

  return (
    <div className=" rounded-2xl bg-secondary p-6 py-9 text-white">
      <p className="mb-3 text-base font-base uppercase tracking-wider text-white">
        {t("myCoursesHeroKicker")}
      </p>
      <h1 className="text-base sm:text-xl font-base leading-tight md:text-2xl">
        {t("myCoursesHeroTitle")}
      </h1>
    </div>
  );
}
