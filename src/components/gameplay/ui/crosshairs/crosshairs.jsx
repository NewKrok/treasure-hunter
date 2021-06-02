import React from "react";

import styles from "./crosshairs.module.scss";

const Crosshairs = () => (
  <div id="crosshairs" className={styles.Wrapper}>
    <div className={styles.CrosshairsHelper} />
  </div>
);

export default Crosshairs;
