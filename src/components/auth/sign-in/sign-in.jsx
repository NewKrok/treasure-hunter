import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

import { clearSignInError, signInRequest } from "../../../store/actions/auth";
import Button, { ButtonStyle } from "../../form/button/button";
import {
  GetIsSignInInProgress,
  GetSignInError,
} from "../../../store/selectors/auth";

import formStyle from "../../../common/style/form.module.scss";
import authStyles from "../auth.module.scss";

const SignIn = () => {
  const dispatch = useDispatch();
  const { register, trigger, getValues, clearErrors, errors } = useForm();
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

  const onFormKeyDown = (e) => {
    if (e.keyCode === 13) onSignInRequest();
  };

  return (
    <div className={authStyles.Wrapper}>
      <form className={authStyles.Form} onKeyDown={onFormKeyDown}>
        <h1>
          <FormattedMessage id={"sign-in-title"} />
        </h1>
        <div className={authStyles.InputBlock}>
          <input
            className={formStyle.Input}
            name="email"
            placeholder="Your e-mail address"
            type="email"
            ref={register({ required: true, maxLength: 250 })}
            onFocus={clearEmailError}
          />
          {(errors.email || hasEmailError) && (
            <span className={formStyle.InputError}>
              {signInError?.message || "This field is required"}
            </span>
          )}
          <i className={`fas fa-at ${authStyles.InputIcon}`}></i>
        </div>
        <div className={authStyles.InputBlock}>
          <input
            className={formStyle.Input}
            name="password"
            autoComplete="webapp-password"
            placeholder="Your password"
            type="password"
            ref={register({ required: true, maxLength: 100 })}
            onFocus={clearPasswordError}
          />
          {(errors.password || hasPasswordError) && (
            <span className={formStyle.InputError}>
              {signInError?.message || "This field is required"}
            </span>
          )}
          <i className={`fas fa-key ${authStyles.InputIcon}`}></i>
        </div>
        <div className={authStyles.ActionArea}>
          <Button
            messageId="sign-in"
            icon="fa-sign-in-alt"
            onClick={onSignInRequest}
            style={ButtonStyle.Primary}
            isLoading={isSignInInProgress}
            autoWidth={false}
          />
          <span>or</span>
          <Button
            messageId="sign-up"
            icon="fa-user-plus"
            style={ButtonStyle.Secondary}
            navigationTarget="/sign-up"
            autoWidth={false}
          />
        </div>
      </form>
    </div>
  );
};

export default SignIn;
