import React from "react";

import StartSession from "./types/start-session/start-session";
import StartSessionConfirmation from "./types/start-session-confirmation/start-session-confirmation";
import SessionDeclined from "./types/session-declined/session-declined";
import SessionAutoCancel from "./types/session-auto-cancel/session-auto-cancel";
import { DIALOG_ID } from "./dialog";
import SessionCancelByInitializer from "./types/session-cancel-by-initializer/session-cancel-by-initializer";
import EndSessionConfirmation from "./types/end-session-confirmation/end-session-confirmation";

export const getDialog = ({ dialogId, close }) => {
  switch (dialogId) {
    case DIALOG_ID.START_SESSION:
      return {
        isCloseable: true,
        component: <StartSession close={close} />,
      };

    case DIALOG_ID.START_SESSION_CONFIRMATION:
      return {
        isCloseable: false,
        component: <StartSessionConfirmation close={close} />,
      };

    case DIALOG_ID.SESSION_DECLINED:
      return {
        isCloseable: true,
        component: <SessionDeclined close={close} />,
      };

    case DIALOG_ID.SESSION_AUTO_CANCEL:
      return {
        isCloseable: true,
        component: <SessionAutoCancel close={close} />,
      };

    case DIALOG_ID.SESSION_CANCEL_BY_INITIALIZER:
      return {
        isCloseable: true,
        component: <SessionCancelByInitializer close={close} />,
      };

    case DIALOG_ID.END_SESSION_CONFIRMATION:
      return {
        isCloseable: true,
        component: <EndSessionConfirmation close={close} />,
      };

    default:
      return <div />;
  }
};
