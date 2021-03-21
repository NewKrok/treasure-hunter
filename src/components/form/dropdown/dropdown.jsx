import React, { useEffect, useRef, useState } from "react";

import styles from "./dropdown.module.scss";

export const Position = {
  LEFT_TOP: styles.LeftTop,
  BOTTOM_RIGHT: styles.BottomRight,
};

export const Behaviour = {
  OPEN_ON_CLICK: "OPEN_ON_CLICK",
  OPEN_ON_HOVER: "OPEN_ON_HOVER",
};

const Dropdown = ({
  value,
  setValue,
  list = [],
  position = Position.BOTTOM_RIGHT,
  behaviour = Behaviour.OPEN_ON_CLICK,
  className = "",
}) => {
  const timer = useRef(null);
  const root = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const openOnClick = behaviour === Behaviour.OPEN_ON_CLICK;

  const onMouseOver = (e) => {
    if (timer.current) clearTimeout(timer.current);
    setIsOpen(true);
  };

  const onMouseOut = (e) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsOpen(false), 250);
  };

  const onClick = (e) => {
    setIsOpen((v) => !v);
  };

  const checkDocumentClick = (e) => {
    if (root.current) {
      var isClickInside = root.current.contains(e.target);
      if (!isClickInside) setIsOpen(false);
    }
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    document.addEventListener("click", checkDocumentClick);

    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("click", checkDocumentClick);
    };
  }, []);

  return (
    <div
      ref={root}
      className={`${styles.Wrapper} ${className}`}
      onMouseOver={!openOnClick ? onMouseOver : null}
      onMouseOut={!openOnClick ? onMouseOut : null}
      onClick={openOnClick ? onClick : null}
    >
      <div className={`${styles.Label} ${styles.Element}`}>
        <div className={styles.Component}>
          {value ? value.component : "Empty list..."}
        </div>
        <i
          className={`fas fa-chevron-down ${styles.Arrow} ${
            isOpen && styles.FlippedArrow
          }`}
        ></i>
      </div>
      <div
        className={`${styles.Menu} ${position} ${
          isOpen ? styles.OpenMenu : styles.DisabledMenu
        }`}
      >
        {list.map(
          (entry) =>
            entry.key !== value?.key && (
              <div
                className={styles.Element}
                key={entry.key}
                onClick={() => setValue(entry)}
              >
                {entry.component}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Dropdown;
