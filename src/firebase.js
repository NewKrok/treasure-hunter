import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";
import "@firebase/firestore";
import ReduxSagaFirebase from "redux-saga-firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAKrNapghyUBnMF80f6a0zakr7qM2DHf2g",
  authDomain: "treasure-hunter-e9334.firebaseapp.com",
  databaseURL:
    "https://treasure-hunter-e9334-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "treasure-hunter-e9334",
  storageBucket: "treasure-hunter-e9334.appspot.com",
  messagingSenderId: "323599957778",
  appId: "1:323599957778:web:c010669a33cf1650a27dcb",
  measurementId: "G-4HTD2GZT0C",
};

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export const rsf = new ReduxSagaFirebase(firebase);
