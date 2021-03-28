import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Button, { ButtonStyle } from "../../ui/button/button";
import { clearSignUpError, signUpRequest } from "../../../store/actions/auth";
import {
  GetIsSignUpInProgress,
  GetSignUpError,
} from "../../../store/selectors/auth-selector";
import Panel from "../../ui/panel/panel";

import UserIcon from "../../../asset/img/input_field_icon_user.png";
import EmailIcon from "../../../asset/img/input_field_icon_email.png";
import PasswordIcon from "../../../asset/img/input_field_icon_pw.png";
import TextInput from "../../ui/text-input/text-input";

import styles from "../auth.module.scss";
import { FormattedMessage } from "react-intl";

const SignUp = () => {
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { trigger, getValues, clearErrors, errors } = useForm();
  const signUpError = useSelector(GetSignUpError);
  const isSignUpInProgress = useSelector(GetIsSignUpInProgress);

  const hasEmailError = [
    "auth/email-already-in-use",
    "auth/too-many-requests",
  ].includes(signUpError?.code);
  const clearEmailError = () => {
    clearErrors(["email"]);
    if (hasEmailError) dispatch(clearSignUpError());
  };

  const hasPasswordError = signUpError?.code === "auth/weak-password";
  const clearPasswordError = () => {
    clearErrors(["password"]);
    if (hasPasswordError) dispatch(clearSignUpError());
  };

  const onSignUpRequest = () => {
    trigger().then((isSuccess) => {
      if (isSuccess) dispatch(signUpRequest(getValues()));
    });
  };

  return (
    <Panel className={styles.Wrapper} label="sign-up">
      <form className={styles.Form}>
        <div className={styles.InputArea}>
          <div className={styles.InputBlock}>
            <TextInput
              value={displayName}
              setValue={setDisplayName}
              icon={UserIcon}
              onFocus={() => clearErrors(["displayName"])}
              placeholder="your-nickname"
              autoComplete="treasure-hunter-nickname"
              minLength={3}
              maxLength={20}
            />
            {errors.displayName && (
              <span className={styles.InputError}>
                {errors.displayName.type === "minLength"
                  ? "Too short, it has to be at least 3 charcaters"
                  : "This field is required"}
              </span>
            )}
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={email}
              setValue={setEmail}
              icon={EmailIcon}
              onFocus={clearEmailError}
              placeholder="email"
              autoComplete="treasure-hunter-email"
              minLength={3}
              maxLength={250}
            />
            {(errors.email || hasEmailError) && (
              <span className={styles.InputError}>
                {signUpError?.message || "This field is required"}
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
              minLength={5}
              maxLength={100}
            />
            {(errors.password || hasPasswordError) && (
              <span className={styles.InputError}>
                {signUpError?.message || "This field is required"}
              </span>
            )}
          </div>
          <div className={styles.InputBlock}>
            <TextInput
              value={password}
              setValue={setPassword}
              icon={PasswordIcon}
              onFocus={() => clearErrors(["password-confirmation"])}
              type="password"
              placeholder="password-confirmation"
              minLength={5}
              maxLength={100}
            />
            {(errors["password-confirmation"] || hasPasswordError) && (
              <span className={styles.InputError}>
                {signUpError?.message ||
                  (errors["password-confirmation"].type === "validate"
                    ? "Password confirmation doesn't match Password"
                    : "This field is required")}
              </span>
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
