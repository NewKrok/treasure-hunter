const GetUser = (state) => state.authReducer.user;
const GetSignUpError = (state) => state.authReducer.signUpError;
const GetSignInError = (state) => state.authReducer.signInError;
const GetIsSignUpInProgress = (state) => state.authReducer.isSignUpInProgress;
const GetIsSignInInProgress = (state) => state.authReducer.isSignInInProgress;

export {
  GetUser,
  GetSignUpError,
  GetSignInError,
  GetIsSignUpInProgress,
  GetIsSignInInProgress,
};
