const GetState = (state) => state.streamReducer.state;
const GetMediaDevices = (state) => state.streamReducer.mediaDevices;
const GetIncomingStream = (state) => state.streamReducer.incomingStream;
const GetIsCameraActivated = (state) => state.streamReducer.isCameraActivated;
const GetIsIncomingCameraActivated = (state) =>
  state.streamReducer.isIncomingCameraActivated;
const GetIsMicrophoneActivated = (state) =>
  state.streamReducer.isMicrophoneActivated;
const GetIsIncomingMicrophoneActivated = (state) =>
  state.streamReducer.isIncomingMicrophoneActivated;

export {
  GetState,
  GetMediaDevices,
  GetIncomingStream,
  GetIsCameraActivated,
  GetIsMicrophoneActivated,
  GetIsIncomingMicrophoneActivated,
  GetIsIncomingCameraActivated,
};
