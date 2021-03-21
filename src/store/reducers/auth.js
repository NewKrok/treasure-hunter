import {
  signUpRequest,
  signInRequest,
  setSignUpError,
  setSignInError,
  clearSignUpError,
  clearSignInError,
  setUser,
} from "../actions/auth";

const initialState = {
  user: null,
  signUpError: null,
  signInError: null,
  isSignUpInProgress: false,
  isSignInInProgress: false,
};

const signUpRequestHandler = ({ state }) => ({
  ...state,
  isSignUpInProgress: true,
  signUpError: null,
});

const signInRequestHandler = ({ state }) => ({
  ...state,
  isSignInInProgress: true,
  signInError: null,
});

const setSignUpErrorHandler = ({ state, payload }) => ({
  ...state,
  signUpError: payload,
  isSignUpInProgress: false,
});

const setSignInErrorHandler = ({ state, payload }) => ({
  ...state,
  signInError: payload,
  isSignInInProgress: false,
});

const clearSignUpErrorHandler = ({ state }) => ({
  ...state,
  signUpError: null,
});

const clearSignInErrorHandler = ({ state }) => ({
  ...state,
  signInError: null,
});

const setUserHandler = ({ state, payload }) => ({
  ...state,
  user: payload,
  isSignInInProgress: false,
  isSignUpInProgress: false,
});

const configMap = {
  [signUpRequest().type]: signUpRequestHandler,
  [signInRequest().type]: signInRequestHandler,
  [setSignUpError().type]: setSignUpErrorHandler,
  [setSignInError().type]: setSignInErrorHandler,
  [clearSignUpError().type]: clearSignUpErrorHandler,
  [clearSignInError().type]: clearSignInErrorHandler,
  [setUser().type]: setUserHandler,
};

const authReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default authReducer;
