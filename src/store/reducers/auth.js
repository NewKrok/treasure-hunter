import {
  signUpRequest,
  signInRequest,
  setSignUpError,
  setSignInError,
  clearSignUpError,
  clearSignInError,
  setUser,
  setProfile,
} from "../actions/auth-action";

const initialState = {
  user: null,
  userDetails: null,
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

const setSignUpErrorHandler = ({ state, payload: signUpError }) => ({
  ...state,
  signUpError,
  isSignUpInProgress: false,
});

const setSignInErrorHandler = ({ state, payload: signInError }) => ({
  ...state,
  signInError,
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

const setUserHandler = ({ state, payload: user }) => ({
  ...state,
  user,
  isSignInInProgress: false,
  isSignUpInProgress: false,
});

const setProfileHandler = ({ state, payload: profile }) => ({
  ...state,
  profile,
});

const configMap = {
  [signUpRequest().type]: signUpRequestHandler,
  [signInRequest().type]: signInRequestHandler,
  [setSignUpError().type]: setSignUpErrorHandler,
  [setSignInError().type]: setSignInErrorHandler,
  [clearSignUpError().type]: clearSignUpErrorHandler,
  [clearSignInError().type]: clearSignInErrorHandler,
  [setUser().type]: setUserHandler,
  [setProfile().type]: setProfileHandler,
};

const authReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default authReducer;
