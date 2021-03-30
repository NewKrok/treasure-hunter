import { createAction } from "./action-creator";

export const selectSinglePlayerLevel = createAction({
  type: "SELECT_SINGLE_PLAYER_LEVEL",
});

export const setLocalLevelProgressData = createAction({
  type: "SET_LOCAL_LEVEL_PROGRESS_DATA",
});

export const overrideLocalLevelProgressData = createAction({
  type: "OVERRIDE_LOCAL_LEVEL_PROGRESS_DATA",
});
