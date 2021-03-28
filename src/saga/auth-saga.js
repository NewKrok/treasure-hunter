import { takeLatest } from "@redux-saga/core/effects";

import { initApp } from "../store/actions/app-action";
import {
  guestSignInRequest,
  signInRequest,
  signOutRequest,
  signUpRequest,
} from "../store/actions/auth";
import {
  initAppHandler,
  signUpRequestHandler,
  guestSignInRequestHandler,
  signInRequestHandler,
  signOutRequestHandler,
} from "./workers/auth-worker";

const Auth = [
  takeLatest(initApp().type, initAppHandler),
  takeLatest(signUpRequest().type, signUpRequestHandler),
  takeLatest(guestSignInRequest().type, guestSignInRequestHandler),
  takeLatest(signInRequest().type, signInRequestHandler),
  takeLatest(signOutRequest().type, signOutRequestHandler),
];

export default Auth;
