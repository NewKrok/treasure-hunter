import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { endSession } from "../../../../store/actions/session-action";
import { GetStartTime } from "../../../../store/selectors/session";
import Button, { ButtonStyle } from "../../../ui/button/button";
import SimpleDialog from "../simple-dialog/simple-dialog";
import { formatTime } from "../../../../utils/time";

import styles from "./end-session-confirmation.module.scss";
import commonStyles from "../simple-dialog/simple-dialog.module.scss";

const EndSessionConfirmation = ({ close }) => {
  const dispatch = useDispatch();
  const startTime = useSelector(GetStartTime);

  const elapsedTime = formatTime(Date.now() - startTime);

  const _endSession = () => dispatch(endSession());

  const title = (
    <>
      <i className="fas fa-graduation-cap"></i> Do you want to end your session
      with <span className={commonStyles.Name}>someone...</span>?
    </>
  );

  const content = (
    <>
      The current session time is{" "}
      <span className={styles.TimeText}>{elapsedTime}</span>
    </>
  );

  const actions = (
    <>
      <Button
        messageId="end-session"
        icon="fa-ban"
        style={ButtonStyle.Primary}
        autoWidth={false}
        onClick={_endSession}
      />
      <Button
        messageId="continue-session"
        icon="fa-play"
        style={ButtonStyle.Secondary}
        autoWidth={false}
        onClick={close}
      />
    </>
  );

  return <SimpleDialog title={title} content={content} actions={actions} />;
};

export default EndSessionConfirmation;
