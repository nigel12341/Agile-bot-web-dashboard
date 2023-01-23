<template>
  <div class="card">
    <div id="botSettings" v-if=authorized>
      <div id="settings" v-if=setupStatusBackend>
        <h2>Bot settings</h2>
        <h4>You can also change these settings in discord using the /setup command!</h4>

        <div id="currentSettings">
          <h3>Current settings</h3>
          <p>Prefix: {{ prefix }}</p>
          <p>Mod role id: {{ modRole }}</p>
          <p>Admin role id: {{ adminRole }}</p>
          <p>Staff role id: {{ staffRole }}</p>
          <p>Ticket catagory id: {{ ticketCatagory }}</p>
        </div>
        <div id="changeSettings">
          <h3>Change settings</h3>
          <h5>Please note the id you input will not be checked if they are correct. For a better setup run /setup in
            discord!</h5>

          <div id="prefix">
            <h4>Change prefix</h4>
            <input type="text" id="prefixInput" placeholder="New prefix">
            <button id="prefixButton" class="btn btn-primary" @click="changePrefix">Change prefix</button>
          </div>
          <div id="modRole">
            <h4>Change mod role</h4>
            <input type="text" id="modRoleInput" placeholder="New mod role id">
            <button id="modRoleButton" class="btn btn-primary" @click="changeModRole">Change mod role</button>
          </div>
          <div id="adminRole">
            <h4>Change admin role</h4>
            <input type="text" id="adminRoleInput" placeholder="New admin role id">
            <button id="adminRoleButton" class="btn btn-primary" @click="changeAdminRole">Change admin role</button>
          </div>
          <div id="staffRole">
            <h4>Change staff role</h4>
            <input type="text" id="staffRoleInput" placeholder="New staff role id">
            <button id="staffRoleButton" class="btn btn-primary" @click="changeStaffRole">Change staff role</button>
          </div>
          <div id="ticketCatagory">
            <h4>Change ticket catagory</h4>
            <input type="text" id="ticketCatagoryInput" placeholder="New ticket catagory id">
            <button id="ticketCatagoryButton" class="btn btn-primary" @click="changeTicketCatagory">Change ticket
              catagory
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <h1>Setup incomplete</h1>
        <h2>Setup the bot before you can change settings!</h2>
        <h2>Use the /setup command in discord to setup the bot!</h2>
      </div>
    </div>
    <div id="botSettingsPermFail" v-else-if=fetchFailed>
      <h1>Bot settings</h1>
      <h2>Something went wrong while checking your permissions. Please try again later!</h2>
    </div>
    <div id="botSettingsUnauth" v-else>
      <h1>Bot settings</h1>
      <h2>You are not authorized to change bot settings!</h2>
    </div>
  </div>
</template>

<script>
import {doc, getDoc, getFirestore, onSnapshot, setDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";

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

export default {
  name: "ServerSettingsComponent",
  data() {
    return {
      ticketCatagory: null,
      prefix: "unavailable",
      modRole: "unavailable",
      adminRole: "unavailable",
      staffRole: "unavailable",
      setupStatusBackend: false,
      access_token: null,
      serverId: null,
      authorized: false,
      fetchFailed: false,
    }
  },
  methods: {
    async fetchSettings() {
      await onSnapshot(doc(db, "Guilds", this.serverId), (doc) => {
        this.ticketCatagory = doc.data().ticketCat;
        this.prefix = ((doc.data().prefix) ? doc.data().prefix : "Not set");
        this.modRole = ((doc.data().moderatorRoleId) ? doc.data().moderatorRoleId : "Not set");
        this.adminRole = ((doc.data().adminRoleId) ? doc.data().adminRoleId : "Not set")
        this.staffRole = ((doc.data().staffRoleId) ? doc.data().staffRoleId : "Not set");
        this.setupStatusBackend = doc.data().setup;
      });
    },
    async changeTicketCatagory() {


      const newTicketCatagory = document.getElementById("ticketCatagoryInput").value;

      await setDoc(doc(db, "Guilds", this.$route.query.id), {
        ticketCat: newTicketCatagory
      }, {merge: true});
    },
    async changePrefix() {
      const newPrefix = document.getElementById("prefixInput").value;

      await setDoc(doc(db, "Guilds", this.$route.query.id), {
        prefix: newPrefix
      }, {merge: true});
    },
    async changeModRole() {
      const newModRole = document.getElementById("modRoleInput").value;

      await setDoc(doc(db, "Guilds", this.$route.query.id), {
        moderatorRoleId: newModRole
      }, {merge: true});
    },
    async changeAdminRole() {
      const newAdminRole = document.getElementById("adminRoleInput").value;

      await setDoc(doc(db, "Guilds", this.serverId), {
        adminRoleId: newAdminRole
      }, {merge: true});
    },
    async changeStaffRole() {
      const newStaffRole = document.getElementById("staffRoleInput").value;

      await setDoc(doc(db, "Guilds", this.$route.query.id), {
        staffRoleId: newStaffRole
      }, {merge: true});
    },
    async authorize() {
      this.fetchFailed = false;
      const docRef = doc(db, "Guilds", this.serverId);
      const docSnap = await getDoc(docRef);


      await fetch(`https://discord.com/api/users/@me/guilds/${this.serverId}/member`, {
        headers: {
          authorization: `Bearer ${this.access_token}`,
        },
      }).then(result => result.json())
          .then(async response => {
            if (response.message === "You are being rate limited.") {
              this.authorized = false;
              this.fetchFailed = true;
            }
            this.authorized = response.roles.includes(docSnap.data().adminRoleId);
          })
          .catch(console.error);
      await fetch(`https://discord.com/api/users/@me/guilds`, {
        headers: {
          authorization: `Bearer ${this.access_token}`,
        },
      }).then(result => result.json())
          .then(async response => {
            let obj = response.find(o => o.id === this.serverId);

            if (obj.owner === true) {
              this.authorized = true;
            }
          })
          .catch(console.error);
    }
  },
  async mounted() {
    this.access_token = this.$route.query.access_token;
    this.serverId = this.$route.query.id;
    await this.authorize();
    await this.fetchSettings();
  }
}
</script>

<style scoped>
</style>

