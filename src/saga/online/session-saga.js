import { takeEvery, takeLatest } from "redux-saga/effects";

import {
  acceptSessionStart,
  declineSessionStart,
  destroySession,
  endSession,
  endSessionRequest,
  sendSessionChatTextMessage,
  setSessionChatTypingState,
  startSession,
  startSessionRequest,
} from "../../store/actions/session-action";
import {
  startSessionRequestHandler,
  endSessionRequestHandler,
  endSessionHandler,
  startSessionHandler,
  acceptSessionStartHandler,
  declineSessionStartHandler,
  destroySessionHandler,
  sendSessionChatTextMessageHandler,
  setSessionChatTypingStateHandler,
} from "./workers/session-worker";
import { receiveEndSession } from "../../store/actions/server-action";

const SessionSaga = [
  takeLatest(startSessionRequest().type, startSessionRequestHandler),
  takeLatest(endSessionRequest().type, endSessionRequestHandler),
  takeLatest(endSession().type, endSessionHandler),
  takeLatest(receiveEndSession().type, endSessionHandler),
  takeLatest(startSession().type, startSessionHandler),
  takeLatest(acceptSessionStart().type, acceptSessionStartHandler),
  takeLatest(declineSessionStart().type, declineSessionStartHandler),
  takeLatest(destroySession().type, destroySessionHandler),
  takeLatest(
    sendSessionChatTextMessage().type,
    sendSessionChatTextMessageHandler
  ),
  takeLatest(
    setSessionChatTypingState().type,
    setSessionChatTypingStateHandler
  ),
];

export default SessionSaga;
