<template>
  <div v-if="!loggedIn" class="container">
    <form>
      <div class="row">
        <h2 style="text-align:center">Login with Social Media or Manually</h2>

        <div class="col">
          <button class="fb btn">
            Login with Facebook (Coming soon)
          </button>
          <button class="twitter btn">
            Login with Twitter (Coming soon)
          </button>
          <button class="google btn" @click="signInGoogle">
            Login with Google+
          </button>
        </div>

        <div class="col">
          <div class="hide-md-lg">
            <p>Or sign in manually:</p>
          </div>
          <input @click="signInEmailPass" type="button" id="emailPassButton" value="Sign in with email and password">
        </div>

      </div>
    </form>
  </div>
  <div v-else-if="discordAuthFailed">
    <h1>Link your discord!</h1>
    <p>Click the button below to login with Discord</p>
    <a type="button" class=" btn btn-primary" :href="oath">in to discord</a>
  </div>
  <div id="firebaseui-auth-container"/>
</template>

<script>
import {getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import {getFirestore, getDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import vueCookies from 'vue-cookies'

export default {
  name: "loginComponent",
  data() {
    return {
      loggedIn: false,
      discordLinked: false,
      code: null,
      discordAuthFailed: false,
      oath: null,
      redirectUrl: null,
    };
  },
  props: {
    app: {
      type: Object,
      required: true
    }
  },
  created() {
    this.oath = process.env.VUE_APP_OAUTH_URL;
    this.redirectUrl = process.env.VUE_APP_REDIRECT_URI;
    const auth = getAuth();
    this.db = getFirestore(this.app);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        this.uid = user.uid;
        const UsersRef = doc(this.db, "Users", this.uid);
        const docSnap = await getDoc(UsersRef);
        if (docSnap.exists()) {
          if (docSnap.data().discordUserID === "" || docSnap.data().accessToken === "" || docSnap.data().refreshToken === "" || docSnap.data().discordUserID === undefined || docSnap.data().accessToken === undefined || docSnap.data().refreshToken === undefined) {
            await this.fetchAccessToken();
          }
          if(!this.discordAuthFailed) {
            this.discordLinked = true;
            vueCookies.set('discordId', docSnap.data().discordUserID);
            this.$router.push({name: 'serverOverview'});
          }
        } else if (!docSnap.exists()) {
          await this.fetchAccessToken();
        }

        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  },
  methods: {
    async signInEmailPass() {
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
    signInGoogle() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
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
          'redirect_uri': this.redirectUrl,
        })
      }).then(result => result.json())
          .then(async response => {
            if (response.error === "invalid_grant" || response.error === "unauthorized" || response.error === "400") {
              await this.refreshToken();
            } else {
              this.access_token = response.access_token;
              const refresh_token = response.refresh_token;
              vueCookies.set('access_token', this.access_token);

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
            }

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
    async refreshToken() {
      const UsersRef = doc(this.db, "Users", this.uid);
      const docSnap = await getDoc(UsersRef);
      await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          'client_id': process.env.VUE_APP_CLIENT_ID,
          'client_secret': process.env.VUE_APP_CLIENT_SECRET,
          'grant_type': 'refresh_token',
          'refresh_token': docSnap.data().refreshToken,
          'redirect_uri': this.redirectUrl,
        })
      }).then(result => result.json())
          .then(async response => {
            if (response.error === "invalid_grant") {
              return this.discordAuthFailed = true;
            } else {
              this.access_token = response.access_token;
              const refresh_token = response.refresh_token;
              vueCookies.set('access_token', this.access_token);

              fetch('https://discord.com/api/users/@me', {
                headers: {
                  authorization: `Bearer ${this.access_token}`,
                },
              }).then(result => result.json())
                  .then(async response => {
                    const {id} = response;
                    await updateDoc(UsersRef, {
                      discordUserID: id,
                      refreshToken: refresh_token,
                      accessToken: this.access_token,
                    })
                    vueCookies.set('discordId', id);
                  });
            }

          });
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box
}

/* style the container */
.container {
  position: relative;
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px 0 30px;
}

/* style inputs and link buttons */
input,
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  margin: 5px 0;
  opacity: 0.85;
  display: inline-block;
  font-size: 17px;
  line-height: 20px;
  text-decoration: none; /* remove underline from anchors */
}

input:hover,
.btn:hover {
  opacity: 1;
  background: #dddd;
}

/* add appropriate colors to fb, twitter and google buttons */
.fb {
  background-color: #3B5998;
  color: white;
}

.twitter {
  background-color: #55ACEE;
  color: white;
}

.google {
  background-color: #dd4b39;
  color: white;
}

/* style the submit button */
#emailPassButton {
  background-color: #04AA6D;
  color: white;
  cursor: pointer;
}

#emailPassButton:hover {
  background-color: #45a049;
}

/* Two-column layout */
.col {
  float: left;
  width: 50%;
  margin: auto;
  padding: 0 50px;
  margin-top: 6px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* vertical line */
.vl {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  border: 2px solid #ddd;
  height: 175px;
}

/* text inside the vertical line */
.inner {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 8px 10px;
}

/* hide some text on medium and large screens */
.hide-md-lg {
  display: none;
}

/* Responsive layout - when the screen is less than 650px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 650px) {
  .col {
    width: 100%;
    margin-top: 0;
  }

  /* hide the vertical line */
  .vl {
    display: none;
  }

  /* show the hidden text on small screens */
  .hide-md-lg {
    display: block;
    text-align: center;
  }
}
</style>