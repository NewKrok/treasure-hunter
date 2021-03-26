import React from "react";

import Button, { ButtonStyle } from "../../../ui/button/button";
import SimpleDialog from "../simple-dialog/simple-dialog";

import styles from "../simple-dialog/simple-dialog.module.scss";

const SessionCancelByInitializer = ({ close }) => {
  const title = (
    <>
      <i className="fas fa-info-circle"></i>{" "}
      <span className={styles.Name}>initializer</span>
      just cancelled the session request
    </>
  );

  const content = <div>content....</div>;

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

export default SessionCancelByInitializer;
