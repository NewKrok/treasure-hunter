import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetSelectedDialogId } from "../../store/selectors/dialog";
import { closeDialog } from "../../store/actions/dialog-action";
import { getDialog } from "./dialog-configs";

import styles from "./dialog.module.scss";

export const DIALOG_ID = {
  START_SESSION: "START_SESSION",
  START_SESSION_CONFIRMATION: "START_SESSION_CONFIRMATION",
  SESSION_DECLINED: "SESSION_DECLINED",
  SESSION_AUTO_CANCEL: "SESSION_AUTO_CANCEL",
  SESSION_CANCEL_BY_INITIALIZER: "SESSION_CANCEL_BY_INITIALIZER",
  END_SESSION_CONFIRMATION: "END_SESSION_CONFIRMATION",
};

const Dialog = () => {
  const dispatch = useDispatch();
  const lastContent = useRef();
  const dialogId = useSelector(GetSelectedDialogId);
  const [forceUpdate, setForceUpdate] = useState(0);

  const close = () => dispatch(closeDialog());
  const activeDialog = getDialog({ dialogId, close });
  lastContent.current = activeDialog.component || lastContent.current;

  // It removes the dialog from the dom with animation
  useEffect(() => {
    let timeout;
    if (!dialogId && lastContent.current)
      timeout = setTimeout(() => {
        lastContent.current = null;
        setForceUpdate(Date.now());
      }, 250);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [dialogId]);

  return (
    <div
      className={`${styles.Wrapper} ${dialogId && styles.ActiveWrapper}`}
      key={forceUpdate}
    >
      <div
        className={`${styles.Cover} ${
          !activeDialog.isCloseable && styles.InactiveCover
        }`}
        onClick={activeDialog.isCloseable ? close : null}
      />
      <div className={`${styles.Content} ${dialogId && styles.ActiveContent}`}>
        {activeDialog.isCloseable && (
          <div className={styles.Close} onClick={close}>
            <i className="far fa-times-circle"></i>
          </div>
        )}
        {lastContent.current}
      </div>
    </div>
  );
};

export default Dialog;
