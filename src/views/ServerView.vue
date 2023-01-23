<template>
  <div class="container">
  <div class="row">
  <div class="col">


  <ServerSettingsComponent/>
  </div>
    <div class="col">
  <ServerStatsComponent/>
    </div>
  </div>
  </div>

</template>

<script>
import ServerStatsComponent from "@/components/ServerStatsComponent.vue";
import ServerSettingsComponent from "@/components/ServerSettingsComponent.vue";
export default {
  name: "ServerView",
  components: {ServerSettingsComponent, ServerStatsComponent}
}
</script>

<style scoped>

</style>