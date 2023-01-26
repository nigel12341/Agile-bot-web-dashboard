<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <ServerSettingsComponent :db="db"/>
      </div>
      <div class="col">
        <ServerStatsComponent :db="db"/>
      </div>

    </div>
    <div class="row">
      <div class="col">
        <TransscriptOneServerComponent/>
      </div>
    </div>
  </div>


</template>

<script>
import ServerStatsComponent from "@/components/ServerStatsComponent.vue";
import ServerSettingsComponent from "@/components/ServerSettingsComponent.vue";
import TransscriptOneServerComponent from "@/components/transscriptOneServerComponent.vue";

export default {
  name: "ServerView",
  components: {TransscriptOneServerComponent, ServerSettingsComponent, ServerStatsComponent},
  props: {
    db: {
      type: Object,
      required: true
    },
    app: {
      type: Object,
      required: true
    }
  },
}
</script>
<style scoped>
.container-fluid {
  width: 100%;
}
</style>