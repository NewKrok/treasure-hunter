import React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { GetSelectedSinglePlayerLevelDetails } from "../../../../../store/selectors/single-player-selector";
import Button, { ButtonStyle } from "../../../../ui/button/button";
import SinglePlayerLevelList from "./single-player-level-list/single-player-level-list";

import styles from "./single-player.module.scss";

const SinglePlayer = () => {
  const { levelId, areaId, levelName, description } = useSelector(
    GetSelectedSinglePlayerLevelDetails
  );

  return (
    <div className={styles.Wrapper}>
      <SinglePlayerLevelList
        selectedLevelId={levelId}
        selectedAreaId={areaId}
      />
      <div className={styles.Selected}>
        <div className={styles.Preview}></div>
        {levelName && (
          <div className={styles.Details}>
            <div className={styles.Description}>
              <div className={styles.Name}>
                <FormattedMessage id={levelName} />
              </div>
              <FormattedMessage id={description} />
            </div>
            <Button
              navigationTarget="/play"
              style={ButtonStyle.Primary}
              messageId="play"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlayer;
