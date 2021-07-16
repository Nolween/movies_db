<template>
  <v-container fluid>
    <v-app-bar app absolute color="blue darken-3" elevate-on-scroll tile height="100">
      <v-icon class="white--text text-h4 pointer">mdi-filmstrip</v-icon>
      <v-toolbar-title class="white--text text-h4 font-weight-bold">Movies DB</v-toolbar-title>
      <span class="text-h5 white--text ml-10">Découvrez les meilleurs films de tous les temps ici !</span>
      <template v-slot:extension>
        <v-icon class="pb-8 white--text text-h4 pointer">mdi-format-title</v-icon
        ><v-text-field v-model="titleSearch" hide details dark dense background-color="grey darken-3" filled class="mb-3 mx-2" clearable label="Titre" color="white"></v-text-field>
        <v-icon class="pb-8 white--text text-h4 pointer">mdi-database</v-icon
        ><v-autocomplete
          chips
          clearable
          multiple
          small-chips
          v-model="genreSearch"
          :items="genres"
          item-text="name"
          item-value="id"
          hide
          details
          dark
          dense
          background-color="grey darken-3"
          filled
          class="mb-3 mx-2"
          label="Genre"
          color="white"
        ></v-autocomplete>
        <v-checkbox dark color="white" class="mb-3" v-model="onlyUnseenMovies" label="Uniquement les films non vus"></v-checkbox>
        <v-range-slider v-model="years" :max="maxYear" :min="minYear" hide-details color="white" class="align-center mb-9 ml-5">
          <template v-slot:prepend>
            <v-text-field :value="years[0]" dark class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px" @change="$set(years, 0, $event)"></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field :value="years[1]" dark class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px" @change="$set(years, 1, $event)"></v-text-field>
          </template>
        </v-range-slider>
      </template>
    </v-app-bar>
    <v-row justify="center" id="timeline-row">
      <v-col cols="8" lg="10">
        <v-stepper alt-labels>
          <v-stepper-header>
            <template v-for="(movie, index) in getDisplayedMovies">
              <v-stepper-step step="" :key="movie.id">
                {{ dayjs(movie.release_date).format("DD/MM/YYYY") }}
              </v-stepper-step>

              <v-divider v-if="index !== getDisplayedMovies.length - 1" :key="index"></v-divider>
            </template>
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="2" md="1" align-self="center" justify="center">
        <v-btn v-if="movieIndex > 0 && getOrderedMovies.length > 6" @click="movieIndex--" large rounded color="grey darken-3" class="mb-3"><v-icon class="white--text">mdi-chevron-left</v-icon></v-btn>
        <v-btn v-if="movieIndex > 0 && getOrderedMovies.length > 6" @click="movieIndex--" large rounded color="grey darken-3"><v-icon class="white--text">mdi-chevron-double-left</v-icon></v-btn>
      </v-col>
      <v-col cols="8" md="10">
        <v-row no-gutters>
          <v-col v-for="(movie, index) in getDisplayedMovies" :key="index" lg="2" md="4" cols="6" class="movie-col">
            <div class="white text-left pl-2 text-center poster">
              <v-img :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path" width="300"></v-img>
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
              <span class="text-h6 white--text"
                ><v-btn color="grey darken-3"><v-icon color="white" class="text-h5">mdi-bookmark</v-icon></v-btn></span
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" md="1" align-self="center">
        <v-btn v-if="getOrderedMovies.length > 6" @click="movieIndex++" large rounded color="grey darken-3" class="mb-3"><v-icon class="white--text">mdi-chevron-right</v-icon></v-btn>
        <v-btn v-if="getOrderedMovies.length > 6" @click="movieIndex++" large rounded color="grey darken-3"><v-icon class="white--text">mdi-chevron-double-right</v-icon></v-btn>
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
      onlyUnseenMovies: false,
      years: [1920, 2021],
      minYear: 1920,
      maxYear: 2021,
      dayjs: dayjs,
      results: [],
      movieIndex: 0,
      genres: [],
      titleSearch: "",
      genreSearch: "",
    };
  },
  computed: {
    // Classement des films selon la date de sortie, et filtrés selon les champs
    getOrderedMovies() {
      let movies = this.results;
      if (movies.length > 0) {
        // Classement des films par date de sortie ascendante
        movies = movies.sort((a, b) => (a.release_date >= b.release_date ? 1 : -1));
        //* Filtre par le Titre
        if (this.titleSearch.trim() !== "" && this.titleSearch.trim().length > 0) {
          // On escape bien les caractères spéciaux avant la constitution du regex
          let escapedSearch = this.titleSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          // Initialisation de la chaine qui définira le regex
          let regexRapidValue;
          regexRapidValue = new RegExp(escapedSearch, "i");
          // Initialisation d'une variable de recherche
          let found;
          movies = movies.filter((film) => {
            // Réinitialisation de la recherche
            found = false;
            // Parcours des champs de l'objets
            for (let key in film) {
              // Si on a bien une valeur et que ce n'est pas la propriété ID
              if (key === "title") {
                // A t-on trouvé la valeur?
                found = !!regexRapidValue.test(film[key].toString());
                // Si on a trouvé, on arrête la boucle
                if (found) {
                  return true;
                }
              }
            }
            // Si true, on garde l'agent dans le filtre
            return found;
          });
        }
        //* Filtre par le genre
        if (this.genreSearch.length > 0 ) {
          movies = movies.filter((film) => {
            // Si le film a bien un genre
            if (film.genre_ids.length > 0 ) {
              // Le film contient-il au moins un des genres sélectionnés?
              return this.genreSearch.some(v => film.genre_ids.includes(v))
            }
            else {
              return false 
            }
          })
        }
        //* Filtre par années sélectionnées
        if (this.years.length > 0) {
          var years = this.years
          movies = movies.filter((film) => {
            // Quelle est l'année de parution du film?
            let year = dayjs(film.release_date).year()
            return year >= years[0] && year <= years[1]
          })
        }
        //* Filtre des filmes déjà vus
        
        return movies;
      }
      // On ne garde que de l'index défini à +6
      return movies;
    },
    getDisplayedMovies() {
      var indexMovie = this.movieIndex;
      return this.getOrderedMovies.filter(function(element, index) {
        return index >= indexMovie && index <= indexMovie + 5;
      });
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
.movie-title,
.genres-title {
  height: 120px;
}
.movie-col {
  border: 1px solid white;
}

#timeline-row {
  margin-top: 160px !important;
}
.poster {
  height: 300px !important;
}
</style>
