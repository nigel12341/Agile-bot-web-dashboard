<template>
  <h1>Your transscripts</h1>
<div v-for="(url, index) in urls" :key="url">
  <a :href="url">{{ index }}</a>
</div>
</template>

<script>
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

export default {
  name: "transscriptComponent",
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

    listAll(listRef)
      .then(async (res) => {
        for (const itemRef of res.items) {
          // All the items under listRef.
          let path = itemRef._location.path;
          await getDownloadURL(ref(storage, path)).then((downloadURL) => {
            let name = itemRef.name;
            name = name.substring(0, name.length - 5)
            this.urls[name] = downloadURL;
          });

        }

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

</style>