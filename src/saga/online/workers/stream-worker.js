import { select } from "redux-saga/effects";
import {
  GetIsCameraActivated,
  GetIsMicrophoneActivated,
  GetMediaDevices,
} from "../../../store/selectors/stream";
import {
  callSendCameraState,
  callSendMicrophoneState,
} from "./business-logic-worker";

export function* setMicrophoneStateHandler({ payload }) {
  const stream = yield select(GetMediaDevices);
  if (stream) {
    stream.getAudioTracks().forEach((audioTrack) => {
      audioTrack.enabled = payload;
    });
    callSendMicrophoneState({ content: payload });
  }
}

export function* setCameraStateHandler({ payload }) {
  const stream = yield select(GetMediaDevices);
  if (stream) {
    stream.getVideoTracks().forEach((videoTrack) => {
      videoTrack.enabled = payload;
    });
    callSendCameraState({ content: payload });
  }
}

export function* setMediaDeviceTrackStates(mediaDevices) {
  const isMicrophoneActivated = yield select(GetIsMicrophoneActivated);
  mediaDevices.getAudioTracks().forEach((audioTrack) => {
    audioTrack.enabled = isMicrophoneActivated;
  });

  const isCameraActivated = yield select(GetIsCameraActivated);
  mediaDevices.getVideoTracks().forEach((videoTrack) => {
    videoTrack.enabled = isCameraActivated;
  });
}
