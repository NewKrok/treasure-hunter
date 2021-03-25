import React from "react";

import styles from "./panel.module.scss";

const Panel = ({ children, label, className }) => (
  <div className={`${styles.Wrapper} ${className}`}>
    {label && (
      <div className={styles.Label}>
        <div>{label}</div>
      </div>
    )}
    {children}
  </div>
);

export default Panel;
