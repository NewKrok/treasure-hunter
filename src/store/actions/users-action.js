import { createAction } from "./action-creator";

export const addUsers = createAction({ type: "ADD_USERS" });
export const setUserPresence = createAction({ type: "SET_USER_PRESENCE" });
