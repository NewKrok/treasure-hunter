export const GetUser = (state) => state.authReducer.user;
export const GetProfile = (state) => state.authReducer.profile || {};
export const GetSignUpError = (state) => state.authReducer.signUpError;
export const GetSignInError = (state) => state.authReducer.signInError;
export const GetIsSignUpInProgress = (state) =>
  state.authReducer.isSignUpInProgress;
export const GetIsSignInInProgress = (state) =>
  state.authReducer.isSignInInProgress;
