import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button, { ButtonStyle } from "../form/button/button";
import SiteLanguageSelector from "./site-language-selector/site-language-selector";
import { signOutRequest } from "../../store/actions/auth-action";

import styles from "./header.module.scss";
import CounterNotification from "../form/counter-notification/counter-notification";
import { GetActiveTheme } from "../../store/selectors/app-selector";
import { Themes } from "../../enum/themes";
import { setTheme } from "../../store/actions/app-action";
import { GetUser } from "../../store/selectors/auth-selector";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(GetUser);
  const activeTheme = useSelector(GetActiveTheme);
  const history = useHistory();

  const signOut = () => dispatch(signOutRequest());
  const setThemeToDark = () => dispatch(setTheme(Themes.DARK));
  const setThemeToLight = () => dispatch(setTheme(Themes.LIGHT));
  const goToSettings = () => history.push("/settings");

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Menu}>
        {user ? (
          <>
            <div className={styles.Messages}>
              <Button
                icon={"fa-comment-alt"}
                messageId={"messages"}
                style={ButtonStyle.Primary}
                navigationTarget="/messages"
              />
              <CounterNotification className={styles.Counter} value={0} />
            </div>
            <div className={styles.UserMenu}>
              <img
                className={styles.Avatar}
                src={user.photoURL}
                alt="avatar"
                onClick={goToSettings}
              />
              <div className={styles.DropDown}>
                <h1>Hello {user.displayName}</h1>
                <Button
                  icon="fa-cog"
                  messageId="settings"
                  style={ButtonStyle.Primary}
                  navigationTarget="/settings"
                  className={styles.Button}
                  autoWidth={false}
                />
                <SiteLanguageSelector />
                <div className={styles.Themes}>
                  <Button
                    icon="fa-moon"
                    style={
                      activeTheme === Themes.LIGHT
                        ? ButtonStyle.Primary
                        : ButtonStyle.Secondary
                    }
                    onClick={setThemeToDark}
                    autoWidth={false}
                    className={styles.Button}
                    isEnabled={activeTheme === Themes.LIGHT}
                  />
                  <Button
                    icon="fa-sun"
                    style={
                      activeTheme !== Themes.LIGHT
                        ? ButtonStyle.Primary
                        : ButtonStyle.Secondary
                    }
                    onClick={setThemeToLight}
                    autoWidth={false}
                    className={styles.Button}
                    isEnabled={activeTheme !== Themes.LIGHT}
                  />
                </div>
                <Button
                  messageId="sign-out"
                  icon="fa-sign-out-alt"
                  style={ButtonStyle.Secondary}
                  onClick={signOut}
                  autoWidth={false}
                  className={styles.Button}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <SiteLanguageSelector />
            <Button
              messageId="sign-in"
              icon="fa-sign-in-alt"
              style={ButtonStyle.Primary}
              navigationTarget="/sign-in"
            />
            <Button
              messageId="sign-up"
              icon="fa-user-plus"
              style={ButtonStyle.Secondary}
              navigationTarget="/sign-up"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
