<template>
  <v-app>
    <v-app-bar app absolute color="blue darken-3" elevate-on-scroll tile height="100">
      <v-icon class="white--text text-h4 pointer">mdi-filmstrip</v-icon>
      <v-toolbar-title class="white--text text-h4 font-weight-bold">Movies DB</v-toolbar-title>
      <span class="text-h5 white--text ml-10">Découvrez les meilleurs films de tous les temps ici !</span>
      <template v-slot:extension>
        <v-icon class="pb-3 white--text text-h4 pointer">mdi-format-title</v-icon
        ><v-autocomplete hide details dark dense background-color="grey darken-3" filled class="mb-3 mx-2" clearable label="Titre" color="white"></v-autocomplete>
        <v-icon class="pb-3 white--text text-h4 pointer">mdi-database</v-icon
        ><v-autocomplete hide details dark dense background-color="grey darken-3" filled class="mb-3 mx-2" clearable label="Genre" color="white"></v-autocomplete>
        <v-checkbox dark color="white" class="mb-3" v-model="onlyUnseenMovies" label="Uniquement les films non vus"></v-checkbox>
        <v-range-slider
            v-model="years"
            :max="maxYear"
            :min="minYear"
            hide-details
            color="white"
            class="align-center mb-9 ml-5"
          >
            <template v-slot:prepend>
              <v-text-field
                :value="years[0]"
                dark
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(years, 0, $event)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="years[1]"
                dark
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(years, 1, $event)"
              ></v-text-field>
            </template>
          </v-range-slider>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    onlyUnseenMovies: false,
    years: [1970, 2021],
    minYear:1970,
    maxYear: 2021,
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
