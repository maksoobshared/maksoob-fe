module.exports = {
  locales: ["ar", "en"],
  defaultLocale: "ar",
  pages: {
    "*": ["common", "footer", "navbar"],
    "/": ["home"],

    // courses
    "/courses": ["courses"],
    "/courses/[id]": ["courses"],

    // auth
    "/login": ["auth"],
    "/register": ["auth"],
    "/forgot-password": ["auth"],
  },
  loadLocaleFrom: (lang, ns) =>
    import(`./locales/${lang}/${ns}.json`).then((m) => m.default),
};
