import { toScreenPosition } from "./utils/threejs-utils.js";
import { tooltipConfig, TooltipTypes } from "../tooltip-config.js";
import { getCamera } from "../game-engine/camera/camera.js";
import { sendExternalCall } from "./external-communicator.js";

const tooltipStates = {};
let canvas = null;

export const showTooltip = ({ id, target }) => {
  if (!tooltipStates[id] || !tooltipStates[id].isOpen) {
    canvas = canvas || document.getElementById("canvas");

    sendExternalCall({
      action: "showTooltip",
      params: { id },
    });

    tooltipStates[id] = { isOpen: true, target, lastPosition: { x: 0, y: 0 } };

    updateTooltips();
  }
};

export const hideTooltip = (id) => {
  if (tooltipStates[id]?.isOpen) {
    sendExternalCall({
      action: "hideTooltip",
      params: { id },
    });

    tooltipStates[id].isOpen = false;
  }
};

export const updateTooltips = () => {
  TooltipTypes.map((id) => {
    const { isOpen, target, lastPosition } = tooltipStates[id] || {
      isOpen: false,
    };
    if (isOpen) {
      const element = document.querySelector(`#tooltip-${id}`);

      if (element && target) {
        const { x, y } = toScreenPosition({
          object: target,
          camera: getCamera(),
          canvas,
        });
        const { xOffset, yOffset } = tooltipConfig[id];
        const padding = 100;
        const newX = Math.max(
          Math.min(Math.round(x + xOffset), window.innerWidth - padding),
          padding
        );
        const newY = Math.max(
          Math.min(Math.round(y + yOffset), window.innerHeight - padding),
          padding
        );

        if (lastPosition.x != newX || lastPosition.y != newY) {
          element.style.left = `${newX}px`;
          element.style.top = `${newY}px`;

          tooltipStates[id].lastPosition = { x: newX, y: newY };
        }
      }
    }
  });
};
