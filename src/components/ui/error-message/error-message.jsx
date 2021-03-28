import React from "react";
import { FormattedMessage } from "react-intl";

import AlertIcon from "../../../asset/img/notification_alert.png";

import styles from "./error-message.module.scss";

const ErrorMessage = ({ messageId, className }) => (
  <div className={`${styles.Wrapper} ${className}`}>
    <img src={AlertIcon} alt="alert" />
    <div className={styles.Message}>
      <FormattedMessage id={messageId} />
    </div>
  </div>
);

export default ErrorMessage;
