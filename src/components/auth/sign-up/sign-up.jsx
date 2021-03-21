import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Button, { ButtonStyle } from "../../form/button/button";
import { clearSignUpError, signUpRequest } from "../../../store/actions/auth";
import {
  GetIsSignUpInProgress,
  GetSignUpError,
} from "../../../store/selectors/auth";

import authStyles from "../auth.module.scss";
import formStyle from "../../../common/style/form.module.scss";

const SignUp = () => {
  const dispatch = useDispatch();
  const {
    register,
    trigger,
    getValues,
    watch,
    clearErrors,
    errors,
  } = useForm();
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
    <div className={authStyles.Wrapper}>
      <form className={authStyles.Form}>
        <h1>Create a new user</h1>
        <div className={authStyles.InputBlock}>
          <input
            className={formStyle.Input}
            name="displayName"
            placeholder="Your nickname"
            type="text"
            ref={register({ required: true, minLength: 3, maxLength: 20 })}
            onFocus={() => clearErrors(["displayName"])}
          />
          {errors.displayName && (
            <span className={formStyle.InputError}>
              {errors.displayName.type === "minLength"
                ? "Too short, it has to be at least 3 charcaters"
                : "This field is required"}
            </span>
          )}
          <i className={`fas fa-user ${authStyles.InputIcon}`}></i>
        </div>
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
              {signUpError?.message || "This field is required"}
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
              {signUpError?.message || "This field is required"}
            </span>
          )}
          <i className={`fas fa-key ${authStyles.InputIcon}`}></i>
        </div>
        <div className={authStyles.InputBlock}>
          <input
            className={formStyle.Input}
            name="password-confirmation"
            placeholder="Password confirmation"
            type="password"
            ref={register({
              required: true,
              maxLength: 100,
              validate: (value) => {
                return value === watch("password");
              },
            })}
            onFocus={() => clearErrors(["password-confirmation"])}
          />
          {(errors["password-confirmation"] || hasPasswordError) && (
            <span className={formStyle.InputError}>
              {signUpError?.message ||
                (errors["password-confirmation"].type === "validate"
                  ? "Password confirmation doesn't match Password"
                  : "This field is required")}
            </span>
          )}
          <i className={`fas fa-key ${authStyles.InputIcon}`}></i>
        </div>
        <div className={authStyles.ActionArea}>
          <Button
            label="Sign up"
            icon="fa-user-plus"
            onClick={onSignUpRequest}
            style={ButtonStyle.Primary}
            isLoading={isSignUpInProgress}
            autoWidth={false}
          />
          <span>or</span>
          <Button
            label="Sign in"
            icon="fa-sign-in-alt"
            style={ButtonStyle.Secondary}
            navigationTarget="/sign-in"
            autoWidth={false}
          />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
