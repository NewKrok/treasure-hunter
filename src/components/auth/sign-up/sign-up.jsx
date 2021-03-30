import React, { useState } from "react";
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
import TextInput, { InputError } from "../../ui/text-input/text-input";

import styles from "../auth.module.scss";
import { FormattedMessage } from "react-intl";

const SignUp = () => {
  const dispatch = useDispatch();
  const [displayNameError, setDisplayNameError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(
    ""
  );
  const signUpError = useSelector(GetSignUpError);
  const isSignUpInProgress = useSelector(GetIsSignUpInProgress);

  const hasEmailError = [
    "auth/email-already-in-use",
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

  return (
    <Panel className={styles.Wrapper} label="sign-up">
      <form className={styles.Form}>
        <div className={styles.InputArea}>
          <div className={styles.InputBlock}>
            <TextInput
              value={displayName}
              setValue={setDisplayName}
              error={displayNameError}
              setError={setDisplayNameError}
              icon={UserIcon}
              placeholder="your-nickname"
              autoComplete="treasure-hunter-nickname"
              minLength={3}
              maxLength={20}
            />
            {displayNameError?.isValidated && (
              <div className={styles.InputError}>
                {displayNameError.type === InputError.MIN_LENGTH
                  ? "Too short, it has to be at least 3 characters"
                  : "This field is required"}
              </div>
            )}
          </div>
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
                {signUpError?.message ||
                emailError.type === InputError.MIN_LENGTH
                  ? "Too short, it has to be at least 3 characters"
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
              minLength={6}
              maxLength={100}
            />
            {(passwordError?.isValidated || hasPasswordError) && (
              <div className={styles.InputError}>
                {signUpError?.message ||
                passwordError.type === InputError.MIN_LENGTH
                  ? "Too short, it has to be at least 6 characters"
                  : "This field is required"}
              </div>
            )}
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={passwordConfirmation}
              setValue={setPasswordConfirmation}
              error={passwordConfirmationError}
              setError={setPasswordConfirmationError}
              icon={PasswordIcon}
              type="password"
              placeholder="password-confirmation"
              minLength={6}
              maxLength={100}
            />
            {(passwordConfirmationError?.isValidated || hasPasswordError) && (
              <div className={styles.InputError}>
                {signUpError?.message ||
                passwordConfirmationError.type === InputError.MIN_LENGTH
                  ? "Too short, it has to be at least 6 characters"
                  : passwordConfirmationError.type === "validate"
                  ? "Password confirmation doesn't match Password"
                  : "This field is required"}
              </div>
            )}
          </div>
          <div className={styles.ActionArea}>
            <Button
              label="Sign up"
              icon="fa-user-plus"
              onClick={onSignUpRequest}
              style={ButtonStyle.Primary}
              isLoading={isSignUpInProgress}
              autoWidth={false}
              isEnabled={
                !displayNameError &&
                !emailError &&
                !passwordError &&
                !passwordConfirmationError
              }
            />
            <span>
              <FormattedMessage id="or" />
            </span>
            <Button
              label="Sign in"
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
