import { createAction } from "./action-creator";

export const sendTextNote = createAction({ type: "SEND_TEXT_NOTE" });
export const sendImageNote = createAction({ type: "SEND_IMAGE_NOTE" });
export const receiveNote = createAction({ type: "RECEIVE_NOTE" });
export const setNoteImageUploadState = createAction({
  type: "SET_NOTE_IMAGE_UPLOAD_STATE",
});
