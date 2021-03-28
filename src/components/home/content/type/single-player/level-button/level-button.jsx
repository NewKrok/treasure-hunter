import React from "react";
import { FormattedMessage } from "react-intl";

import { GetSinglePlayerLevelProgressData } from "../../../../../../store/selectors/single-player-selector";
import { GetSinglePlayerLevelDetails } from "../../../../../../utils/level-details";

import LockImage from "../../../../../../asset/img/stage-lock-icon-key.png";

import styles from "./level-button.module.scss";

const LevelButton = ({ levelId, areaId, selected, onSelect }) => {
  const { levelName } = GetSinglePlayerLevelDetails({ levelId, areaId });
  const { isUnlocked } = GetSinglePlayerLevelProgressData({ levelId, areaId });

  return (
    <div
      className={`${styles.Wrapper} ${selected && styles.Selected} ${
        !isUnlocked && styles.Locked
      }`}
      onClick={onSelect}
    >
      {isUnlocked ? (
        <div className={styles.Label}>
          <FormattedMessage id={levelName} />
        </div>
      ) : (
        <img src={LockImage} alt="lock" />
      )}
    </div>
  );
};

export default LevelButton;
