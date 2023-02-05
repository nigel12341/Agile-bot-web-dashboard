<template>
  <div id="container" class="card">
    <div v-if="transscripts === null" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else>
      <h1>Ticket transscripts for this server.</h1>
      <div class="flex-container" id="parent" v-if="transscripts > 0">
        <div id="child" class="col card" v-for="(url, index) in urls" :key="url">
          <iframe :title="index" :src="url" width="100%" height="1000px"></iframe>
        </div>
      </div>
      <div id="noTicket" v-else>
        <h1>No tickets found</h1>
      </div>
    </div>


    </div>
</template>

<script>
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import {getAuth} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";

export default {
  name: "transscriptOneServerComponent",
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
    const auth = getAuth();
    const UsersRef = doc(db, 'Users', auth.currentUser.uid);
    await getDoc(UsersRef).then((doc) => {
      this.access_token = doc.data().accessToken;
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${this.access_token}`,
      },
    }).then(result => result.json())
        .then(async response => {
          this.user = response;
        })
        .catch(console.error);

    const storage = getStorage();
    const listRef = ref(storage, this.user.id);
    const serverID = this.$route.query.id;

    listAll(listRef)
      .then(async (res) => {
        for (const itemRef of res.items) {
          // All the items under listRef.
          let path = itemRef._location.path;
          await getDownloadURL(ref(storage, path)).then((downloadURL) => {
            let name = itemRef.name;
            name = name.substring(0, name.length - 5)
            if(name.includes(serverID)){
              this.urls[name] = downloadURL;
            }
          });

        }
        this.transscripts = Object.keys(this.urls).length;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  data() {
    return {
      access_token: null,
      transscripts: null,
      user: null,
      urls: {},
    };
  },
}
</script>

<style scoped>
#parent {
  display: flex;
  flex-wrap: wrap;
}
#child{
  min-width: 400px;
}
</style>