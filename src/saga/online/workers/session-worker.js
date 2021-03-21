import {
  call,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import firebase from "firebase/app";

import { SESSION_DATA } from "../../../common/database/database";
import { GetUser } from "../../../store/selectors/auth";
import {
  GetSessionState,
  GetStunServerOfSession,
} from "../../../store/selectors/session";
import {
  acceptSessionStart,
  destroySession,
  resetSessionData,
  setSessionData,
} from "../../../store/actions/session-action";
import { closeDialog, openDialog } from "../../../store/actions/dialog-action";
import { DIALOG_ID } from "../../../components/dialog/dialog";
import { getStunServer } from "../helper/server";
import { createThreadId } from "../../../utils/thread";
import { initPeer, initConnection, closeConnection } from "./webrtc-worker";
import { setAutoSessionRequestCancelTime } from "../../../store/actions/session-action";
import { startVideoChat } from "../../../store/actions/stream-action";
import {
  callSendChatMessage,
  callSetChatTypingState,
} from "./business-logic-worker";
import { SessionState } from "../../../enum/session";
import { receiveChatMessage } from "../../../store/actions/server-action";

export function* listenForRequests() {
  const ownUser = yield select(GetUser);
  if (ownUser) {
    const databaseRef = firebase
      .database()
      .ref(`${SESSION_DATA}/REQUESTS/${ownUser.uid}`);

    const onChildAddedChannel = eventChannel((emit) => {
      databaseRef.on("value", emit);
      return () => {
        databaseRef.on("value", null);
      };
    });
    yield takeLatest(onChildAddedChannel, onRequestAddedHandler);
  }
}

export function* onRequestAddedHandler(snap) {
  const { stunServer } = snap.val() || {
    stunServer: null,
  };

  yield put(setSessionData({ stunServer }));
  yield put(openDialog(DIALOG_ID.START_SESSION_CONFIRMATION));

  const ownUser = yield select(GetUser);
  const databaseRef = firebase
    .database()
    .ref(`${SESSION_DATA}/REQUESTS/${ownUser.uid}`);

  const onSessionRequestCancelledByInitializerChannel = eventChannel((emit) => {
    databaseRef.on("child_removed", emit);
    return () => {
      databaseRef.on("child_removed", null);
    };
  });
  const res = yield race({
    cancel: take(onSessionRequestCancelledByInitializerChannel),
    start: take(acceptSessionStart().type),
  });

  if (res.cancel) {
    yield put(closeDialog());
    yield put(openDialog(DIALOG_ID.SESSION_CANCEL_BY_INITIALIZER));
    yield put(destroySession());
  }
}

export function* startSessionRequestHandler() {
  const selectedUser = {};
  const stunServer = getStunServer();

  yield put(setSessionData({ selectedUser, stunServer }));
  yield put(openDialog(DIALOG_ID.START_SESSION));
}

export function* startSessionHandler() {
  yield put(closeDialog());
  // initializer...
  const ownUser = yield select(GetUser);
  yield put(setSessionData({ ownUser }));
  const selectedUser = {};
  const stunServer = yield select(GetStunServerOfSession);
  const databaseName = `${SESSION_DATA}/REQUESTS/${selectedUser.uid}`;
  const databaseRef = firebase.database().ref(databaseName);

  yield databaseRef.set({
    initializer: ownUser.uid,
    stunServer,
  });
  databaseRef.onDisconnect().remove((err) => {
    if (err !== null) console.log(err);
  });

  const result = yield race({
    sessionStart: call(listenForStartSessionData, { ownUser, selectedUser }),
    autoCancel: call(listenForAutoCancel),
    cancel: call(listenForCancelSessionData, { selectedUser }),
    // add cancel by initializer
  });

  if (result.hasOwnProperty("sessionStart")) {
    yield fork(initConnection);
    const sessionState = select(GetSessionState);
    if (sessionState !== SessionState.IN_PROGRESS) {
      yield put(startVideoChat());
    }
    firebase
      .database()
      .ref(`${SESSION_DATA}/REQUESTS/${selectedUser.uid}`)
      .remove();
  } else databaseRef.remove();
}

export function* listenForStartSessionData({ ownUser, selectedUser }) {
  const thread = createThreadId({
    userAId: selectedUser.uid,
    userBId: ownUser.uid,
  });
  const sessionDatabaseRef = firebase
    .database()
    .ref(`${SESSION_DATA}/SESSIONS/${thread}`);

  const onChildAddedChannel = eventChannel((emit) => {
    sessionDatabaseRef.on("value", (snap) => snap.val() && emit(snap));
    return () => {
      sessionDatabaseRef.on("value", null);
    };
  });
  const snap = yield take(onChildAddedChannel);
  yield call(onRequestAcceptedHandler, snap);
}

export function* onRequestAcceptedHandler(snap) {
  const sessionData = snap.val();
  if (sessionData) {
    yield call(initPeer);
    //if not initializer... yield fork(initConnection);
    yield put(setSessionData(sessionData));
  }
}

function* listenForAutoCancel() {
  let autoCancelTime = 60;
  do {
    autoCancelTime--;
    yield put(setAutoSessionRequestCancelTime(autoCancelTime));
    yield delay(1000);
  } while (autoCancelTime > 0);

  yield put(openDialog(DIALOG_ID.SESSION_AUTO_CANCEL));
  yield put(destroySession());
}

export function* listenForCancelSessionData({ selectedUser }) {
  const sessionDatabaseRef = firebase
    .database()
    .ref(`${SESSION_DATA}/REQUESTS/${selectedUser.uid}/`);

  const onChildRemovedChannel = eventChannel((emit) => {
    sessionDatabaseRef.on("value", (snap) => snap.val() === null && emit(snap));
    return () => {
      sessionDatabaseRef.on("value", null);
    };
  });
  const snap = yield take(onChildRemovedChannel);
  yield call(onSessionCancelHandler, snap);
}

export function* onSessionCancelHandler(snap) {
  if (snap.val() === null) {
    yield put(openDialog(DIALOG_ID.SESSION_DECLINED));
    yield put(destroySession());
  }
}

export function* acceptSessionStartHandler() {
  yield put(closeDialog());
  const ownUser = yield select(GetUser);
  const thread = createThreadId({ userAId: ownUser.uid, userBId: "" });

  yield fork(listenForStartSessionData, { ownUser });

  const databaseRef = firebase
    .database()
    .ref(`${SESSION_DATA}/SESSIONS/${thread}`);

  databaseRef.set({ startTimeStamp: Date.now() });
  databaseRef.onDisconnect().remove((err) => {
    if (err !== null) console.log(err);
  });
}

export function* declineSessionStartHandler() {
  yield put(closeDialog());
  const ownUser = yield select(GetUser);
  firebase.database().ref(`${SESSION_DATA}/REQUESTS/${ownUser.uid}`).remove();
}

export function* endSessionRequestHandler() {
  yield put(openDialog(DIALOG_ID.END_SESSION_CONFIRMATION));
}

export function* endSessionHandler() {
  // remove from firebase...

  yield call(closeConnection);
  yield delay(2000);
  yield put(resetSessionData());
}

export function* destroySessionHandler() {
  yield delay(1000);
  yield put(resetSessionData());
}

export function* sendSessionChatTextMessageHandler({ payload }) {
  const user = yield select(GetUser);
  const now = Date.now();
  const messageObject = {
    content: payload,
    key: `${now}-${user.uid}`,
    meta: {
      photoURL: user.photoURL,
      uid: user.uid,
      type: "text",
      date: now,
    },
  };

  /**
   * There is no brodacast message so we are triggering
   * our own message immediately.
   */
  const ownMessageObject = {
    ...messageObject,
    meta: { ...messageObject.meta, isOwnMessage: true },
  };
  yield put(receiveChatMessage(ownMessageObject));

  const outgoingMessageObject = {
    ...messageObject,
    meta: { ...messageObject.meta, isOwnMessage: false },
  };
  yield call(callSendChatMessage, { content: outgoingMessageObject });
}

export function* setSessionChatTypingStateHandler({ payload: message }) {
  const { displayName } = yield select(GetUser);
  yield delay(500);

  if (message && message !== "") {
    yield call(callSetChatTypingState, {
      content: { displayName, state: true },
    });
    yield delay(2000);
  }

  yield call(callSetChatTypingState, {
    content: { displayName, state: false },
  });
}
