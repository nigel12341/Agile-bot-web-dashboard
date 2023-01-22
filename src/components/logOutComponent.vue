<template>
<h1>Logging you out!</h1>
</template>

<script>
export default {
  name: "logOutComponent",
  created() {
    this.$router.push({path: '/'});
  }
}
</script>

<style scoped>

</style>