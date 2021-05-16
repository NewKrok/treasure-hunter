import React from "react";

import ProgressBar from "../../../ui/progress-bar/progress-bar";

import styles from "./stamina-bar.module.scss";

const StaminaBar = () => (
  <ProgressBar id="stamina-bar" className={styles.Wrapper} />
);

export default StaminaBar;
