import {
  hideTooltip,
  showTooltip,
} from "../actions/external-communicator-action";

const initialState = {
  tooltips: {},
};

const showTooltipHandler = ({ state, payload: { id } }) => ({
  ...state,
  tooltips: {
    ...state.tooltips,
    [id]: { isOpen: true },
  },
});

const hideTooltipHandler = ({ state, payload: { id } }) => ({
  ...state,
  tooltips: {
    ...state.tooltips,
    [id]: { isOpen: false, closeTime: Date.now() },
  },
});

const configMap = {
  [showTooltip().type]: showTooltipHandler,
  [hideTooltip().type]: hideTooltipHandler,
};

const gameReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default gameReducer;
