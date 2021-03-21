import { select, delay, put } from "redux-saga/effects";
import firebase from "firebase/app";

import { emailChanged } from "../../store/actions/user-action";
import { USERS } from "../../common/database/database";
import { GetUser } from "../../store/selectors/auth";
import { closeDialog } from "../../store/actions/dialog-action";

export function* changeDisplayNameHandler({ payload: displayName }) {
  yield delay(1000);
  const firebaseUser = yield select(GetUser);
  const user = {};
  let isSucceeded = false;
  yield firebaseUser.updateProfile({ displayName }).then(
    () => (isSucceeded = true),
    () => (isSucceeded = false)
  );

  if (isSucceeded) {
    const ref = firebase.database().ref(`${USERS}/${user.key}/`);
    ref.update({
      displayName,
      lastModificationDate: Date.now(),
    });
  }
}

export function* changeEmailHandler({ payload: email }) {
  yield delay(1000);
  const firebaseUser = yield select(GetUser);
  const user = {};
  let isSucceeded = false;
  yield firebaseUser.updateEmail(email).then(
    () => (isSucceeded = true),
    () => (isSucceeded = false)
  );

  if (isSucceeded) {
    const ref = firebase.database().ref(`${USERS}/${user.key}/`);
    ref.update({
      email,
      lastModificationDate: Date.now(),
    });

    yield put(emailChanged({ uid: user.uid, email }));
  }
}

export function* changePhotoURLHandler({ payload: photoURL }) {
  yield put(closeDialog());
  const firebaseUser = yield select(GetUser);
  const user = {};
  let isSucceeded = false;
  yield firebaseUser.updateProfile({ photoURL }).then(
    () => (isSucceeded = true),
    () => (isSucceeded = false)
  );

  if (isSucceeded) {
    const ref = firebase.database().ref(`${USERS}/${user.key}/`);
    ref.update({
      photoURL,
      lastModificationDate: Date.now(),
    });
  }
}
