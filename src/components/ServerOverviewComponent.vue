<template>
  <div v-if="discordGuilds === null">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-show="discordGuilds !== null">
    <h1>Welcome</h1>
    <img id="profileImg" src="../assets/Discord-Logo.png" alt="Profile Picture">
    <h2>{{ discordData }}</h2>
    <div id="userOverview">
      <router-link :to="{path:'/userView'}">
        <button class="btn btn-primary btn-lg">Go to personal overview</button>
      </router-link>
    </div>
    <a v-if="amountOfServers > 0" id="inviteBotButtonSmall" class="btn btn-primary btn-sm" href="https://discord.com/api/oauth2/authorize?client_id=1066056964083298415&permissions=8&scope=bot%20applications.commands" type="button">🎉 Add this bot to your server! 🎉</a>
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
        <div class="d-grid gap-2">
          <!--Change auth link to one that does not need admin perms-->
          <a id="inviteBotButtonLarge" class="btn btn-primary" href="https://discord.com/api/oauth2/authorize?client_id=1066056964083298415&permissions=8&scope=bot%20applications.commands" type="button">🎉 Add this bot to your server! 🎉</a>
        </div>
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
    await this.fetchUserGuilds()
  },
  methods: {
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
            if(response.message === "401: Unauthorized") {
              this.$router.push({name: 'login'})
            }
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
  },
}
</script>

<style scoped>
#inviteBotButtonLarge {
  -webkit-appearance: button;
  -moz-appearance: button;
  background-color: #7289DA !important;
  padding: 20px !important;
}
#inviteBotButtonSmall {
  -webkit-appearance: button;
  -moz-appearance: button;
  background-color: #7289DA !important;
}
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