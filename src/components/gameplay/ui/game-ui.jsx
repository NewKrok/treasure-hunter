import React from "react";
import { useDispatch } from "react-redux";

import StaminaBar from "./stamina-bar/stamina-bar";
import Tooltips from "./tooltips/tooltips";
import { pauseGame } from "../../../store/actions/ingame-action";

import styles from "./game-ui.module.scss";

const GameUI = () => {
  const dispatch = useDispatch();

  const pauseGameRequest = () => dispatch(pauseGame());

  return (
    <div className={styles.Wrapper}>
      <Tooltips />
      <StaminaBar />
    </div>
  );
};

export default GameUI;
