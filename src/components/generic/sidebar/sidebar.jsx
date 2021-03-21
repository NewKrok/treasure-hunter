import React from "react";
import { FormattedMessage } from "react-intl";

import styles from "./sidebar.module.scss";

const Sidebar = ({ titleId, iconPrefix = "fas", icon = "", children }) => (
  <div className={styles.Wrapper}>
    <h1>
      <i className={`${iconPrefix} ${icon}`}></i>
      <FormattedMessage id={titleId} />
    </h1>
    {children}
  </div>
);

export default Sidebar;
