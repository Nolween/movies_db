<template>
  <v-app>
      <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
  }),
};
</script>
<style lang="scss">
#app {
  font-family: "Roboto", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.pointer {
  cursor: pointer;
}
</style>
