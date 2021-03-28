import React from "react";
import { useDispatch } from "react-redux";

import { selectSinglePlayerLevel } from "../../../../../../store/actions/single-player-action";
import LevelButton from "../level-button/level-button";

import styles from "./single-player-level-list.module.scss";

const SinglePlayerLevelList = ({ selectedLevelId, selectedAreaId }) => {
  const dispatch = useDispatch();
  const selectLevel = (id) => dispatch(selectSinglePlayerLevel(id));

  return (
    <div className={styles.Wrapper}>
      {Array.from({ length: 9 }, (_, index) => (
        <LevelButton
          key={`level-${index}`}
          levelId={index}
          areaId={selectedAreaId}
          selected={selectedLevelId === index}
          onSelect={() => selectLevel(index)}
        />
      ))}
    </div>
  );
};

export default SinglePlayerLevelList;
