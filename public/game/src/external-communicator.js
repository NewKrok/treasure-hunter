const externalCallHandlers = {};

const receiveExternalCall = ({ action, params }) => {
  console.log("RECEIVED", action, params);
};

export const connectExternalCall = () =>
  (window.TreasureHunter = {
    ...window.TreasureHunter,
    game: { action: receiveExternalCall },
  });

export const sendExternalCall = ({ action, params }) =>
  window?.TreasureHunter?.ui?.action({ action, params });

export const onExternalCall = ({ action, handler }) =>
  (externalCallHandlers[action] = handler);
