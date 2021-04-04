import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import IndexSaga from "./saga/index";
import authReducer from "./store/reducers/auth";
import appReducer from "./store/reducers/app-reducer";
import sessionReducer from "./store/reducers/session-reducer";
import dialogReducer from "./store/reducers/dialog-reducer";
import singlePlayerReducer from "./store/reducers/single-player-reducer";
import newsReducer from "./store/reducers/news-reducer";
import gameReducer from "./store/reducers/game-reducer";
import App from "./App";

import "./config.css";
import "./index.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // TODO add here actions when they ara flooding react debugger
    })
  : compose;

Sentry.init({
  dsn:
    "https://4b195210f033446b8c1523532f86e333@o471316.ingest.sentry.io/5685805",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  authReducer,
  appReducer,
  sessionReducer,
  dialogReducer,
  singlePlayerReducer,
  newsReducer,
  gameReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk), applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(IndexSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
