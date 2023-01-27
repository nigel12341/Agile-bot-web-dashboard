<template>
  <div id="container" class="card">
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
</template>

<script>
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

export default {
  name: "transscriptOneServerComponent",
  async created() {
    await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${this.$route.query.access_token}`,
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
      transscripts: 0,
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