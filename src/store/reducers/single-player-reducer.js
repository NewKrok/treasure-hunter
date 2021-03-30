import {
  selectSinglePlayerLevel,
  setLocalLevelProgressData,
  overrideLocalLevelProgressData,
} from "../actions/single-player-action";

const initialState = {
  selectedAreaId: 0,
  selectedLevelId: 0,
  levelProgressData: {},
};

const selectSinglePlayerLevelHandler = ({
  state,
  payload: selectedLevelId,
}) => ({
  ...state,
  selectedLevelId,
});

const setLocalLevelProgressDataHandler = ({
  state,
  payload: { areaId, levelId, data },
}) => ({
  ...state,
  levelProgressData: {
    ...state.levelProgressData,
    [areaId]: {
      ...[state.levelProgressData?.[areaId] || {}],
      [levelId]: {
        ...[state.levelProgressData?.[areaId]?.[levelId] || {}],
        data,
      },
    },
  },
});

const overrideLocalLevelProgressDataHandler = ({
  state,
  payload: levelProgressData,
}) => ({
  ...state,
  levelProgressData,
});

const configMap = {
  [selectSinglePlayerLevel().type]: selectSinglePlayerLevelHandler,
  [overrideLocalLevelProgressData()
    .type]: overrideLocalLevelProgressDataHandler,
  [setLocalLevelProgressData().type]: setLocalLevelProgressDataHandler,
};

const singlePlayerReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default singlePlayerReducer;
