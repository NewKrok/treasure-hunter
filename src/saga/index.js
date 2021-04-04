import { all, call, put } from "redux-saga/effects";

import { initApp } from "../store/actions/app-action";
import AuthSaga from "./auth-saga";
import UserSaga from "./user-saga";
import SiteLanguage from "./site-language";
import SessionSaga from "./online/session-saga";
import AppSaga from "./app-saga";
import SinglePlayerSaga from "./single-player-saga";
import ExternalCommuniactorSaga from "./external-communicator-saga";

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
    ...ExternalCommuniactorSaga,
  ]);
  yield call(initialCall);
}

export default Index;
