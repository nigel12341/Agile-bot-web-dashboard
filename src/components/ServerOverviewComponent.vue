<template>

  <div>
    <h1>Welcome</h1>
    <img id="profileImg" src="../assets/Discord-Logo.png" alt="Profile Picture">
    <h2>{{ discordData }}</h2>
    <div id="userOverview">
      <router-link :to="{path:'/userView',query:{access_token: userToken}}">
        <button class="btn btn-primary btn-lg">Go to personal overview</button>
      </router-link>
    </div>
    <div id="serverOverview">
      <h2>Servers you share with the bot</h2>
      <div id="servers" class="container" v-if="amountOfServers > 0">
        <div class="row">
          <div v-for="server in discordGuilds" :key="server.id" class="col">
            <div class="card" style="width: 18rem;">
              <img :id="server.guildId" src="../assets/Discord-Logo.png" class="card-img-top serverImg" alt="...">
              <div class="card-body">
                <h5 class="card-title">{{ server.guildName }}</h5>
                <router-link :to="{path:'/serverstats',query:{id: server.guildId, access_token: userToken}}">
                  <button class="btn btn-primary">Manage</button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="noServers" v-else>
        <h3>You don't share any servers with the bot</h3>
      </div>
    </div>

  </div>


</template>

<script>
// Import the functions you need from the SDKs you need
import {collection, getDocs, query} from 'firebase/firestore';
import {getAnalytics} from "firebase/analytics";
import vueCookies from "vue-cookies";
// import vueCookies from "vue-cookies";


export default {
  name: "StatsComponent",
  data() {
    return {
      discordData: null,
      discordGuilds: null,
      loggedIn: false,
      userPfp: null,
      userId: null,
      userToken: '',
      amountOfServers: 0,
      code: null,
      access_token: null,
      uid: null,
      discordLinked: false,
    };
  },
  props: {
    db: {
      type: Object,
      required: true
    },
    app: {
      type: Object,
      required: true
    }
  },
  async created() {
    getAnalytics(this.app);
    await this.checkIfAuth();
  },
  methods: {
    sleeper(ms) {
      return function (x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
      };
    },
    fetchDiscordUser(fragment) {
      if (fragment.has('access_token')) {
        this.loggedIn = true;
      }
      const accessToken = fragment.get('access_token');

      // I prefer to use fetch
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }).then(result => result.json())
          .then(response => {
            const {username, discriminator, id, avatar} = response;
            this.discordData = username + '#' + discriminator;
            this.userId = id;

            if (avatar != null) {
              fetch(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`)
                  .then(response => {
                    document.getElementById("profileImg").src = response.url;
                  })
                  .catch(console.error);
            }
          })
          .catch(console.error);
    },
    async fetchUserGuilds() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      if (fragment.has('access_token')) {
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

            const q = query(collection(this.db, "Guilds"));

            let guildsBotIsIn = [];
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              guildsBotIsIn.push(doc.id);
              guildsBotIsIn.push(doc.owner);
            });

            let guildIdIconArray = [];

            for (const element of response) {
              if (guildsBotIsIn.includes(element.id)) {
                await this.sleeper(2000);
                let guildId = element.id;
                let guildIcon = element.icon;
                let guildName = element.name;
                guildIdIconArray.push({
                  guildId: guildId,
                  guildIcon: guildIcon,
                  guildName: guildName,
                });
              }
            }


            for (const element of guildIdIconArray) {
              let guildId = element.guildId;
              let guildIcon = element.guildIcon;

              if (guildIcon != null) {
                fetch(`https://cdn.discordapp.com/icons/${guildId}/${guildIcon}.png`)
                    .then(response => {
                      document.getElementById(guildId).src = response.url;
                    })
                    .catch(console.error);
              }
            }
            this.discordGuilds = guildIdIconArray;
            this.amountOfServers = guildIdIconArray.length;
          })
          .catch(console.error);
    },
    getParameterByName(name, url = window.location.href) {
      name = name.replace(/[[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    async fetchAccessToken() {
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
          .then(response => {
            this.access_token = response.access_token;
            // const refresh_token = response.refresh_token;
            //
            // const UsersRef = doc(this.db, "Users", this.uid);
          })
          .catch(console.error);

    },
    checkIfAuth() {
      if(vueCookies.get('discordId') === undefined){
        return this.discordLinked = false;
      }
      if(this.getParameterByName('code') != null){
        this.code = this.getParameterByName('code');
        this.fetchAccessToken();
      } else {
        this.$router.push({path: '/login'});
      }
    }

  },
}
</script>

<style scoped>
* {
  text-align: center;
  margin: 0px auto;
}

.btn-lg {
  padding: 10px;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#serverOverview {
  margin-top: 30px;
}

#servers {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}

#userOverview {
  margin-top: 30px;
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