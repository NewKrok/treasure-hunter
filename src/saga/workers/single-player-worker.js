import { put, select } from "redux-saga/effects";
import firebase from "firebase/app";

import {
  setLocalLevelProgressData,
  overrideLocalLevelProgressData,
} from "../../store/actions/single-player-action";
import { LEVEL_PROGRESS_DATA } from "../../common/database/database";
import { GetUser } from "../../store/selectors/auth-selector";

export function* syncLocalLevelProgressData() {
  const user = yield select(GetUser);

  const ref = firebase.database().ref(`${LEVEL_PROGRESS_DATA}/${user.uid}/`);

  let levelProgressData = {};
  yield ref.once("value").then((snap) => (levelProgressData = snap.val()));

  yield put(overrideLocalLevelProgressData(levelProgressData));
}

export function* unlockArea(areaId) {
  const levelData = { isUnlocked: true };
  const levelId = 0;
  const user = yield select(GetUser);

  const ref = firebase
    .database()
    .ref(`${LEVEL_PROGRESS_DATA}/${user.uid}/${areaId}`);
  ref.update({
    [levelId]: levelData,
  });

  yield put(setLocalLevelProgressData({ areaId, levelId, data: levelData }));
}
