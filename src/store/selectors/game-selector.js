const GetTooltips = (state) =>
  Object.keys(state.gameReducer.tooltips)
    .filter(
      (key) =>
        state.gameReducer.tooltips[key].isOpen ||
        Date.now() - state.gameReducer.tooltips[key].closeTime < 200
    )
    .map((key) => ({ id: key, ...state.gameReducer.tooltips[key] }));

export { GetTooltips };
