import { closeDialog, openDialog } from "../actions/dialog-action";

const initialState = {
  selectedDialogId: null,
};

const openDialogHandler = ({ state, payload }) => ({
  ...state,
  selectedDialogId: payload,
});

const closeDialogHandler = ({ state }) => ({
  ...state,
  selectedDialogId: null,
});

const configMap = {
  [openDialog().type]: openDialogHandler,
  [closeDialog().type]: closeDialogHandler,
};

const dialogReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default dialogReducer;
