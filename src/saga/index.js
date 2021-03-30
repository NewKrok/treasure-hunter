import { all, call, put } from "redux-saga/effects";

import { initApp } from "../store/actions/app-action";
import AuthSaga from "./auth-saga";
import UserSaga from "./user-saga";
import SiteLanguage from "./site-language";
import SessionSaga from "./online/session-saga";
import AppSaga from "./app-saga";
import SinglePlayerSaga from "./single-player-saga";

function* initialCall() {
  yield put(initApp());
}

function* Index() {
  yield all([
    ...AuthSaga,
    ...UserSaga,
    ...SiteLanguage,
    ...SessionSaga,
    ...AppSaga,
    ...SinglePlayerSaga,
  ]);
  yield call(initialCall);
}

export default Index;
