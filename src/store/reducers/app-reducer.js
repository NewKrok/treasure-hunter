import { setUser } from "../actions/auth-action";
import {
  changeSiteLanguage,
  saveSiteTranslationData,
} from "../actions/site-language";
import { Themes } from "../../enum/themes";
import { setTheme } from "../actions/app-action";

const initialState = {
  isSiteLanguageLoaded: false,
  isUserDataLoaded: false,
  isSiteinited: false,
  activeTheme: Themes.LIGHT,
  languageId: "en",
};

const getSiteInitedState = ({
  state,
  isSiteLanguageLoaded,
  isUserDataLoaded,
}) =>
  (state.isSiteLanguageLoaded || isSiteLanguageLoaded) &&
  (state.isUserDataLoaded || isUserDataLoaded);

const saveSiteTranslationDataHandler = ({ state, payload: { messages } }) => ({
  ...state,
  messages,
  isSiteLanguageLoaded: true,
  isSiteinited: getSiteInitedState({ state, isSiteLanguageLoaded: true }),
});

const setUserHandler = ({ state, payload }) => {
  const calculatedIsUserListLoaded =
    payload === null ? true : state.isUserListLoaded;
  return {
    ...state,
    isUserDataLoaded: true,
    isUserListLoaded: calculatedIsUserListLoaded,
    isSiteinited: getSiteInitedState({
      state,
      isUserDataLoaded: true,
      isUserListLoaded: calculatedIsUserListLoaded,
    }),
  };
};

const setThemeHandler = ({ state, payload }) => ({
  ...state,
  activeTheme: payload,
});

const changeSiteLanguageHandler = ({ state, payload }) => ({
  ...state,
  languageId: payload.languageId,
});

const configMap = {
  [saveSiteTranslationData().type]: saveSiteTranslationDataHandler,
  [setUser().type]: setUserHandler,
  [setTheme().type]: setThemeHandler,
  [changeSiteLanguage().type]: changeSiteLanguageHandler,
};

const appReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default appReducer;
