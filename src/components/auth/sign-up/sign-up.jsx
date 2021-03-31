import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button, { ButtonStyle } from "../../ui/button/button";
import {
  clearSignUpError,
  signUpRequest,
} from "../../../store/actions/auth-action";
import {
  GetIsSignUpInProgress,
  GetSignUpError,
} from "../../../store/selectors/auth-selector";
import Panel from "../../ui/panel/panel";

import UserIcon from "../../../asset/img/input-field-icon-user.png";
import EmailIcon from "../../../asset/img/input-field-icon-email.png";
import PasswordIcon from "../../../asset/img/input-field-icon-pw.png";
import TextInput from "../../ui/text-input/text-input";

import styles from "../auth.module.scss";
import { FormattedMessage } from "react-intl";
import { InputErrorType } from "../../ui/input-error/input-error";

const SignUp = () => {
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState("");
  const [
    displayNameValidationResult,
    setDisplayNameValidationResult,
  ] = useState({ isValid: false });
  const [emailValidationResult, setEmailValidationResult] = useState({
    isValid: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidationResult, setPasswordValidationResult] = useState({
    isValid: false,
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [
    passwordConfirmationValidationResult,
    setPasswordConfirmationValidationResult,
  ] = useState({ isValid: false });
  const signUpError = useSelector(GetSignUpError);
  const isSignUpInProgress = useSelector(GetIsSignUpInProgress);

  const hasEmailError = [
    "auth/email-already-in-use",
    "auth/invalid-email",
    "auth/too-many-requests",
  ].includes(signUpError?.code);

  const clearEmailError = () => {
    if (hasEmailError) dispatch(clearSignUpError());
  };

  const hasPasswordError = signUpError?.code === "auth/weak-password";
  const clearPasswordError = () => {
    if (hasPasswordError) dispatch(clearSignUpError());
  };

  const onSignUpRequest = () =>
    dispatch(signUpRequest({ email, password, displayName }));

  const onFormKeyDown = (e) => {
    if (e.keyCode === 13) onSignUpRequest();
  };

  useEffect(() => {
    if (hasEmailError && emailValidationResult.isValidated)
      setEmailValidationResult({
        isValidated: true,
        isValid: false,
        type: InputErrorType.CUSTOM,
        message: signUpError?.code.replace("auth/", ""),
      });
  }, [signUpError]);

  return (
    <Panel className={styles.Wrapper} label="sign-up">
      <form className={styles.Form} onKeyDown={onFormKeyDown}>
        <div className={styles.InputArea}>
          <div className={styles.InputBlock}>
            <TextInput
              value={displayName}
              setValue={setDisplayName}
              validationResult={displayNameValidationResult}
              setValidationResult={setDisplayNameValidationResult}
              icon={UserIcon}
              placeholder="your-nickname"
              autoComplete="treasure-hunter-nickname"
              minLength={3}
              maxLength={20}
            />
          </div>
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
              minLength={6}
              maxLength={100}
            />
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={passwordConfirmation}
              setValue={setPasswordConfirmation}
              validationResult={passwordConfirmationValidationResult}
              setValidationResult={setPasswordConfirmationValidationResult}
              icon={PasswordIcon}
              type="password"
              placeholder="password-confirmation"
              minLength={6}
              maxLength={100}
              customValidation={(value) => ({
                isValid: value === password,
                isValidated: true,
                message: "password-confirmation-problem",
              })}
            />
          </div>
          <div className={styles.ActionArea}>
            <Button
              messageId="sign-up"
              icon="fa-user-plus"
              onClick={onSignUpRequest}
              style={ButtonStyle.Primary}
              isLoading={isSignUpInProgress}
              autoWidth={false}
              isEnabled={
                displayNameValidationResult.isValid &&
                emailValidationResult.isValid &&
                passwordValidationResult.isValid &&
                passwordConfirmationValidationResult.isValid
              }
            />
            <span>
              <FormattedMessage id="or" />
            </span>
            <Button
              messageId="sign-in"
              icon="fa-sign-in-alt"
              style={ButtonStyle.Secondary}
              navigationTarget="/home/single-player/sign-in"
              autoWidth={false}
            />
            <span>
              <FormattedMessage id="or" />
            </span>
            <Button
              messageId="play-as-guest"
              style={ButtonStyle.Tertiary}
              autoWidth={false}
            />
          </div>
        </div>
      </form>
    </Panel>
  );
};

export default SignUp;
