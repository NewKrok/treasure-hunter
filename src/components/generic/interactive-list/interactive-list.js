import React from "react";

import styles from "./interactive-list.module.scss";

const InteractiveList = ({ list }) => (
  <div className={styles.Wrapper}>
    {list.map((entry) => (
      <div
        className={`${styles.Entry} ${
          entry.isSelected && styles.SelectedEntry
        }`}
        onClick={entry.select}
        key={entry.key}
      >
        {entry.content}
      </div>
    ))}
  </div>
);

export default InteractiveList;
