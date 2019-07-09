import firebase from 'firebase/app';
import 'firebase/auth';

/* eslint-disable require-jsdoc */

const firebaseConfig = {
  apiKey: 'AIzaSyBjcWKserQhn4mygIluGr9eTMfR_S0PDEU',
  authDomain: 'v2-prototype.firebaseapp.com',
  databaseURL: 'https://v2-prototype.firebaseio.com',
  projectId: 'v2-prototype',
  storageBucket: '',
  messagingSenderId: '960947587576',
  appId: '1:960947587576:web:b8e4ff1671c6c131',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

async function auth() {
  const provider = new firebase.auth.GoogleAuthProvider();

  let user;
  try {
    const res = await firebase.auth().signInWithPopup(provider);
    user = res.user;
  } catch (err) {
    /* eslint-disable-next-line */
    console.log('error', err);
  }

  return user;
}

export {auth};
