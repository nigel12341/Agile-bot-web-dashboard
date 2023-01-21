<template>
  <h1>Stats</h1>
  <h3>Tickets opened</h3>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tickets opened</h5>
            <p class="card-text">{{ticketsOpened}}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tickets closed</h5>
            <p class="card-text">{{ticketsClosed}}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tickets in progress</h5>
            <p class="card-text">{{ticketsInProgress}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {initializeApp} from "firebase/app";
import {doc, getFirestore, onSnapshot} from "firebase/firestore";

export default {
  name: "ServerStatsComponent",
  data() {
    return {
      ticketsOpened: 0,
      ticketsClosed: 0,
      ticketsInProgress: 0,
    };
  },
  methods: {
    async getAndComputeStats(db) {
      await onSnapshot(doc(db, "Guilds", "1026521458400296962", "stats", "tickets"), (doc) => {
        this.ticketsOpened = doc.data().numbTicketsOpend;
        this.ticketsClosed = doc.data().numbTicketsClosed;
        this.ticketsInProgress = this.ticketsOpened - this.ticketsClosed;
      });
    },
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

    this.getAndComputeStats(db);
  },
}
</script>

<style scoped>

</style>