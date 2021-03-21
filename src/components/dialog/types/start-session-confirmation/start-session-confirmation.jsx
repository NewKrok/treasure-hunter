import React from "react";
import { useDispatch } from "react-redux";

import {
  acceptSessionStart,
  declineSessionStart,
} from "../../../../store/actions/session-action";
import Button, { ButtonStyle } from "../../../form/button/button";

import styles from "../simple-dialog/simple-dialog.module.scss";
import SimpleDialog from "../simple-dialog/simple-dialog";

const StartSessionConfirmation = () => {
  const dispatch = useDispatch();

  const _acceptSessionStart = () =>
    dispatch(
      acceptSessionStart({
        camera: false,
        microphone: false,
      })
    );
  const _declineSessionStart = () => dispatch(declineSessionStart());

  const title = (
    <>
      <i className="fas fa-graduation-cap"></i>{" "}
      <span className={styles.Name}>someone...</span> wants to start a session.
      Are you ready?
    </>
  );

  const content = <div>content...</div>;

  const actions = (
    <>
      <Button
        label={"Start Session"}
        icon={"fa-play"}
        style={ButtonStyle.Primary}
        autoWidth={false}
        onClick={_acceptSessionStart}
      />
      <Button
        messageId="cancel"
        icon="fa-ban"
        style={ButtonStyle.Secondary}
        autoWidth={false}
        onClick={_declineSessionStart}
      />
    </>
  );

  return <SimpleDialog title={title} content={content} actions={actions} />;
};

export default StartSessionConfirmation;
