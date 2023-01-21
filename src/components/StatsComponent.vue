<template>

  <a v-if=!loggedIn id='login-link' href='https://discord.com/api/oauth2/authorize?client_id=1066056964083298415&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2F&response_type=token&scope=identify%20guilds'>Login with Discord</a>
  <div v-else>
    <h1>Welcome {{discordData}}</h1>
    <div id="servers">
      <h1>Discord Servers</h1>

      <li v-for="server in discordGuilds" :key="server.id">
        {{ server.name }}
      </li>

    </div>
  </div>


</template>

<script defer>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';

export default {
  name: "StatsComponent",
  data() {
    return {
      tickets: 0,
      discordData: null,
      discordGuilds: null,
      loggedIn: false
    };
  },
  created() {
    this.fetchData();
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAsFPkrCVt2w5vjzZ-JaajZvIjwSLfRwwE",
      authDomain: "agile-bot-2003.firebaseapp.com",
      projectId: "agile-bot-2003",
      storageBucket: "agile-bot-2003.appspot.com",
      messagingSenderId: "1014532189070",
      appId: "1:1014532189070:web:e3c3751ecabf85758312df"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    this.getTickets(db);
  },
  methods: {
    async getTickets(db) {
      await onSnapshot(doc(db, "Guilds", "1026521458400296962", "stats", "tickets"), (doc) => {
        this.tickets = doc.data().numbTicketsOpend;
      });
    },
    fetchData() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      if(fragment.has('access_token')) {
        this.loggedIn = true;
      }
      const accessToken = fragment.get('access_token');
      // I prefer to use fetch
      // you can use use axios as an alternative
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }).then(result => result.json())
          .then(response => {
            const { username, discriminator } = response;
            this.discordData = username + '#' + discriminator;
          })
          .catch(console.error);

      fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
          .then(result => result.json())
          .then(response => {
            this.discordGuilds = response;
            console.table(response);
          })
          .catch(console.error);
    }
  },
}
</script>

<style scoped>
* {
  text-align: center;
  margin: 0px auto;
}
li{
  list-style: none;
}
#welcome_txt {
  font-size: 24px;
}

#login-link {
  background-color: whitesmoke;
  border-radius: 8px;
  color: black;
  padding: 15px 30px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
}

#login-link:hover {
  cursor: pointer;
}
</style>