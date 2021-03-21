import { createAction } from "./action-creator";

export const speak = createAction({ type: "SPEAK" });
export const speakStopped = createAction({ type: "SPEAK_STOPPED" });
export const stopSpeak = createAction({ type: "STOP_SPEAK" });
export const startSpeechRecognition = createAction({
  type: "START_SPEECH_RECOGNITION",
});
export const speechRecognitionStopped = createAction({
  type: "SPEECH_RECOGNITION_STOPPED",
});
export const stopSpeechRecognition = createAction({
  type: "STOP_SPEECH_RECOGNITION",
});
