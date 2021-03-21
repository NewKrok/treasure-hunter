import { createAction } from "./action-creator";

export const changeDisplayName = createAction({ type: "CHANGE_DISPLAY_NAME" });
export const displayNameChanged = createAction({
  type: "DISPLAY_NAME_CHANGED",
});

export const changeEmail = createAction({ type: "CHANGE_EMAIL" });
export const emailChanged = createAction({
  type: "EMAIL_CHANGED",
});

export const changePhotoURL = createAction({ type: "CHANGE_PHOTO_URL" });
export const photoURLChanged = createAction({
  type: "PHOTO_URL_CHANGED",
});
