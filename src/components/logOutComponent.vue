<template>
<h1>Logging you out!</h1>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import {initializeApp} from "firebase/app";
export default {
  name: "logOutComponent",
  created() {
    const firebaseConfig = {
      apiKey: "AIzaSyAsFPkrCVt2w5vjzZ-JaajZvIjwSLfRwwE",
      authDomain: "agile-bot-2003.firebaseapp.com",
      projectId: "agile-bot-2003",
      storageBucket: "agile-bot-2003.appspot.com",
      messagingSenderId: "1014532189070",
      appId: "1:1014532189070:web:e3c3751ecabf85758312df"
    };

// Initialize Firebase
    initializeApp(firebaseConfig);

    const auth = getAuth();
    if(auth.currentUser !== null) {
      signOut(auth).then(() => {
        this.$router.push({ name: 'login' })
      }).catch((error) => {
        console.error(error)
      });
    } else {
      alert('You are not logged in!')
    }

  }
}
</script>

<style scoped>

</style>