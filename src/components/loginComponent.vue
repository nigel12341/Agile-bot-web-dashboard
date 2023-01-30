<template>
  <div v-if="!loggedIn" id="loginUsernamePass">
    <button @click="signIn" class="btn-primary"></button>
    <div id="firebaseui-auth-container"/>
  </div>
  <div id="loginDiscord">
    <a href="https://discord.com/api/oauth2/authorize?client_id=1066056964083298415&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=code&scope=identify%20guilds">Link your account to discord!</a>
  </div>


</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import {getFirestore, getDoc, doc, setDoc} from "firebase/firestore";
import vueCookies from 'vue-cookies'

export default {
  name: "loginComponent",
  data() {
    return {
      loggedIn: false,
      discordLinked: false,
      code: null,
    };
  },
  props: {
    app: {
      type: Object,
      required: true
    }
  },
  created() {
    const auth = getAuth();
    this.db = getFirestore(this.app);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        this.uid = user.uid;
        const UsersRef = doc(this.db, "Users", this.uid);
        const docSnap = await getDoc(UsersRef);

        if (docSnap.exists() && docSnap.data().discordId !== "" && docSnap.data().refreshToken !== ""){
          this.discordLinked = true;
          vueCookies.set('discordId', docSnap.data().discordUserID);
          this.$router.push({name: 'serverOverview'});
        } else if (!docSnap.exists()) {
          await this.fetchAccessToken();
        }

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
        signInSuccessUrl: 'http://localhost:8080/login',
      });
    },
    async fetchAccessToken() {
      this.code = this.getParameterByName('code')
      await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          'client_id': process.env.VUE_APP_CLIENT_ID,
          'client_secret': process.env.VUE_APP_CLIENT_SECRET,
          'grant_type': 'authorization_code',
          'code': this.code,
          'redirect_uri': 'http://localhost:8080/',
        })
      }).then(result => result.json())
          .then(async response => {
            this.access_token = response.access_token;
            const refresh_token = response.refresh_token;

            fetch('https://discord.com/api/users/@me', {
              headers: {
                authorization: `Bearer ${this.access_token}`,
              },
            }).then(result => result.json())
                .then(async response => {
                  const {id} = response;
                  const UsersRef = doc(this.db, "Users", this.uid);

                  await setDoc(UsersRef, {
                    discordUserID: id,
                    refreshToken: refresh_token,
                    accessToken: this.access_token,
                  })
                  vueCookies.set('discordId', id);
                  this.$router.push({name: 'serverOverview'});
                });
          });

    },
    getParameterByName(name, url = window.location.href) {
      name = name.replace(/[[\]]/g, '\\$&');
      let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
  }
}
</script>

<style scoped>

</style>