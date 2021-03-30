import { call, put, take } from "redux-saga/effects";
import { rsf } from "../../firebase";
import firebase from "firebase/app";

import {
  setSignUpError,
  setSignInError,
  setUser,
  setProfile,
} from "../../store/actions/auth-action";
import { PROFILES } from "../../common/database/database";
import { unlockArea } from "./single-player-worker";

export function* initAppHandler() {
  const channel = yield call(rsf.auth.channel);

  while (true) {
    const { user } = yield take(channel);
    if (user) {
      yield put(setUser(user));

      profileDatabaseRef = firebase.database().ref(`${PROFILES}/${user.uid}`);
      let profile;
      yield profileDatabaseRef
        .once("value")
        .then((snap) => (profile = snap.val()));
      yield put(setProfile(profile));
    } else yield put(setUser(null));
  }
}

let profileDatabaseRef;

export function* signUpRequestHandler(action) {
  const { email, password, displayName } = action.payload;

  try {
    const { user } = yield rsf.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    const userData = {
      uid: user.uid,
      displayName,
    };
    yield call(rsf.auth.updateProfile, userData);
    yield call(rsf.database.create, PROFILES, userData);
    profileDatabaseRef = firebase.database().ref(`${PROFILES}/${user.uid}`);
    const profile = {
      displayName,
      isGuest: false,
      isPublic: false,
      selectedCharacterId: 0,
    };
    profileDatabaseRef.set(profile);
    yield put(setUser(user));
    yield call(unlockArea, 0);
    yield put(setProfile(profile));
  } catch (e) {
    console.error(`Sign up error: ${e}`);
    yield put(setSignUpError(e));
  }
}

export function* signInRequestHandler(action) {
  const { email, password } = action.payload;
  try {
    const user = yield rsf.auth.signInWithEmailAndPassword(email, password);
    profileDatabaseRef = firebase.database().ref(`${PROFILES}/${user.uid}`);
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
  const { user } = yield rsf.auth.signInAnonymously();
  yield put(setUser(user));

  profileDatabaseRef = firebase.database().ref(`${PROFILES}/${user.uid}`);
  const profile = {
    displayName: `Guest-${Math.floor(Math.random() * 99999)}`,
    isGuest: true,
    isPublic: false,
    selectedCharacterId: 0,
  };
  profileDatabaseRef.set(profile);
  yield call(unlockArea, 0);
  yield put(setProfile(profile));
}
