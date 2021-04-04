export const createAction = ({ type }) => (payload) => ({
  type,
  payload,
});

export const pauseGame = createAction({
  type: "PAUSE_GAME",
});
