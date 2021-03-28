import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  clearSignInError,
  signInRequest,
  guestSignInRequest,
} from "../../../store/actions/auth";
import Button, { ButtonStyle } from "../../ui/button/button";
import {
  GetIsSignInInProgress,
  GetSignInError,
} from "../../../store/selectors/auth-selector";

import TextInput from "../../ui/text-input/text-input";
import Panel from "../../ui/panel/panel";

import EmailIcon from "../../../asset/img/input_field_icon_email.png";
import PasswordIcon from "../../../asset/img/input_field_icon_pw.png";

import styles from "../auth.module.scss";
import { FormattedMessage } from "react-intl";

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { trigger, getValues, clearErrors, errors } = useForm();
  const signInError = useSelector(GetSignInError);
  const isSignInInProgress = useSelector(GetIsSignInInProgress);
  const hasEmailError = [
    "auth/user-not-found",
    "auth/too-many-requests",
  ].includes(signInError?.code);
  const clearEmailError = () => {
    clearErrors(["email"]);
    if (hasEmailError) dispatch(clearSignInError());
  };

  const hasPasswordError = signInError?.code === "auth/wrong-password";
  const clearPasswordError = () => {
    clearErrors(["password"]);
    if (hasPasswordError) dispatch(clearSignInError());
  };

  const onSignInRequest = () => {
    trigger().then((isSuccess) => {
      if (isSuccess) dispatch(signInRequest(getValues()));
    });
  };

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
              icon={EmailIcon}
              onFocus={clearEmailError}
              placeholder="email"
              autoComplete="treasure-hunter-email"
              maxLength={250}
            />
            {(errors.email || hasEmailError) && (
              <span className={styles.InputError}>
                {signInError?.message || "This field is required"}
              </span>
            )}
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={password}
              setValue={setPassword}
              icon={PasswordIcon}
              onFocus={clearPasswordError}
              type="password"
              placeholder="password"
              autoComplete="treasure-hunter-password"
              maxLength={100}
            />
            {(errors.password || hasPasswordError) && (
              <span className={styles.InputError}>
                {signInError?.message || "This field is required"}
              </span>
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
