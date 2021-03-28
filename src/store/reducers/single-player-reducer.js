import {
  selectSinglePlayerLevel,
  setLevelProgressDatas,
} from "../actions/single-player-action";

const initialState = {
  selectedAreaId: 0,
  selectedLevelId: 0,
  levelProgressDatas: [],
};

const selectSinglePlayerLevelHandler = ({
  state,
  payload: selectedLevelId,
}) => ({
  ...state,
  selectedLevelId,
});

const setLevelProgressDatasHandler = ({
  state,
  payload: levelProgressDatas,
}) => ({
  ...state,
  levelProgressDatas,
});

const configMap = {
  [selectSinglePlayerLevel().type]: selectSinglePlayerLevelHandler,
  [setLevelProgressDatas().type]: setLevelProgressDatasHandler,
};

const singlePlayerReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default singlePlayerReducer;
