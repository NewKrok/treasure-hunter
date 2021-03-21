import { SessionState } from "../../enum/session";

export const GetIsSessionInProgress = (state) =>
  state.sessionReducer.sessionState === SessionState.IN_PROGRESS;
export const GetIsSessionClosing = (state) =>
  state.sessionReducer.sessionState === SessionState.CLOSING_SESSION;
export const GetSessionState = (state) => state.sessionReducer.sessionState;
export const GetAutoCancelTime = (state) => state.sessionReducer.autoCancelTime;
export const GetSessionUsers = (state) => state.sessionReducer.initializer;
export const GetStunServerOfSession = (state) =>
  state.sessionReducer.stunServer;
export const GetStartTime = (state) => state.sessionReducer.startTimeStamp;
export const GetChatMessages = (state) => state.sessionReducer.chatMessages;
export const GetChatTypingStates = (state) => state.sessionReducer.typingStates;
