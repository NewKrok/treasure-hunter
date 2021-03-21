import { createAction } from "./action-creator";

export const startVideoChat = createAction({ type: "START_VIDEO_CHAT" });
export const saveMediaDevices = createAction({ type: "SAVE_MEDIA_DEVICES" });
export const saveIncomingStream = createAction({
  type: "SAVE_INCOMING_STREAM",
});
export const setMicrophoneState = createAction({
  type: "SET_MICROPHONE_STATE",
});
export const setIncomingMicrophoneState = createAction({
  type: "SET_INCOMING_MICROPHONE_STATE",
});
export const setCameraState = createAction({ type: "SET_CAMERA_STATE" });
export const setIncomingCameraState = createAction({
  type: "SET_INCOMING_CAMERA_STATE",
});
