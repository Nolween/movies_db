<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="8" lg="10">
        <v-stepper alt-labels>
          <v-stepper-header>
            <template v-for="(movie, index) in getOrderedMovies">
              <v-stepper-step step="" :key="index">
                {{ dayjs(movie.release_date).format("DD/MM/YYYY") }}
              </v-stepper-step>

              <v-divider v-if="index !== getOrderedMovies.length - 1" :key="index"></v-divider>
            </template>
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="2" md="1" align-self="center" justify="center">
        <v-btn v-if="movieIndex > 0" @click="movieIndex--" large rounded color="grey darken-3" class="mb-3"><v-icon class="white--text">mdi-chevron-left</v-icon></v-btn>
        <v-btn v-if="movieIndex > 0" @click="movieIndex--" large rounded color="grey darken-3"><v-icon class="white--text">mdi-chevron-double-left</v-icon></v-btn>
      </v-col>
      <v-col cols="8" md="10">
        <v-row no-gutters>
          <v-col v-for="(movie, index) in getOrderedMovies" :key="index" lg="2" md="4" cols="6" class="movie-col">
            <div class="white text-left pl-2 text-center">
              <v-img :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path" height="350" width="300"></v-img>
            </div>
            <div class="blue text-left pl-2 movie-title">
              <span class="text-h6 white--text">{{ movie.title }}</span>
            </div>
            <div class="grey darken-3 text-left pl-2 genres-title">
              <span class="text-h6 white--text">{{ getMovieGenres(movie.genre_ids) }}</span>
            </div>
            <div class="red darken-3 text-left pl-2">
              <span class="text-h6 white--text">{{ dayjs(movie.release_date).format("DD/MM/YYYY") }}</span>
            </div>
            <div class="grey darken-3 text-left pa-4 text-center">
              <span class="text-h6 white--text"><v-btn color="grey darken-3"><v-icon color="white" class="text-h5">mdi-bookmark</v-icon></v-btn></span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" md="1" align-self="center">
        <v-btn @click="movieIndex++" large rounded color="grey darken-3" class="mb-3"><v-icon class="white--text">mdi-chevron-right</v-icon></v-btn>
        <v-btn @click="movieIndex++" large rounded color="grey darken-3"><v-icon class="white--text">mdi-chevron-double-right</v-icon></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
//? Nécessaire pour les dates
require("dayjs/locale/fr");
var dayjs = require("dayjs");

export default {
  name: "Home",

  components: {},
  data() {
    return {
      dayjs: dayjs,
      results: [],
      movieIndex: 0,
      genres: [],
    };
  },
  computed: {
    // Classement des films selon la date de sortie, et filtrés selon les champs
    getOrderedMovies() {
      let movies = this.results;
      if (movies.length > 0) {
        // Classement des films par date de sortie ascendante
        movies = movies.sort((a, b) => (a.release_date >= b.release_date ? 1 : -1));

        var indexMovie = this.movieIndex;
        return movies.filter(function(element, index) {
          return index >= indexMovie && index <= indexMovie + 5;
        });
      }
      // On ne garde que de l'index défini à +6

      return movies;
    },
  },
  methods: {
    getMovieGenres(genreIdsArray) {
      let genres = "";
      for (let genreIdIndex in genreIdsArray) {
        // Quel est l'index du genre par rapport à son ID dans la liste des genres?
        let genreIndex = this.genres
          .map(function(e) {
            return e.id;
          })
          .indexOf(genreIdsArray[genreIdIndex]);
        // Si on a bien l'index
        if (genreIndex != -1) {
          genres += this.genres[genreIndex].name + ", ";
        }
      }
      // On vire la dernière virgule si on a quelque chose
      if (genres !== "") {
        genres = genres.substring(0, genres.length - 2);
      }
      return genres;
    },
    //  Récupération des films via l'API TMDB
    getGenres() {
      this.genres = [];
      axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=" + process.env.VUE_APP_MOVIEDB_KEY + "&language=fr-FR").then((response) => {
        for (let resultIndex in response.data?.genres) {
          this.genres.push(response.data.genres[resultIndex]);
        }
      });
    },
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
    this.getGenres();
    this.getBestMovies();
  },
};
</script>
<style scoped>
.movie-title, .genres-title {
  height: 120px;
}
.movie-col {
  border: 1px solid white;
}
</style>