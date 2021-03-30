import { takeLatest } from "redux-saga/effects";

import { setProfile } from "../store/actions/auth-action";

import { syncLocalLevelProgressData } from "./workers/single-player-worker";

const SinglePlayerSaga = [
  takeLatest(setProfile().type, syncLocalLevelProgressData),
];

export default SinglePlayerSaga;
