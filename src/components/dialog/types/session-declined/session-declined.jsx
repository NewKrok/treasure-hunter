import React from "react";

import Button, { ButtonStyle } from "../../../form/button/button";
import SimpleDialog from "../simple-dialog/simple-dialog";

import styles from "../simple-dialog/simple-dialog.module.scss";

const SessionDeclined = ({ close }) => {
  const title = (
    <>
      <i className="fas fa-ban"></i>{" "}
      <span className={styles.Name}>someone...</span> just cancelled the
      session.
    </>
  );

  const content = "Try it later or request a new date in the messenger.";

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

export default SessionDeclined;
