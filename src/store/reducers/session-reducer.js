import { SessionState } from "../../enum/session";
import {
  receiveChatMessage,
  receiveEndSession,
  receiveSetChatTypingState,
} from "../actions/server-action";
import {
  startSession,
  stopSession,
  setSessionData,
  destroySession,
  connectionEstablished,
  setAutoSessionRequestCancelTime,
  endSession,
  resetSessionData,
  declineSessionStart,
} from "../actions/session-action";

const initialState = {
  stunServer: null,
  sessionState: SessionState.IDLE,
  startTimeStamp: 0,
  autoCancelTime: 0,
  lastSessionData: {},
  chatMessages: [],
  typingStates: {},
};

const startSessionHandler = ({ state }) => ({
  ...state,
  sessionState:
    state.initializer === null
      ? SessionState.WAITING_FOR_ACCEPT
      : SessionState.ESTABLISH_CONNECTION,
});

const stopSessionHandler = ({ state }) => ({
  ...state,
  sessionState: SessionState.IDLE,
});

const setSessionDataHandler = ({ state, payload }) => ({
  ...state,
  ...payload,
  sessionState: payload.startTimeStamp
    ? SessionState.ESTABLISH_CONNECTION
    : state.sessionState,
  autoCancelTime: payload.startTimeStamp ? 0 : state.autoCancelTime,
});

const connectionEstablishedHandler = ({ state }) => ({
  ...state,
  sessionState: SessionState.IN_PROGRESS,
  startTimeStamp: Date.now(),
});

const destroySessionHandler = ({ state }) => ({
  ...state,
  sessionState:
    state.sessionState !== SessionState.IDLE
      ? SessionState.CLOSING_SESSION
      : state.sessionState,
  chatMessages: [],
  typingStates: {},
});

const resetSessionDataHandler = ({ state }) => ({
  ...state,
  sessionState: SessionState.IDLE,
  stunServer: null,
  autoCancelTime: 0,
  startTimeStamp: 0,
});

const declineSessionHandler = ({ state }) => ({
  ...state,
  sessionState: SessionState.IDLE,
  stunServer: null,
  autoCancelTime: 0,
  startTimeStamp: 0,
});

const setAutoSessionRequestCancelTimeHandler = ({ state, payload }) => ({
  ...state,
  autoCancelTime: payload,
});

const receiveChatMessageHandler = ({ state, payload }) => ({
  ...state,
  chatMessages: [...state.chatMessages, payload],
});

const receiveSetChatTypingStateHandler = ({ state, payload }) => ({
  ...state,
  typingStates: {
    ...state.typingStates,
    [payload.displayName]: payload.state ? payload.displayName : null,
  },
});

const configMap = {
  [startSession().type]: startSessionHandler,
  [stopSession().type]: stopSessionHandler,
  [setSessionData().type]: setSessionDataHandler,
  [connectionEstablished().type]: connectionEstablishedHandler,
  [destroySession().type]: destroySessionHandler,
  [endSession().type]: destroySessionHandler,
  [receiveEndSession().type]: destroySessionHandler,
  [declineSessionStart().type]: declineSessionHandler,
  [setAutoSessionRequestCancelTime()
    .type]: setAutoSessionRequestCancelTimeHandler,
  [resetSessionData().type]: resetSessionDataHandler,
  [receiveChatMessage().type]: receiveChatMessageHandler,
  [receiveSetChatTypingState().type]: receiveSetChatTypingStateHandler,
};

const sessionReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default sessionReducer;
