import { createAction } from "./action-creator";

export const receiveChatMessage = createAction({
  type: "RECEIVE_CHAT_MESSAGE",
});
export const sendChatMessage = createAction({
  type: "SEND_CHAT_MESSAGE",
});

export const receiveMicrophoneState = createAction({
  type: "RECEIVE_MICROPHONE_STATE",
});
export const sendMicrophoneState = createAction({
  type: "SEND_MICROPHONE_STATE",
});

export const receiveCameraState = createAction({
  type: "RECEIVE_CAMERA_STATE",
});
export const sendCameraState = createAction({
  type: "SEND_CAMERA_STATE",
});

export const sendEndSession = createAction({
  type: "SEND_END_SESSION",
});
export const receiveEndSession = createAction({
  type: "RECEIVE_END_SESSION",
});

export const sendSetChatTypingState = createAction({
  type: "SEND_SET_CHAT_TYPING_STATE",
});
export const receiveSetChatTypingState = createAction({
  type: "RECEIVE_CHAT_TYPING_STATE",
});
