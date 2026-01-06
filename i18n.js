module.exports = {
  locales: ["ar", "en"],
  defaultLocale: "ar",
  pages: {
    "*": ["common", "footer", "navbar"],

    // home
    "/": ["home", "courses"],

    // courses
    "/courses": ["courses"],
    "/courses/[id]": ["courses"],

    // auth
    "/login": ["auth"],
    "/register": ["auth"],
    "/forgot-password": ["auth"],

    // my courses
    "/my/courses": ["my-courses", "courses"],
    "/my/courses/[id]": ["my-courses"],

    // about
    "/about": ["about"],

    // pricing
    "/pricing": ["pricing"],
  },
  loadLocaleFrom: (lang, ns) =>
    import(`./locales/${lang}/${ns}.json`).then((m) => m.default),
};
