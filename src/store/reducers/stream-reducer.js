import { StreamState } from "../../enum/stream";
import {
  receiveCameraState,
  receiveMicrophoneState,
} from "../actions/server-action";
import { acceptSessionStart, startSession } from "../actions/session-action";
import {
  saveIncomingStream,
  saveMediaDevices,
  setCameraState,
  setMicrophoneState,
  startVideoChat,
} from "../actions/stream-action";

const initialState = {
  state: StreamState.WAITING_FOR_PERMISSION,
  mediaDevices: null,
  startTime: 0,
  incomingStream: null,
  isMicrophoneActivated: false,
  isIncomingMicrophoneActivated: false,
  isCameraActivated: false,
  isIncomingCameraActivated: false,
};

const startSessionHandler = ({ state, payload }) =>
  payload
    ? {
        ...state,
        isMicrophoneActivated: payload?.microphone,
        isCameraActivated: payload?.camera,
      }
    : state;

const acceptSessionStartHandler = ({ state, payload }) => ({
  ...state,
  isMicrophoneActivated: payload?.microphone,
  isCameraActivated: payload?.camera,
});

const startVideoChatHandler = ({ state }) => ({
  ...state,
  state: StreamState.WAITING_FOR_PERMISSION,
});

const saveMediaDevicesHandler = ({ state, payload }) => ({
  ...state,
  mediaDevices: payload,
  state: StreamState.IN_PROGRESS,
  startTime: window.performance.now(),
});

const saveIncomingStreamHandler = ({ state, payload }) => ({
  ...state,
  incomingStream: payload,
});

const setMicrophoneStateHandler = ({ state, payload }) => ({
  ...state,
  isMicrophoneActivated: payload,
});

const setCameraStateHandler = ({ state, payload }) => ({
  ...state,
  isCameraActivated: payload,
});

const setIncomingMicrophoneStateHandler = ({ state, payload }) => ({
  ...state,
  isIncomingMicrophoneActivated: payload,
});

const setIncomingCameraStateHandler = ({ state, payload }) => ({
  ...state,
  isIncomingCameraActivated: payload,
});

const configMap = {
  [startVideoChat().type]: startVideoChatHandler,
  [saveMediaDevices().type]: saveMediaDevicesHandler,
  [saveIncomingStream().type]: saveIncomingStreamHandler,
  [setMicrophoneState().type]: setMicrophoneStateHandler,
  [receiveMicrophoneState().type]: setIncomingMicrophoneStateHandler,
  [setCameraState().type]: setCameraStateHandler,
  [receiveCameraState().type]: setIncomingCameraStateHandler,
  [startSession().type]: startSessionHandler,
  [acceptSessionStart().type]: acceptSessionStartHandler,
};

const streamReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default streamReducer;
