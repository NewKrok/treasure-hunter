import React from "react";
import { FormattedDate } from "react-intl";

import styles from "./news-entry.module.scss";

const NewsEntry = ({ date, content }) => (
  <div className={styles.Wrapper}>
    <div className={styles.Container}>
      <div className={styles.Date}>
        <FormattedDate value={date} day="numeric" month="long" year="numeric" />
      </div>
      <div className={styles.Content}>{content}</div>
    </div>
  </div>
);

export default NewsEntry;
