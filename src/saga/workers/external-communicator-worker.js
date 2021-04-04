import { eventChannel } from "@redux-saga/core";
import { put, take } from "redux-saga/effects";

import {
  hideTooltip,
  showTooltip,
} from "../../store/actions/external-communicator-action";
import { pauseGame } from "../../store/actions/ingame-action";

export const sendExternalCall = ({ action, params }) =>
  window?.TreasureHunter?.game?.action({ action, params });

export function* initExternalCommunicator() {
  const externalCommunicatorChannel = eventChannel((emit) => {
    window.TreasureHunter = {
      ...window.TreasureHunter,
      ui: {
        action: ({ action, params }) => {
          switch (action) {
            case "showTooltip":
              emit(showTooltip({ id: params.id }));
              break;

            case "hideTooltip":
              emit(hideTooltip({ id: params.id }));
              break;

            case "pauseGame":
              emit(pauseGame());
              break;

            default:
          }
        },
      },
    };

    return () => {};
  });
  while (true) {
    const action = yield take(externalCommunicatorChannel);
    yield put(action);
  }
}
