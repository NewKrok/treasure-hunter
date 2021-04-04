import React, { useEffect } from "react";

import GameUI from "./ui/game-ui";
import World from "./world/world";

import styles from "./gameplay.module.scss";

const Gameplay = () => {
  useEffect(() => {
    setTimeout(
      () =>
        window.createWorld({
          serverCall: () => console.log,
          userName: "Krisz",
          players: [],
          onReady: () => {},
        }),
      1000
    );
  }, []);

  return (
    <div className={styles.Wrapper}>
      <World />
      <GameUI />
    </div>
  );
};

export default Gameplay;
