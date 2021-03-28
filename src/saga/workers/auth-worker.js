import { call, put, take } from "redux-saga/effects";
import { rsf } from "../../firebase";
import md5 from "md5";

import {
  setSignUpError,
  setSignInError,
  setUser,
} from "../../store/actions/auth";
import { USERS } from "../../common/database/database";

export function* initAppHandler() {
  const channel = yield call(rsf.auth.channel);

  while (true) {
    const { user } = yield take(channel);
    if (user) yield put(setUser(user));
    else yield put(setUser(null));
  }
}

export function* signUpRequestHandler(action) {
  const { email, password, displayName } = action.payload;

  try {
    const authResult = yield rsf.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    const userData = {
      uid: authResult.user.uid,
      displayName,
      photoURL: `https://gravatar.com/avatar/${md5(email)}?d=identicon`,
    };
    yield call(rsf.auth.updateProfile, userData);
    yield call(rsf.database.create, USERS, userData);
    yield put(setUser({ ...authResult.user }));
  } catch (e) {
    console.error(`Sign up error: ${e}`);
    yield put(setSignUpError(e));
  }
}

export function* signInRequestHandler(action) {
  const { email, password } = action.payload;
  try {
    const user = yield rsf.auth.signInWithEmailAndPassword(email, password);
    yield put(setUser(user));
  } catch (e) {
    yield put(setSignInError(e));
  }
}

export function* signOutRequestHandler() {
  try {
    yield rsf.auth.signOut();
    yield put(setUser(null));
  } catch (e) {
    console.warn("Sign out error!");
  }
}

export function* guestSignInRequestHandler() {
  const user = yield rsf.auth.signInAnonymously();
  yield put(setUser(user));
  //yield put(showNotification(`Successful sign in as a guest`));
}
