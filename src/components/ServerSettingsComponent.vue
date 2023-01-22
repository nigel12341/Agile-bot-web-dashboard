<template>
  <div id="settings">
    <h1>Server Settings</h1>
    <p>You can change certain bot settings from here!</p>
    <h2>Ticket settings</h2>
    <h4>Change ticket catagory</h4>
    <p>Current catagory id: {{ ticketCatagory }}</p>
    <input type="text" id="newCatagoryId" placeholder="New catagory ID">
    <button class="btn btn-primary" @click="changeTicketCatagory()">Change</button>
  </div>
</template>

<script>
import {doc, getFirestore, onSnapshot, setDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";

export default {
  name: "ServerSettingsComponent",
  data() {
    return {
      ticketCatagory: null,
    }
  },
  methods: {
    async fetchTicketCatagory(db) {
      await onSnapshot(doc(db, "Guilds", this.$route.query.id), (doc) => {
        this.ticketCatagory = doc.data().ticketCat;
      });
    },
    async changeTicketCatagory() {
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

      const newTicketCatagory = document.getElementById("newCatagoryId").value;

      await setDoc(doc(db, "Guilds", this.$route.query.id), {
        ticketCat: newTicketCatagory
      }, {merge: false});
    }
  },
  async created() {
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

    await this.fetchTicketCatagory(db);
  }
}
</script>

<style scoped>

</style>