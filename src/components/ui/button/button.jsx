import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { GetSiteLanguageMessages } from "../../../store/selectors/app-selector";

import styles from "./button.module.scss";

const ButtonStyle = {
  Primary: "Primary",
  Secondary: "Secondary",
  Tertiary: "Tertiary",
};

const Button = ({
  label = "",
  messageId = null,
  messageValues = null,
  onClick = null,
  style = null,
  iconPrefix = "fas",
  icon = "",
  selectedIcon = null,
  isLoading = false,
  navigationTarget = null,
  className = null,
  children = null,
  autoWidth = false,
  isEnabled = true,
  selected = false,
}) => {
  const root = useRef();
  const container = useRef();
  const selectedLanguage = useSelector(GetSiteLanguageMessages);
  const history = useHistory();

  const onClickHandler = () => {
    if (navigationTarget !== null) history.push(navigationTarget);
    if (onClick) onClick();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (root.current && autoWidth) {
        root.current.style.width = "0px";
        root.current.style.width = `${
          container.current.getBoundingClientRect().width + 30 + 1
        }px`;
      }

      return () => clearTimeout(timer);
    }, 100);
  }, [messageId, label, selectedLanguage, autoWidth]);

  let styleClassName = "";
  switch (style) {
    case ButtonStyle.Primary:
      styleClassName = styles.PrimaryButton;
      break;
    case ButtonStyle.Secondary:
      styleClassName = styles.SecondaryButton;
      break;
    case ButtonStyle.Tertiary:
      styleClassName = styles.TertiaryButton;
      break;
    default:
  }
  return (
    <div
      className={`${styleClassName} ${className} ${
        isLoading && styles.Loading
      } ${!isEnabled && styles.Disabled} ${selected ? styles.Selected : null}`}
      onClick={onClickHandler}
      ref={root}
    >
      <div ref={container}>
        {(icon || (selectedIcon && selected)) && (
          <i
            className={`${iconPrefix} ${
              selectedIcon && selected ? selectedIcon : icon
            } ${(messageId || label) && styles.IconMargin}`}
          ></i>
        )}
        {messageId === null ? (
          label
        ) : (
          <FormattedMessage id={messageId} values={messageValues} />
        )}
        {children}
      </div>
    </div>
  );
};

export { ButtonStyle };
export default Button;
