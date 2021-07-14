<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <span v-for="(movie, index) in getOrderedMovies" :key="index" class="ml-3">{{movie.title}}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",

  components: {
  },
  data() {
    return {
      results: [],
    };
  },
  computed: {
    // Classement des films selon la date de sortie, et filtrés selon les champs
    getOrderedMovies() {
      let movies = this.results
      if (movies.length > 0 ) {
      // Classement des films par date de sortie ascendante
      return movies.sort((a, b) => (a.release_date >= b.release_date) ? 1 : -1)
      }
      return movies
    }
  },
  methods: {
    //  Récupération des films via l'API TMDB
    getBestMovies() {
      this.results = [];
      // Récupération des  100 premières pages pour avoir les 2000 films
      for (let page = 1; page <= 2; page++) {
        axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + process.env.VUE_APP_MOVIEDB_KEY + "&language=fr-FR&page=" + page).then((response) => {
          // Parcours des films pour les ajouter au résultats
          for (let resultIndex in response.data.results) {
            this.results.push(response.data.results[resultIndex]);
          }
        });
      }
      
    },
  },
  beforeMount() {
    this.getBestMovies();
  },
};
</script>
