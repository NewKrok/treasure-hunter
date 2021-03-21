import { call, put, take, takeLatest } from "redux-saga/effects";
import { rsf } from "../firebase";
import md5 from "md5";

import {
  signInRequest,
  signUpRequest,
  setSignUpError,
  setSignInError,
  signOutRequest,
  setUser,
} from "../store/actions/auth";
import { initApp } from "../store/actions/app-action";
import { USERS } from "../common/database/database";

function* initAppHandler() {
  const channel = yield call(rsf.auth.channel);

  while (true) {
    const { user } = yield take(channel);
    if (user) yield put(setUser(user));
    else yield put(setUser(null));
  }
}

function* _signUpRequest(action) {
  const { email, password, displayName } = action.payload;

  try {
    const authResult = yield rsf.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    console.log(authResult);
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

function* _signInRequest(action) {
  const { email, password } = action.payload;
  try {
    const user = yield rsf.auth.signInWithEmailAndPassword(email, password);
    yield put(setUser(user));
  } catch (e) {
    yield put(setSignInError(e));
  }
}

function* _signOutRequest() {
  try {
    yield rsf.auth.signOut();
    yield put(setUser(null));
  } catch (e) {
    console.warn("Sign out error!");
  }
}

const Auth = [
  takeLatest(initApp().type, initAppHandler),
  takeLatest(signUpRequest().type, _signUpRequest),
  takeLatest(signInRequest().type, _signInRequest),
  takeLatest(signOutRequest().type, _signOutRequest),
];

export default Auth;
