import { put, takeLatest } from "redux-saga/effects";
import { initApp } from "../store/actions/app-action";

import {
  changeSiteLanguage,
  saveSiteTranslationData,
} from "../store/actions/site-language";
import { UrlConfig } from "../url-config";

function* initAppHandler() {
  yield put(changeSiteLanguage("en"));
}

function* changeSiteLanguageHandler(action) {
  try {
    const result = yield fetch(
      UrlConfig.getSiteTranslation(action.payload.languageId)
    );
    const convertedResult = yield result.json();
    yield put(saveSiteTranslationData(convertedResult));
  } catch (e) {
    console.error(`Failed to fetch site translation, error: ${e}`);
    yield put(saveSiteTranslationData({}));
  }
}

const SiteLanguage = [
  takeLatest(initApp().type, initAppHandler),
  takeLatest(changeSiteLanguage().type, changeSiteLanguageHandler),
];

export default SiteLanguage;
