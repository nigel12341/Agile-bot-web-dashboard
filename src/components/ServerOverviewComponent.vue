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
                <router-link :to="{path:'/serverstats',query:{id: server.guildId}}">
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
import {collection, getDocs, query, getDoc, doc} from 'firebase/firestore';
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";


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
      discordId: 0,
      refreshed: false,
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
    await new Promise(r => setTimeout(r, 500));
    await this.fetchDiscordUser();
    await this.fetchUserGuilds();
  },
  methods: {
    sleeper(ms) {
      return function (x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
      };
    },
    async fetchDiscordUser() {
      const auth = getAuth();
      const UsersRef = doc(this.db, 'Users', auth.currentUser.uid);
      await getDoc(UsersRef).then((doc) => {
        this.access_token = doc.data().accessToken;
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

      // I prefer to use fetch
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${this.access_token}`,
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
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          authorization: `Bearer ${this.access_token}`,
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