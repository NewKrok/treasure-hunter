import { eventChannel } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import firebase from "firebase/app";

import { connectionEstablished } from "../../../store/actions/session-action";
import { saveIncomingStream } from "../../../store/actions/stream-action";
import { GetUser } from "../../../store/selectors/auth";
import { GetStunServerOfSession } from "../../../store/selectors/session";
import { error, info } from "../../../utils/logger";
import { createThreadId } from "../../../utils/thread";
import { STREAM_DATA } from "../../../common/database/database";
import { handleIncomingMessage } from "./business-logic-worker";

let peerConnection = null;
export let dataChannel = null;

export function* initPeer() {
  const stunServer = yield select(GetStunServerOfSession);
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: stunServer }],
  });
}

export function* initConnection() {
  const peerConnectionChannel = eventChannel((emit) => {
    let incomingDataChannel = null;
    peerConnection.onaddstream = (e) => emit({ eventType: "onaddstream", e });
    peerConnection.ondatachannel = (e) => {
      incomingDataChannel = e.channel;
      incomingDataChannel.onmessage = (e) =>
        emit({ eventType: "onmessage", e });
      emit({ eventType: "ondatachannel", e });
    };
    peerConnection.oniceconnectionstatechange = (e) =>
      emit({ eventType: "oniceconnectionstatechange", e });
    peerConnection.onmessage = (e) => emit({ eventType: "onmessage", e });

    return () => {
      peerConnection.onaddstream = null;
      peerConnection.ondatachannel = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.onmessage = null;
      if (incomingDataChannel) {
        incomingDataChannel.onmessage = null;
        incomingDataChannel = null;
      }
    };
  });

  yield takeEvery(peerConnectionChannel, peerConnectionChannelHandler);
}

function* peerConnectionChannelHandler({ eventType, e }) {
  switch (eventType) {
    case "onaddstream":
      yield put(saveIncomingStream(e.stream));
      break;

    case "oniceconnectionstatechange":
      info(
        `Peer connection state has been changed to: ${peerConnection.iceConnectionState}`
      );
      break;

    case "ondatachannel":
      info(`${eventType} event was fired with data ${JSON.stringify(e)}`);
      break;

    case "onmessage":
      yield call(handleIncomingMessage, e.data);
      break;

    default:
      info(
        `Unhandled peer connection event ${eventType} with data ${JSON.stringify(
          e
        )}`
      );
      break;
  }
}

export function* onChildAddedChannelHandler(snap) {
  const sdp = snap.val();

  // if initializer...
  var desc = new RTCSessionDescription({ type: "answer", sdp });
  peerConnection.setRemoteDescription(desc).catch(error);
  yield;
  // else
  /*
    yield put(startSession());
    yield call(
      startStreamHandler,
      {
        audio: false,
        video: false,
      },
      sdp
    );
  }*/
}

export function* startStreamHandler(constraints, sdp) {
  try {
    dataChannel = peerConnection.createDataChannel("ps");
    const onDataChannelOpened = eventChannel((emit) => {
      dataChannel.onopen = (e) => emit("onOpen");
      return () => (dataChannel.onopen = null);
    });
    yield takeEvery(onDataChannelOpened, onDataChannelOpenHandler);

    // if initializer...
    yield peerConnection
      .createOffer()
      .then((d) => peerConnection.setLocalDescription(d));
    /*} else {
      var desc = new RTCSessionDescription({ type: "offer", sdp });
      peerConnection
        .setRemoteDescription(desc)
        .then(() => peerConnection.createAnswer())
        .then((d) => peerConnection.setLocalDescription(d))
        .catch(error);
    }*/
    const onIceCandidateChannel = eventChannel((emit) => {
      peerConnection.onicecandidate = (e) => {
        if (e.candidate) return;
        emit(peerConnection.localDescription.sdp);
      };
      return () => (peerConnection.onicecandidate = null);
    });

    yield takeEvery(onIceCandidateChannel, onIceCandidateChannelHandler);
  } catch (e) {
    console.warn(`getUserMediaHandler error: ${e}`);
  }
}

function* onDataChannelOpenHandler() {
  info(`On data channel opened`);
  yield put(connectionEstablished());
}

function* onIceCandidateChannelHandler(sdp) {
  const ownUser = yield select(GetUser);
  let selectedUser = null; // TODO FILL IT

  const threadId = createThreadId({
    userAId: ownUser.uid,
    userBId: selectedUser.uid,
  });

  const primaryStreamRef = firebase
    .database()
    .ref(`${STREAM_DATA}/${threadId}/${ownUser.uid}`);
  primaryStreamRef.onDisconnect().remove((err) => {
    if (err !== null) error(err);
  });
  yield primaryStreamRef.set({ sdp });

  // if initializer...
  const secondaryStreamRef = firebase
    .database()
    .ref(`${STREAM_DATA}/${threadId}/${selectedUser.uid}`);
  const onChildAddedChannel = eventChannel((emit) => {
    secondaryStreamRef.on("child_added", emit);
    return () => {
      secondaryStreamRef.on = null;
    };
  });
  yield takeEvery(onChildAddedChannel, onChildAddedChannelHandler);
}

export function* closeConnection() {
  peerConnection.close();
  peerConnection = null;
  yield;
}
