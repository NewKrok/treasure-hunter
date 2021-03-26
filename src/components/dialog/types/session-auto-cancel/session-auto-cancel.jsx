import React from "react";

import Button, { ButtonStyle } from "../../../ui/button/button";
import SimpleDialog from "../simple-dialog/simple-dialog";

import styles from "../simple-dialog/simple-dialog.module.scss";

const SessionAutoCancel = ({ close }) => {
  const title = (
    <>
      <i className="fas fa-exclamation-triangle"></i> Your session with{" "}
      <span className={styles.Name}>someone...</span> was cancelled
    </>
  );

  const content = `There was no answer from someone, try it later or request a new
  date in the messenger.`;

  const actions = (
    <Button
      messageId="close"
      icon="fa-ban"
      style={ButtonStyle.Primary}
      autoWidth={false}
      onClick={close}
    />
  );

  return <SimpleDialog title={title} content={content} actions={actions} />;
};

export default SessionAutoCancel;
