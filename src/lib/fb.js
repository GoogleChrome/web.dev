import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {store} from "./store";

/* eslint-disable require-jsdoc */

const firebaseConfig = {
  apiKey: "AIzaSyBjcWKserQhn4mygIluGr9eTMfR_S0PDEU",
  authDomain: "v2-prototype.firebaseapp.com",
  databaseURL: "https://v2-prototype.firebaseio.com",
  projectId: "v2-prototype",
  storageBucket: "",
  messagingSenderId: "960947587576",
  appId: "1:960947587576:web:b8e4ff1671c6c131",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let firestoreUserUnsubscribe = null;

// Listen for the user's signed in state and update the store.
firebase.auth().onAuthStateChanged((user) => {
  store.setState({checkingSignedInState: false});
  if (firestoreUserUnsubscribe) {
    firestoreUserUnsubscribe();
    firestoreUserUnsubscribe = null;
  }

  if (user) {
    store.setState({
      isSignedIn: true,
      user,
    });
    const firestore = firebase.firestore();
    const ref = firestore.collection("users").doc(user.uid);
    firestoreUserUnsubscribe = ref.onSnapshot((snapshot) => {
      const data = snapshot.data();
      store.setState({
        userUrl: data.url,
      });
    });
  } else {
    store.setState({
      isSignedIn: false,
      user: null,
    });
  }
});

// Sign in the user
export async function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();

  let user;
  try {
    const res = await firebase.auth().signInWithPopup(provider);
    user = res.user;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('error', err);
  }

  return user;
}

// Sign out the user
export async function signOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('error', err);
  }
}
