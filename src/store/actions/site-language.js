export const CHANGE_SITE_LANGUAGE = "CHANGE_SITE_LANGUAGE";
export const SAVE_SITE_TRANSLATION_DATA = "SAVE_SITE_TRANSLATION_DATA";

export const changeSiteLanguage = (languageId) => {
  return { type: CHANGE_SITE_LANGUAGE, payload: { languageId } };
};

export const saveSiteTranslationData = (messages) => {
  return { type: SAVE_SITE_TRANSLATION_DATA, payload: { messages } };
};
