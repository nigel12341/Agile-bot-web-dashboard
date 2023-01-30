<template>
  <button @click="signIn"></button>
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export default {
  name: "loginComponent",
  data() {
    return {
      loggedIn: false,
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid)
        console.log(user)
        this.loggedIn = true;
      } else {
        console.log('not logged in')
        this.loggedIn = false;
      }
    });
  },
  methods: {
    async signIn() {
      const auth = getAuth();
      const ui = new firebaseui.auth.AuthUI(auth);
      ui.start('#firebaseui-auth-container', {
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
          }
        ],
        signInSuccessUrl: 'http://localhost:8080',
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            console.log(authResult)
            console.log(redirectUrl)
            return true;
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>