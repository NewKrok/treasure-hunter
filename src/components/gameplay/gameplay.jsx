import React, { useEffect } from "react";

import GameUI from "./ui/game-ui";
import World from "./world/world";

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
    <div>
      <World />
      <GameUI />
    </div>
  );
};

export default Gameplay;
