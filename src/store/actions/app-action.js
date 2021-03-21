import { createAction } from "./action-creator";

export const initApp = createAction({ type: "INIT_APP" });
export const setTheme = createAction({ type: "SET_THEME" });
