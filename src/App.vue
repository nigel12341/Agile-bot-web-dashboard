<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/logout">Logout</router-link>
  </nav>
  <router-view :db="db" :app="app"/>
</template>
<script>
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

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

export default {
  name: "App",
  data() {
    return {
      db: db,
      app: app,
    }
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
