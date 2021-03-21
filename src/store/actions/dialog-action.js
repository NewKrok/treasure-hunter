import { createAction } from "./action-creator";

export const openDialog = createAction({
  type: "OPEN_DIALOG",
});
export const closeDialog = createAction({
  type: "CLOSE_DIALOG",
});
