import { createAction } from "./action-creator";

export const startSession = createAction({ type: "START_SESSION" });
export const acceptSessionStart = createAction({
  type: "ACCEPT_SESSION_START",
});
export const declineSessionStart = createAction({
  type: "DECLINE_SESSION_START",
});
export const startSessionRequest = createAction({
  type: "START_SESSION_REQUEST",
});
export const cancelSessionRequest = createAction({
  type: "CANEL_SESSION_REQUEST",
});
export const endSessionRequest = createAction({
  type: "END_SESSION_REQUEST",
});
export const endSession = createAction({
  type: "END_SESSION",
});
export const resetSessionData = createAction({
  type: "RESET_SESSION_DATA",
});
export const stopSession = createAction({ type: "STOP_SESSION" });
export const setSessionData = createAction({ type: "SET_SESSION_DATA" });
export const destroySession = createAction({ type: "DESTROY_SESSION" });
export const connectionEstablished = createAction({
  type: "CONNECTION_ESTABLISED",
});
export const setAutoSessionRequestCancelTime = createAction({
  type: "SET_AUTO_SESSION_REQUEST_CANCEL_TIME",
});
export const sendSessionChatTextMessage = createAction({
  type: "SEND_SESSION_CHAT_TEXT_MESSAGE",
});
export const setSessionChatTypingState = createAction({
  type: "SET_SESSION_CHAT_TYPING_STATE",
});
