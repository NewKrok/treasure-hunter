import React from "react";

import styles from "./simple-dialog.module.scss";

const SimpleDialog = ({ title, content, actions, actionsClassName }) => {
  return (
    <>
      {title && <h1>{title}</h1>}
      <div className={styles.Content}>{content}</div>
      <div className={`${styles.Actions} ${actionsClassName}`}>{actions}</div>
    </>
  );
};

export default SimpleDialog;
