import { createAction } from "./action-creator";

export const signUpRequest = createAction({
  type: "SIGN_UP_REQUEST",
});
export const guestSignInRequest = createAction({
  type: "GUEST_SIGN_IN_REQUEST",
});
export const signInRequest = createAction({
  type: "SIGN_IN_REQUEST",
});
export const signOutRequest = createAction({
  type: "SIGN_OUT_REQUEST",
});
export const setSignUpError = createAction({
  type: "SET_SIGN_UP_ERROR",
});
export const setSignInError = createAction({
  type: "SET_SIGN_IN_ERROR",
});
export const clearSignUpError = createAction({
  type: "CLEAR_SIGN_UP_ERROR",
});
export const clearSignInError = createAction({
  type: "CLEAR_SIGN_IN_ERROR",
});
export const setUser = createAction({
  type: "SET_USER",
});
export const setProfile = createAction({
  type: "SET_PROFILE",
});
