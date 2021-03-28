import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import styles from "./text-input.module.scss";

const TextInput = ({
  className = null,
  name = "",
  placeholder = "",
  type = "text",
  onFocus = null,
  value,
  setValue,
  icon = "",
  autoComplete = "on",
  onKeyDown,
  insertValue = null,
  setInsertValue = null,
  maxLength = null,
}) => {
  const input = useRef();
  const formattedPlaceholder = useIntl().formatMessage({ id: placeholder });

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
        onFocus={onFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={icon && styles.WithIcon}
        autoComplete={autoComplete}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
    </div>
  );
};

export default TextInput;
