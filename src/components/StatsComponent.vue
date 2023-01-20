<template>
<h1>Number of tickets opend</h1>
  <p>{{ tickets }}</p>
</template>

<script>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';

export default {
  name: "StatsComponent",
  data() {
    return {
      tickets: 0,
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

    this.getTickets(db);
  },
  methods: {
    async getTickets(db) {
      await onSnapshot(doc(db, "Guilds", "1026521458400296962", "stats", "tickets"), (doc) => {
        this.tickets = doc.data().numbTicketsOpend;
      });
    },
  },
}
</script>

<style scoped>

</style>