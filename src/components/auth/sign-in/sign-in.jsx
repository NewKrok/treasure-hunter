import React, { useEffect, useState } from "react";
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

import TextInput from "../../ui/text-input/text-input";
import Panel from "../../ui/panel/panel";

import EmailIcon from "../../../asset/img/input-field-icon-email.png";
import PasswordIcon from "../../../asset/img/input-field-icon-pw.png";

import styles from "../auth.module.scss";
import { FormattedMessage } from "react-intl";
import { InputErrorType } from "../../ui/input-error/input-error";

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailValidationResult, setEmailValidationResult] = useState({
    isValid: false,
  });
  const [password, setPassword] = useState("");
  const [passwordValidationResult, setPasswordValidationResult] = useState({
    isValid: false,
  });
  const signInError = useSelector(GetSignInError);
  const isSignInInProgress = useSelector(GetIsSignInInProgress);
  const hasEmailError = [
    "auth/user-not-found",
    "auth/invalid-email",
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

  useEffect(() => {
    if (hasEmailError && emailValidationResult.isValidated)
      setEmailValidationResult({
        isValidated: true,
        isValid: false,
        type: InputErrorType.CUSTOM,
        message: signInError?.code.replace("auth/", ""),
      });
    else if (hasPasswordError && passwordValidationResult.isValidated)
      setPasswordValidationResult({
        isValidated: true,
        isValid: false,
        type: InputErrorType.CUSTOM,
        message: signInError?.code.replace("auth/", ""),
      });
  }, [signInError]);

  return (
    <Panel className={styles.Wrapper} label="sign-in">
      <form className={styles.Form} onKeyDown={onFormKeyDown}>
        <div className={styles.InputArea}>
          <div className={styles.InputBlock}>
            <TextInput
              value={email}
              setValue={setEmail}
              validationResult={emailValidationResult}
              setValidationResult={setEmailValidationResult}
              icon={EmailIcon}
              onFocus={clearEmailError}
              placeholder="email"
              autoComplete="treasure-hunter-email"
              minLength={5}
              maxLength={250}
              customValidation={(value) => ({
                isValid: value !== "" && !hasEmailError,
                isValidated: true,
                message: "invalid-email",
              })}
            />
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={password}
              setValue={setPassword}
              validationResult={passwordValidationResult}
              setValidationResult={setPasswordValidationResult}
              icon={PasswordIcon}
              onFocus={clearPasswordError}
              type="password"
              placeholder="password"
              autoComplete="treasure-hunter-password"
              minLength={6}
              maxLength={100}
            />
          </div>
        </div>
        <div className={styles.ActionArea}>
          <Button
            messageId="sign-in"
            onClick={onSignInRequest}
            style={ButtonStyle.Secondary}
            isLoading={isSignInInProgress}
            autoWidth={false}
            isEnabled={
              emailValidationResult.isValid && passwordValidationResult.isValid
            }
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
