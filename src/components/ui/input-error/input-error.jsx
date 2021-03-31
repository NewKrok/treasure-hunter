import React from "react";
import { FormattedMessage } from "react-intl";

import styles from "./input-error.module.scss";

export const InputErrorType = {
  NOT_VALIDATED_YET: "NOT_VALIDATED_YET",
  MIN_LENGTH: "MIN_LENGTH",
  EMPTY: "EMPTY",
  CUSTOM: "CUSTOM",
};

const errorMap = {
  [InputErrorType.MIN_LENGTH]: "short-input",
};

const getErrorId = ({ type, message }) => {
  if (type === InputErrorType.CUSTOM) return message;

  const errorId = errorMap[type];

  return errorId || "field-is-required";
};

const InputError = ({ validationResult }) =>
  (validationResult &&
    validationResult?.isValidated &&
    !validationResult?.isValid &&
    validationResult.type !== InputErrorType.NOT_VALIDATED_YET && (
      <div className={styles.Wrapper}>
        <FormattedMessage
          id={getErrorId(validationResult)}
          values={validationResult.values}
        />
      </div>
    )) ||
  null;

export default InputError;
