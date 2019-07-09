import createStore from 'unistore';
import devtools from 'unistore/devtools';
import * as fb from './fb';

/* eslint-disable require-jsdoc */

const initialState = {
  isSignedIn: false,
  user: null,
};

const store = devtools(createStore(initialState));
const signIn = store.action(async (state) => {
  const user = await fb.auth();
  if (!user) {
    return;
  }

  return {
    isSignedIn: true,
    user,
  };
});

export {store, signIn};
