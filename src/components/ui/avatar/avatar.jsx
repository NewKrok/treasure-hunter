import React from "react";
import { useDispatch } from "react-redux";

import AvatarImage from "../../../asset/avatars/avatar-1.jpg";
import { openDialog } from "../../../store/actions/dialog-action";
import { DIALOG_ID } from "../../dialog/dialog";

import styles from "./avatar.module.scss";

const Avatar = ({ className }) => {
  const dispatch = useDispatch();
  const openProfileDialog = () =>
    dispatch(openDialog(DIALOG_ID.SESSION_AUTO_CANCEL));
  return (
    <div
      className={`${styles.Wrapper} ${className}`}
      onClick={openProfileDialog}
    >
      <img src={AvatarImage} alt="avatar" />
    </div>
  );
};

export default Avatar;
