import React from "react";
import { FormattedMessage } from "react-intl";
import TextInput from "../../../form/text-input/text-input";

import commonStyles from "../../settings.module.scss";
import styles from "./settings-text-entry.module.scss";

const SettingsTextEntry = ({
  title = "",
  info = "",
  value,
  setValue,
  maxLength,
}) => {
  return (
    <div className={commonStyles.Entry}>
      <h2>
        <FormattedMessage id={title} />
      </h2>
      <div className={commonStyles.Info}>
        <i className="fas fa-info-circle"></i> <FormattedMessage id={info} />
      </div>
      <TextInput
        value={value}
        setValue={setValue}
        maxLength={maxLength}
        className={styles.Content}
      />
    </div>
  );
};

export default SettingsTextEntry;
