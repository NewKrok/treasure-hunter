import React from "react";

import styles from "./counter-notification.module.scss";

const CounterNotification = ({ value, className }) => (
  <div
    className={`${styles.Wrapper} ${className} ${value === 0 && styles.Hidden}`}
  >
    {value}
  </div>
);

export default CounterNotification;
