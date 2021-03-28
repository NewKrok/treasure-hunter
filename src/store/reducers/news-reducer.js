import { setNews } from "../actions/news-action";

const initialState = {
  news: [],
};

const setNewsHandler = ({ state, payload: news }) => ({
  ...state,
  news,
});

const configMap = {
  [setNews().type]: setNewsHandler,
};

const newsReducer = (state = initialState, action) => {
  const config = configMap?.[action.type];
  if (config) return config({ state, payload: action.payload });

  return state;
};

export default newsReducer;
