import React, { useEffect, useRef } from "react";

import styles from "./text-input.module.scss";

const TextInput = ({
  className = null,
  name = "",
  placeholder = "",
  type = "text",
  onFocus = null,
  value,
  setValue,
  iconPrefix = "fas",
  icon = "",
  autoComplete = "on",
  onKeyDown,
  insertValue = null,
  setInsertValue = null,
  maxLength = null,
}) => {
  const input = useRef();

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
    <div className={`${styles.Wrapper} ${className}`}>
      <input
        ref={input}
        name={name}
        placeholder={placeholder}
        type={type}
        onFocus={onFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={icon && styles.WithIcon}
        autoComplete={autoComplete}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
      {icon && <i className={`${iconPrefix} ${icon}`}></i>}
    </div>
  );
};

export default TextInput;
