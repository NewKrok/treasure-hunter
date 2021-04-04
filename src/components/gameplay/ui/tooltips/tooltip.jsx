import React from "react";
import InteractionTooltip from "./tooltip-type/interaction-tooltip";

import styles from "./tooltip.module.scss";

const TooltipId = {
  INTERACTION: "INTERACTION",
};

const createTooltip = (id) => {
  switch (id) {
    case TooltipId.INTERACTION:
      return <InteractionTooltip />;
      break;

    default:
      return "unhandled tooltip type";
  }
};

const Tooltip = ({ id, isOpen }) => (
  <div
    id={`tooltip-${id}`}
    className={`${styles.Wrapper} ${!isOpen && styles.Closed}`}
  >
    {createTooltip(id)}
  </div>
);

export default Tooltip;
