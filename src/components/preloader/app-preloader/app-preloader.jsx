import React from "react";
import { useSelector } from "react-redux";

import { GetIsSiteinited } from "../../../store/selectors/app-selector";
import Character from "../../../asset/img/menu-character.png";

import styles from "./app-preloader.module.scss";
import ProgressBar from "../../ui/progress-bar/progress-bar";

export const AppPreloader = () => {
  const isSiteinited = useSelector(GetIsSiteinited);
  // TODO Use valid percentage instead of fix 1.5s by animation

  return (
    <div className={`${styles.Wrapper} ${isSiteinited && styles.Loaded}`}>
      <div className={styles.Content}>
        <img className={styles.Character} src={Character} alt="character" />
        <ProgressBar
          id="preloader"
          className={styles.Preloader}
          preloaderLineClassName={styles.PreloaderLine}
          value={isSiteinited ? 1 : 0}
        />
        <div className={styles.Title}>Treasure Hunter</div>
      </div>
    </div>
  );
};

export default AppPreloader;
