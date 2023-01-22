<template>

  <a v-if=!loggedIn id='login-link' href='https://discord.com/api/oauth2/authorize?client_id=1066056964083298415&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=token&scope=identify%20guilds'>Login with Discord</a>
  <div v-else>

    <h1>Welcome</h1>
    <img id="profileImg" :src=userPfp alt="Profile Picture">
    <h2>{{discordData}}</h2>

    <h1>Discord Servers you and the bot share!</h1>
    <div id="servers">
      <li v-for="server in discordGuilds" :key="server.id">
        <div class="card" style="width: 18rem;">
          <img :id="server.guildId" src="../assets/Discord-Logo.png" class="card-img-top serverImg" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{server.guildName}}</h5>
            <router-link :to="{path:'/serverstats',query:{id: server.guildId}}"><button class="btn btn-primary">Go to stats</button></router-link>
          </div>
        </div>
      </li>


    </div>
  </div>


</template>

<script>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, query, collection } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

export default {
  name: "StatsComponent",
  data() {
    return {
      discordData: null,
      discordGuilds: null,
      loggedIn: false,
      userPfp: null
    };
  },
  created() {


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

    getAnalytics(app);

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if(!fragment.has('access_token')) {
      return;
    }

    this.fetchDiscordUser(fragment);
    this.fetchUserGuilds(db);
  },
  methods: {
    fetchDiscordUser(fragment) {
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
            const { username, discriminator, id, avatar } = response;
            this.discordData = username + '#' + discriminator;

            fetch(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`)
                .then(response => {
                  this.userPfp = response.url;
                })
                .catch(console.error);
          })
          .catch(console.error);
    },
    async fetchUserGuilds(db) {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      if(fragment.has('access_token')) {
        this.loggedIn = true;
      }
      const accessToken = fragment.get('access_token');
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
          .then(result => result.json())
          .then(async response => {

            const q = query(collection(db, "Guilds"));

            let guildsBotIsIn = [];
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              guildsBotIsIn.push(doc.id);
            });

            let guildIdIconArray = [];
            for (let i = 0; i < response.length; i++) {
              if(guildsBotIsIn.includes(response[i].id)) {
                let guildId = response[i].id;
                let guildIcon = response[i].icon;
                let guildName = response[i].name;
                guildIdIconArray.push({
                  guildId: guildId,
                  guildIcon: guildIcon,
                  guildName: guildName
                });
              }
            }

            for (let i = 0; i < guildIdIconArray.length; i++) {
              let guildId = guildIdIconArray[i].guildId;
              let guildIcon = guildIdIconArray[i].guildIcon;

              if (guildIcon != null) {
                fetch(`https://cdn.discordapp.com/icons/${guildId}/${guildIcon}.png`)
                    .then(response => {
                      document.getElementById(guildId).src = response.url;
                    })
                    .catch(console.error);
              }
            }
            this.discordGuilds = guildIdIconArray;

          })
          .catch(console.error);
    },

  },
}
</script>

<style scoped>
* {
  text-align: center;
  margin: 0px auto;
}
#servers{
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}
#welcome_txt {
  font-size: 24px;
}

.serverImg, #profileImg {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
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