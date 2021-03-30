import React from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button, { ButtonStyle } from "../../../../ui/button/button";
import { openDialog } from "../../../../../store/actions/dialog-action";
import { DialogId } from "../../../../dialog/dialog";

import commonStyles from "../../../settings.module.scss";
import styles from "./avatar-settings-entry.module.scss";

const AvatarSettingsEntry = () => {
  const dispatch = useDispatch();
  const user = {};

  const openRandomAvatarGeneratorRequest = () =>
    dispatch(openDialog(DialogId.RANDOM_AVATAR_GENERATOR));

  const openAvatarUploaderRequest = () =>
    dispatch(openDialog(DialogId.AVATAR_UPLOADER));

  const openAvatarCreatorRequest = () =>
    dispatch(openDialog(DialogId.AVATAR_CREATOR));

  return (
    <div className={commonStyles.Entry}>
      <h2>
        <FormattedMessage id={"your-avatar"} />
      </h2>
      <div className={commonStyles.Info}>
        <i className="fas fa-info-circle"></i>{" "}
        <FormattedMessage id={"avatar-change-info"} />
      </div>
      <img className={styles.Avatar} src={user.photoURL} alt="avatar" />
      <div className={styles.Menu}>
        <Button
          messageId="generate-random-avatar"
          icon="fa-dice"
          style={ButtonStyle.Primary}
          onClick={openRandomAvatarGeneratorRequest}
        />
        <Button
          messageId="upload-custom-avatar"
          icon="fa-image"
          style={ButtonStyle.Primary}
          onClick={openAvatarUploaderRequest}
        />
        <Button
          messageId="take-avatar-picture"
          icon="fa-camera"
          style={ButtonStyle.Primary}
          onClick={openAvatarCreatorRequest}
        />
      </div>
    </div>
  );
};

export default AvatarSettingsEntry;
