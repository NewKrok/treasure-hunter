import { takeLatest } from "redux-saga/effects";
import { initExternalCommunicator } from "./workers/external-communicator-worker";
import { initApp } from "../store/actions/app-action";

const UserSaga = [takeLatest(initApp().type, initExternalCommunicator)];

export default UserSaga;
