import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import ErrorIcon from "../../../asset/img/input-field-icon-error.png";

import styles from "./text-input.module.scss";

export const InputError = {
  NOT_VALIDATED_YET: "NOT_VALIDATED_YET",
  MIN_LENGTH: "MIN_LENGTH",
  VALIDATION: "VALIDATION",
};

const TextInput = ({
  className = null,
  name = "",
  placeholder = "",
  type = "text",
  onFocus = null,
  onBlur = null,
  value,
  setValue,
  error,
  setError,
  icon = "",
  autoComplete = "on",
  onKeyDown,
  insertValue = null,
  setInsertValue = null,
  minLength = null,
  maxLength = null,
  validation = null,
}) => {
  const input = useRef();
  const formattedPlaceholder = useIntl().formatMessage({ id: placeholder });

  const onBlurHandler = (e) => {
    if (onBlur) onBlur(e);

    if (validation && !validation(value)) {
      setError({ isValidated: true, type: InputError.VALIDATION });
      return;
    }
    if (minLength && value.length < minLength) {
      setError({ isValidated: true, type: InputError.MIN_LENGTH });
      return;
    }

    setError(null);
  };

  const onFocusHandler = (e) => {
    if (onFocus) onFocus(e);

    setError({ isValidated: false, type: InputError.NOT_VALIDATED_YET });
  };

  useEffect(() => {
    if (insertValue === null) return;

    const { selectionStart } = input.current;
    const newValue = `${value.slice(
      0,
      selectionStart
    )}${insertValue}${value.slice(selectionStart)}`;

    setValue(newValue);
    input.current.selectionStart = newValue.length;
    setInsertValue("");
  }, [value, setValue, insertValue, setInsertValue]);

  useEffect(() => {
    setError &&
      setError({ isValidated: false, type: InputError.NOT_VALIDATED_YET });
  }, [setError]);

  return (
    <div
      className={`${styles.Wrapper} ${
        value === "" && styles.Empty
      } ${className}`}
    >
      {icon && <img src={icon} alt="button icon" />}
      <input
        ref={input}
        name={name}
        placeholder={formattedPlaceholder}
        type={type}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${icon && styles.WithIcon} ${
          error?.isValidated && styles.Error
        }`}
        autoComplete={autoComplete}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
      {error?.isValidated && (
        <img src={ErrorIcon} alt="error icon" className={styles.ErrorIcon} />
      )}
    </div>
  );
};

export default TextInput;
