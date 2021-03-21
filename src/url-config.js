export const UrlConfig = {
  getSiteTranslation: (langId) => `${process.env.PUBLIC_URL}/lang/lang_en.json`,
  getTheme: (theme) => `${process.env.PUBLIC_URL}/themes/${theme}/colors.css`,
};
