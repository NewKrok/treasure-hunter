import React, { useEffect, useRef, useState } from "react";

import styles from "./progress-bar.module.scss";

const ProgressBar = ({ id, className, value, preloaderLineClassName }) => {
  const slider = useRef();
  const [lineWidth, setLineWidth] = useState(0);

  const calculateSVGSize = () => {
    setLineWidth(slider.current.offsetWidth);
  };

  useEffect(() => {
    calculateSVGSize();
    window.addEventListener("resize", calculateSVGSize);

    return () => document.removeEventListener("resize", calculateSVGSize);
  }, []);

  return (
    <div className={`${styles.Wrapper} ${className}`} ref={slider}>
      <div className={styles.Background}></div>
      <div
        id={id}
        className={`${styles.Progress} ${preloaderLineClassName}`}
        style={{
          width: `${value * 100 || 0}%`,
          clipPath: `url(#${id}-svg)`,
        }}
      >
        <svg height="0" width="0">
          <defs>
            <clipPath id={`${id}-svg`}>
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
  );
};

export default ProgressBar;
