import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  changeDisplayName,
  changeEmail,
} from "../../../../store/actions/user-action";
import { GetUser } from "../../../../store/selectors/auth";
import SettingsTextEntry from "../common/settings-text-entry";
import AvatarSettingsEntry from "./avatar-settings-entry/avatar-settings-entry";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(GetUser);

  const [displayName, setDisplayName] = useState(user.displayName);
  const changeDisplayNameRequest = (value) => {
    setDisplayName(value);
    if (value.trim() !== "" && value.length >= 3) {
      dispatch(changeDisplayName(value));
    }
  };

  const [email, setEmail] = useState(user.email);
  const changeEmailRequest = (value) => {
    setEmail(value);
    if (value.trim() !== "" && value.length >= 3) {
      dispatch(changeEmail(value));
    }
  };

  return (
    <div>
      <AvatarSettingsEntry />
      <SettingsTextEntry
        title="your-nickname"
        info="nickname-change-info"
        value={displayName}
        setValue={changeDisplayNameRequest}
        maxLength={30}
      />
      <SettingsTextEntry
        title="your-email"
        info="email-change-info"
        value={email}
        setValue={changeEmailRequest}
        maxLength={200}
      />
    </div>
  );
};

export default ProfileSettings;
