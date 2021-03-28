import { delay, put, takeLatest } from "redux-saga/effects";
import firebase from "firebase/app";

import { Themes } from "../enum/themes";
import { initApp, setTheme } from "../store/actions/app-action";
import { UrlConfig } from "../url-config";
import { NEWS } from "../common/database/database";
import { setNews } from "../store/actions/news-action";

function* _initApp() {
  yield put(setTheme(window.localStorage.getItem("theme") || Themes.LIGHT));

  let news = [];
  const newsDatabaseRef = firebase.database().ref(NEWS);
  yield newsDatabaseRef.once("value").then((snap) => {
    const rawData = snap.val();
    news = Object.keys(rawData).map((key) => ({
      date: new Date(parseFloat(key)),
      content: rawData[key],
    }));
  });
  yield put(setNews(news));
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
  yield delay(0);
}

const AppSaga = [
  takeLatest(initApp().type, _initApp),
  takeLatest(setTheme().type, _setTheme),
];

export default AppSaga;
