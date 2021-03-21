import { put, takeLatest } from "redux-saga/effects";

import { Themes } from "../enum/themes";
import { initApp, setTheme } from "../store/actions/app-action";
import { UrlConfig } from "../url-config";

function* _initApp() {
  yield put(setTheme(window.localStorage.getItem("theme") || Themes.LIGHT));
}

function* _setTheme({ payload }) {
  let url = "";
  switch (payload) {
    case Themes.DARK:
      url = UrlConfig.getTheme("dark");
      break;
    case Themes.LIGHT:
    default:
      url = UrlConfig.getTheme("light");
      break;
  }

  var link = document.createElement("link");
  link.setAttribute("id", "color-theme");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  document.head.appendChild(link);

  window.localStorage.setItem("theme", payload);
  yield; // to handle warnings...
}

const AppSaga = [
  takeLatest(initApp().type, _initApp),
  takeLatest(setTheme().type, _setTheme),
];

export default AppSaga;
