import { selectSinglePlayerLevel } from "../actions/single-player-action";

const initialState = {
  selectedAreaId: 0,
  selectedLevelId: 0,
};

const selectSinglePlayerLevelHandler = ({
  state,
  payload: selectedLevelId,
}) => ({
  ...state,
  selectedLevelId,
});

const configMap = {
  [selectSinglePlayerLevel().type]: selectSinglePlayerLevelHandler,
};

const singlePlayerReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default singlePlayerReducer;
