import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { GetIsSiteinited } from "../../../store/selectors/app-selector";
import Character from "../../../asset/img/menu-character.png";

import styles from "./app-preloader.module.scss";

export const AppPreloader = () => {
  const slider = useRef();
  const [lineWidth, setLineWidth] = useState(0);
  const isSiteinited = useSelector(GetIsSiteinited);
  // TODO Use valid percentage instead of fix 1.5s by animation

  const calculateSVGSize = () => {
    setLineWidth(slider.current.offsetWidth);
  };

  useEffect(() => {
    calculateSVGSize();
    window.addEventListener("resize", calculateSVGSize);

    return () => document.removeEventListener("resize", calculateSVGSize);
  }, []);

  return (
    <div className={`${styles.Wrapper} ${isSiteinited && styles.Loaded}`}>
      <div className={styles.Content}>
        <img className={styles.Character} src={Character} alt="character" />
        <div className={styles.Slider} ref={slider}>
          <div className={styles.Background}></div>
          <div className={styles.Progress}>
            <svg height="0" width="0">
              <defs>
                <clipPath id="app-preloader">
                  <circle cx="30" cy="24" r="16" />
                  <circle cx={Math.max(lineWidth - 30, 0)} cy="24" r="16" />
                  <rect
                    x="30"
                    y="8"
                    width={Math.max(lineWidth - 60, 0)}
                    height="32"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className={styles.Title}>Treasure Hunter</div>
      </div>
    </div>
  );
};

export default AppPreloader;
