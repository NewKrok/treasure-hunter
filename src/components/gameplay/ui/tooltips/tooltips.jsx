import React from "react";
import { useSelector } from "react-redux";

import Tooltip from "./tooltip";
import { GetTooltips } from "../../../../store/selectors/game-selector";

const Tooltips = () => {
  const tooltips = useSelector(GetTooltips);

  return (
    <>
      {tooltips.map(({ id, isOpen }) => (
        <Tooltip key={id} id={id} isOpen={isOpen} />
      ))}
    </>
  );
};

export default Tooltips;
