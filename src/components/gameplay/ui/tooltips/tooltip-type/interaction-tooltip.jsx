import React from "react";
import { FormattedMessage } from "react-intl";

import InteractionKeyboardImg from "../../../../../asset/img/interaction-keyboard.png";
import InteractionGamepadImg from "../../../../../asset/img/interaction-gamepad.png";

import styles from "./tooltip-common.module.scss";

const InteractionTooltip = ({ id }) => (
  <>
    <FormattedMessage id="interaction" />
    <div className={styles.List}>
      <div className={styles.Row}>
        <img src={InteractionKeyboardImg} alt="keyboard interaction" />
        <FormattedMessage id="keyboard" />
      </div>
      <div className={styles.Row}>
        <img src={InteractionGamepadImg} alt="gamepad interaction" />
        <FormattedMessage id="gamepad" />
      </div>
    </div>
  </>
);

export default InteractionTooltip;
