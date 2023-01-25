<template>

  <a v-if=!loggedIn id='login-link'
     :href=oauthURL >Login
    with Discord</a>
  <div v-else>

    <h1>Welcome</h1>
    <img id="profileImg" :src=userPfp alt="Profile Picture">
    <h2>{{ discordData }}</h2>

    <h2>Servers you share with the bot</h2>
    <div id="servers" class="container">
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
  </div>


</template>

<script>
// Import the functions you need from the SDKs you need
import {collection, getDocs, query} from 'firebase/firestore';
import {getAnalytics} from "firebase/analytics";


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
      oauthURL: '',
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
  created() {
    this.oauthURL = process.env.VUE_APP_OAUTH_URL;
    getAnalytics(this.app);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    this.userToken = fragment.get('access_token')
    if (!fragment.has('access_token')) {
      return;
    }

    this.fetchDiscordUser(fragment);
    this.fetchUserGuilds();
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
      // you can use use axios as an alternative
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }).then(result => result.json())
          .then(response => {
            const {username, discriminator, id, avatar} = response;
            this.discordData = username + '#' + discriminator;
            this.userId = id;

            fetch(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`)
                .then(response => {
                  this.userPfp = response.url;
                })
                .catch(console.error);
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

#servers {
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