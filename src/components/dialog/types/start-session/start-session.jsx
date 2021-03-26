import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { startSession } from "../../../../store/actions/session-action";
import { GetSelectedDialogId } from "../../../../store/selectors/dialog";
import Button, { ButtonStyle } from "../../../ui/button/button";
import { DIALOG_ID } from "../../dialog";
import SimpleDialog from "../simple-dialog/simple-dialog";

import styles from "../simple-dialog/simple-dialog.module.scss";

const StartSession = ({ close }) => {
  const dispatch = useDispatch();
  const user = null; //usesleector
  const dialogId = useSelector(GetSelectedDialogId);
  const isItTheActiveDialog = dialogId === DIALOG_ID.START_SESSION;
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedMicrophone, setSelectedMicrophone] = useState(null);

  const _startSession = () =>
    dispatch(
      startSession({
        camera: selectedCamera?.data?.deviceId !== undefined,
        microphone: selectedMicrophone?.component !== undefined,
      })
    );

  useEffect(() => {
    if (!isItTheActiveDialog) {
      setSelectedCamera(null);
      setSelectedMicrophone(null);
    }
  }, [isItTheActiveDialog]);

  const title = (
    <>
      <i className="fas fa-graduation-cap"></i> Start session with{" "}
      <span className={styles.Name}>{user.displayName}</span>
    </>
  );

  const content = <div>content...</div>;

  const actions = (
    <>
      <Button
        label={
          selectedMicrophone === undefined
            ? "Choose a Microphone"
            : "Start Session"
        }
        icon={
          selectedMicrophone === undefined
            ? "fa-exclamation-triangle"
            : "fa-play"
        }
        style={ButtonStyle.Primary}
        autoWidth={false}
        onClick={_startSession}
        isEnabled={selectedMicrophone !== undefined}
      />
      <Button
        messageId="cancel"
        icon="fa-ban"
        style={ButtonStyle.Secondary}
        autoWidth={false}
        onClick={close}
      />
    </>
  );

  return <SimpleDialog title={title} content={content} actions={actions} />;
};

export default StartSession;
