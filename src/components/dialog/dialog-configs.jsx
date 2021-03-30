import React from "react";

import StartSession from "./types/start-session/start-session";
import StartSessionConfirmation from "./types/start-session-confirmation/start-session-confirmation";
import SessionDeclined from "./types/session-declined/session-declined";
import SessionAutoCancel from "./types/session-auto-cancel/session-auto-cancel";
import { DialogId } from "./dialog";
import SessionCancelByInitializer from "./types/session-cancel-by-initializer/session-cancel-by-initializer";
import EndSessionConfirmation from "./types/end-session-confirmation/end-session-confirmation";
import Profile from "./types/profile/profile";

export const getDialog = ({ dialogId, close }) => {
  switch (dialogId) {
    case DialogId.PROFILE:
      return {
        isCloseable: true,
        label: "your-profile",
        component: <Profile close={close} />,
      };

    case DialogId.START_SESSION:
      return {
        isCloseable: true,
        component: <StartSession close={close} />,
      };

    case DialogId.START_SESSION_CONFIRMATION:
      return {
        isCloseable: false,
        component: <StartSessionConfirmation close={close} />,
      };

    case DialogId.SESSION_DECLINED:
      return {
        isCloseable: true,
        component: <SessionDeclined close={close} />,
      };

    case DialogId.SESSION_AUTO_CANCEL:
      return {
        isCloseable: true,
        component: <SessionAutoCancel close={close} />,
      };

    case DialogId.SESSION_CANCEL_BY_INITIALIZER:
      return {
        isCloseable: true,
        component: <SessionCancelByInitializer close={close} />,
      };

    case DialogId.END_SESSION_CONFIRMATION:
      return {
        isCloseable: true,
        component: <EndSessionConfirmation close={close} />,
      };

    default:
      return <div />;
  }
};
