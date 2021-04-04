export const createAction = ({ type }) => (payload) => ({
  type,
  payload,
});

export const showTooltip = createAction({
  type: "SHOW_TOOLTIP",
});
export const hideTooltip = createAction({
  type: "HIDE_TOOLTIP",
});
