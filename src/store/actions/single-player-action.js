import { createAction } from "./action-creator";

export const selectSinglePlayerLevel = createAction({
  type: "SELECT_SINGLE_PLAYER_LEVEL",
});

export const setLevelProgressDatas = createAction({
  type: "SET_LEVEL_PROGRESS_DATAS",
});
