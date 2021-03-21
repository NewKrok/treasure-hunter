import { all, call, put } from "redux-saga/effects";

import { initApp } from "../store/actions/app-action";
import Auth from "./auth";
import UserSaga from "./user-saga";
import SiteLanguage from "./site-language";
import SessionSaga from "./online/session-saga";
import AppSaga from "./app-saga";

function* initialCall() {
  yield put(initApp());
}

function* Index() {
  yield all([
    ...Auth,
    ...UserSaga,
    ...SiteLanguage,
    ...SessionSaga,
    ...AppSaga,
  ]);
  yield call(initialCall);
}

export default Index;
