import React from "react";
import { FormattedMessage } from "react-intl";

import { GetSinglePlayerLevelDetails } from "../../../../../../utils/level-details";

import styles from "./level-button.module.scss";

const LevelButton = ({ levelId, areaId, selected, onSelect }) => {
  const { levelName } = GetSinglePlayerLevelDetails({ levelId, areaId });

  return (
    <div
      className={`${styles.Wrapper} ${selected && styles.Selected}`}
      onClick={onSelect}
    >
      <div className={styles.Label}>
        <FormattedMessage id={levelName} />
      </div>
    </div>
  );
};

export default LevelButton;
