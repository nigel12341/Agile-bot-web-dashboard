<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <ServerSettingsComponent :db="db"/>
      </div>
      <div class="col">
        <ServerStatsComponent :db="db"/>
      </div>
    </div>
  </div>

</template>

<script>
import ServerStatsComponent from "@/components/ServerStatsComponent.vue";
import ServerSettingsComponent from "@/components/ServerSettingsComponent.vue";

export default {
  name: "ServerView",
  components: {ServerSettingsComponent, ServerStatsComponent},
  props: {
    db: {
      type: Object,
      required: true
    },
  },
}
</script>
<style scoped>

</style>