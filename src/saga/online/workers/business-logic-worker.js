import { put } from "redux-saga/effects";

import {
  sendChatMessage,
  receiveChatMessage,
  sendSetChatTypingState,
  receiveSetChatTypingState,
  sendMicrophoneState,
  receiveMicrophoneState,
  sendCameraState,
  receiveCameraState,
  sendEndSession,
  receiveEndSession,
} from "../../../store/actions/server-action";
import { warn } from "../../../utils/logger";

import { dataChannel } from "./webrtc-worker";

const receiveMessageConfig = {
  [sendChatMessage().type]: receiveChatMessage,
  [sendSetChatTypingState().type]: receiveSetChatTypingState,
  [sendMicrophoneState().type]: receiveMicrophoneState,
  [sendCameraState().type]: receiveCameraState,
  [sendEndSession().type]: receiveEndSession,
};

export function* handleIncomingMessage(data) {
  const { header, content } = JSON.parse(data);
  const config = receiveMessageConfig?.[header];
  if (config) yield put(receiveMessageConfig[header](content));
  else
    warn(`Unhandled incoming message header: ${header}, content: ${content}`);
}

const send = ({ header, content }) =>
  dataChannel.send(JSON.stringify({ header, content }));

export const callSendChatMessage = ({ content }) =>
  send({ header: sendChatMessage().type, content: content });

export const callSetChatTypingState = ({ content }) =>
  send({ header: sendSetChatTypingState().type, content: content });

export const callSendMicrophoneState = ({ content }) =>
  send({ header: sendMicrophoneState().type, content: content });

export const callSendCameraState = ({ content }) =>
  send({ header: sendCameraState().type, content: content });

export const callSendEndSession = () => send({ header: sendEndSession().type });
