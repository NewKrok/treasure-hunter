import { takeLatest } from "redux-saga/effects";

import {
  changeDisplayName,
  changeEmail,
  changePhotoURL,
} from "../store/actions/user-action";
import {
  changeDisplayNameHandler,
  changeEmailHandler,
  changePhotoURLHandler,
} from "./workers/user-worker";

const UserSaga = [
  takeLatest(changeDisplayName().type, changeDisplayNameHandler),
  takeLatest(changeEmail().type, changeEmailHandler),
  takeLatest(changePhotoURL().type, changePhotoURLHandler),
];

export default UserSaga;
