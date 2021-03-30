import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearSignInError,
  signInRequest,
  guestSignInRequest,
} from "../../../store/actions/auth-action";
import Button, { ButtonStyle } from "../../ui/button/button";
import {
  GetIsSignInInProgress,
  GetSignInError,
} from "../../../store/selectors/auth-selector";

import TextInput, { InputError } from "../../ui/text-input/text-input";
import Panel from "../../ui/panel/panel";

import EmailIcon from "../../../asset/img/input-field-icon-email.png";
import PasswordIcon from "../../../asset/img/input-field-icon-pw.png";

import styles from "../auth.module.scss";
import { FormattedMessage } from "react-intl";

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const signInError = useSelector(GetSignInError);
  const isSignInInProgress = useSelector(GetIsSignInInProgress);
  const hasEmailError = [
    "auth/user-not-found",
    "auth/too-many-requests",
  ].includes(signInError?.code);
  const clearEmailError = () => {
    if (hasEmailError) dispatch(clearSignInError());
  };

  const hasPasswordError = signInError?.code === "auth/wrong-password";
  const clearPasswordError = () => {
    if (hasPasswordError) dispatch(clearSignInError());
  };

  const onSignInRequest = () => dispatch(signInRequest({ email, password }));

  const onGuestSignInRequest = () => dispatch(guestSignInRequest());

  const onFormKeyDown = (e) => {
    if (e.keyCode === 13) onSignInRequest();
  };

  return (
    <Panel className={styles.Wrapper} label="sign-in">
      <form className={styles.Form} onKeyDown={onFormKeyDown}>
        <div className={styles.InputArea}>
          <div className={styles.InputBlock}>
            <TextInput
              value={email}
              setValue={setEmail}
              error={emailError}
              setError={setEmailError}
              icon={EmailIcon}
              onFocus={clearEmailError}
              placeholder="email"
              autoComplete="treasure-hunter-email"
              minLength={5}
              maxLength={250}
            />
            {(emailError?.isValidated || hasEmailError) && (
              <div className={styles.InputError}>
                {signInError?.message ||
                emailError.type === InputError.MIN_LENGTH
                  ? "Too short, it has to be at least 5 characters"
                  : "This field is required"}
              </div>
            )}
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={password}
              setValue={setPassword}
              error={passwordError}
              setError={setPasswordError}
              icon={PasswordIcon}
              onFocus={clearPasswordError}
              type="password"
              placeholder="password"
              autoComplete="treasure-hunter-password"
              maxLength={100}
              maxLength={100}
            />
            {(passwordError?.isValidated || hasPasswordError) && (
              <div className={styles.InputError}>
                {signInError?.message ||
                passwordError.type === InputError.MIN_LENGTH
                  ? "Too short, it has to be at least 6 characters"
                  : "This field is required"}
              </div>
            )}
          </div>
        </div>
        <div className={styles.ActionArea}>
          <Button
            messageId="sign-in"
            onClick={onSignInRequest}
            style={ButtonStyle.Secondary}
            isLoading={isSignInInProgress}
            autoWidth={false}
            isEnabled={!emailError && !passwordError}
          />
          <span>
            <FormattedMessage id="or" />
          </span>
          <Button
            messageId="sign-up"
            style={ButtonStyle.Primary}
            navigationTarget="/home/single-player/sign-up"
            autoWidth={false}
          />
          <span>
            <FormattedMessage id="or" />
          </span>
          <Button
            messageId="play-as-guest"
            onClick={onGuestSignInRequest}
            style={ButtonStyle.Tertiary}
            autoWidth={false}
          />
        </div>
      </form>
    </Panel>
  );
};

export default SignIn;
