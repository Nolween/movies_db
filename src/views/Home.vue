<template>
  <v-container fluid>
    <v-app-bar app  color="blue darken-3" elevate-on-scroll tile height="100">
      <v-icon class="white--text text-h4 pointer">mdi-filmstrip</v-icon>
      <v-toolbar-title class="white--text text-h4 font-weight-bold">Movies DB</v-toolbar-title>
      <span class="text-h5 white--text ml-10">Découvrez les meilleurs films de tous les temps ici !</span>
      <template v-slot:extension>
        <v-icon class="pb-8 white--text text-h4 pointer">mdi-format-title</v-icon
        ><v-text-field
          @change="moviePagination = 0"
          @keypress="moviePagination = 0"
          @click:clear="(titleSearch = ''), (moviePagination = 0)"
          v-model="titleSearch"
          hide
          details
          dark
          dense
          background-color="grey darken-3"
          filled
          class="mb-3 mx-2"
          clearable
          label="Titre"
          color="white"
        ></v-text-field>
        <v-icon class="pb-8 white--text text-h4 pointer">mdi-database</v-icon
        ><v-autocomplete
          chips
          clearable
          multiple
          small-chips
          @change="moviePagination = 0"
          deletable-chips
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
        <v-checkbox @change="moviePagination = 0" dark color="white" class="mb-3" v-model="onlyUnseenMovies" label="Uniquement les films non vus"></v-checkbox>
        <v-range-slider @change="moviePagination = 0" v-model="years" min="1950" max="2021" hide-details color="white" class="align-center mb-9 ml-5">
          <template v-slot:prepend>
            <v-text-field :value="years[0]" dark class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px" @change="(moviePagination = 0), $set(years, 0, $event)"></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field :value="years[1]" dark class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px" @change="(moviePagination = 0), $set(years, 1, $event)"></v-text-field>
          </template>
        </v-range-slider>
      </template>
    </v-app-bar>
    <v-row justify="center" id="timeline-row"
      ><v-col cols="12" lg="10"> <v-slider hide-details :max="getMaxMovieIndex" min="0" v-model="moviePagination"></v-slider> </v-col
    ></v-row>
    <v-row justify="start">
      <v-col :cols="getStepperColumns" offset="2" offset-lg="1">
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
        <v-btn v-if="moviePagination > 0 && getFilteredMovies.length > 6" @click="modifyMovieIndex(1, false)" large rounded color="grey darken-3" class="mb-3"
          ><v-icon class="white--text">mdi-chevron-left</v-icon></v-btn
        >
        <v-btn v-if="moviePagination > 0 && getFilteredMovies.length > 6" @click="modifyMovieIndex(getPaginationStep, false)" large rounded color="grey darken-3"
          ><v-icon class="white--text">mdi-chevron-double-left</v-icon></v-btn
        >
      </v-col>
      <v-col cols="8" md="10">
        <v-row no-gutters>
          <v-col v-for="(movie, index) in getDisplayedMovies" :key="index" :cols="getColumnSize" class="movie-col">
            <div class="white text-left text-center poster">
              <v-img :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path" max-width="300" height="400"></v-img>
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
              >
              <v-tooltip top open-delay="200">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-on="on" v-bind="attrs" :color="seenMoviesIds.includes(movie.id) == false ? 'green' : 'red darken-3'" @click="toggleSeenMovie(movie.id)"
                    ><v-icon color="white" class="text-h5">mdi-bookmark</v-icon></v-btn
                  > </template
                >{{ seenMoviesIds.includes(movie.id) == false ? "Ajouter aux films déjà vus" : "Retirer des films déjà vus" }}</v-tooltip
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" md="1" align-self="center">
        <v-btn v-if="moviePagination < getFilteredMovies.length - getDisplayedMovies.length" @click="modifyMovieIndex(1, true)" large rounded color="grey darken-3" class="mb-3"
          ><v-icon class="white--text">mdi-chevron-right</v-icon></v-btn
        >
        <v-btn v-if="moviePagination < getFilteredMovies.length - getDisplayedMovies.length" @click="modifyMovieIndex(getPaginationStep, true)" large rounded color="grey darken-3"
          ><v-icon class="white--text">mdi-chevron-double-right</v-icon></v-btn
        >
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
      onlyUnseenMovies: false, //? Checkbox voir uniquement les films non vus
      years: [1950, 2021], //? Années de début / de fin pour la sélection
      dayjs: dayjs, //? utilisé pour la conversion de dates
      results: [], //? Tableau des films récupérés depuis l'API
      moviePagination: 0, //? 
      genres: [], //? Tableau des genres récupérés
      titleSearch: "", //? Contenu du champ de titre
      genreSearch: "", //? Contenu de recherche des genres
      seenMoviesIds: [], //? Tableau  des ids des films déjà vus
    };
  },
  computed: {
    //? Obtention de l'année de sortie la plus petite des films récupérés
    getMinYear() {
      let minYear = dayjs().year();
      if (this.results.length > 0) {
        for (let movieIndex in this.results) {
          minYear = dayjs(this.results[movieIndex].release_date).year() < minYear ? dayjs(this.results[movieIndex].release_date).year() : minYear;
        }
      }
      return minYear;
    },
    //? Obtention de l'année de sortie la plus grande des films récupérés
    getMaxYear() {
      let maxYear = dayjs().year();
      if (this.results.length > 0) {
        for (let movieIndex in this.results) {
          maxYear = dayjs(this.results[movieIndex].release_date).year() > maxYear ? dayjs(this.results[movieIndex].release_date).year() : maxYear;
        }
      }
      return maxYear;
    },
    //? Classement des films selon la date de sortie, et filtrés selon les champs titres / genre / vus / année de sortie
    getFilteredMovies() {
      let movies = this.results;
      if (movies.length > 0) {
        // Classement des films par date de sortie ascendante
        movies = movies.sort((a, b) => (a.release_date >= b.release_date ? 1 : -1));
        //* Filtre par le Titre
        if (this.titleSearch !== null && this.titleSearch.trim() !== "" && this.titleSearch.trim().length > 0) {
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
        if (this.genreSearch.length > 0) {
          movies = movies.filter((film) => {
            // Si le film a bien un genre
            if (film.genre_ids.length > 0) {
              // Le film contient-il au moins un des genres sélectionnés?
              return this.genreSearch.some((v) => film.genre_ids.includes(v));
            } else {
              return false;
            }
          });
        }
        //* Filtre par années sélectionnées
        if (this.years.length > 0 && this.years[0] !== null && this.years[1] !== null) {
          var years = this.years;
          movies = movies.filter((film) => {
            // Quelle est l'année de parution du film?
            let year = dayjs(film.release_date).year();
            return year >= years[0] && year <= years[1];
          });
        }
        //* Filtre des filmes déjà vus
        if (this.onlyUnseenMovies == true) {
          movies = movies.filter((film) => {
            return !this.seenMoviesIds.includes(film.id);
          });
        }
        return movies;
      }
      // On ne garde que de l'index défini à +6
      return movies;
    },
    //? Récupération des films à afficher
    getDisplayedMovies() {
      var moviePagination = this.moviePagination;
      var breakPoint;
      // Selon la  taille de l'écran
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          breakPoint = 2;
          break;
        case "sm":
          breakPoint = 2;
          break;
        case "md":
          breakPoint = 3;
          break;
        case "lg":
          breakPoint = 3;
          break;
        case "xl":
          breakPoint = 5;
          break;
      }
      return this.getFilteredMovies.filter(function(element, index) {
        return index >= moviePagination && index <= moviePagination + breakPoint;
      });
    },
    //? Définition de la taille de colonne des films selon la taille de l'écran
    getColumnSize() {
      var breakPoint;
      // Selon la  taille de l'écran
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          breakPoint = 6;
          break;
        case "sm":
          breakPoint = 4;
          break;
        case "md":
          breakPoint = 3;
          break;
        case "lg":
          breakPoint = 3;
          break;
        case "xl":
          breakPoint = 2;
          break;
      }
      return breakPoint;
    },
    //? Définition du nombre de films à afficher selon la taille de l'écran  
    getPaginationStep() {
      var breakPoint;
      // Selon la  taille de l'écran
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          breakPoint = 2;
          break;
        case "sm":
          breakPoint = 3;
          break;
        case "md":
          breakPoint = 4;
          break;
        case "lg":
          breakPoint = 4;
          break;
        case "xl":
          breakPoint = 6;
          break;
        default:
          breakPoint = 2;
          break;
      }
      return breakPoint;
    },
    //? Définition de la taille de chaque partie de chronologie
    getStepperColumns() {
      var columns;
      // Selon la  taille de l'écran
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          columns = this.getDisplayedMovies.length * 6 - 4;
          break;
        case "sm":
          columns = this.getDisplayedMovies.length * 4 - 4;
          break;
        case "md":
          columns = this.getDisplayedMovies.length * 3 - 4;
          break;
        case "lg":
          columns = this.getDisplayedMovies.length * 3 - 2;
          break;
        case "xl":
          columns = this.getDisplayedMovies.length * 2 - 2;
          if (this.getDisplayedMovies.length <= 2) {
            columns++
          }
          break;
      }
      return columns;
    },
    //? Index maximum de pagination pour la  navigation
    getMaxMovieIndex() {
      if (this.getFilteredMovies.length > 0) {
        return this.getFilteredMovies.length - this.getPaginationStep < 0 ? 0 : this.getFilteredMovies.length - this.getPaginationStep;
      }
      return 0;
    },
  },
  methods: {
    //? Définition des années de sélection selon les films récupérés
    setYears(results) {
      let start = 1900;
      let end = 2021;
      if (results.length > 0) {
        for (let movieIndex in results) {
          start = dayjs(results[movieIndex].release_date).year() < start ? dayjs(results[movieIndex].release_date).year() : start;
          end = dayjs(results[movieIndex].release_date).year() > end ? dayjs(results[movieIndex].release_date).year() : end;
        }
      }
      this.years[0] = start;
      this.years[1] = end;
    },
    //? Modification de la pagination depuis les flèches
    modifyMovieIndex(number, forward) {
      let moviePagination = forward ? this.moviePagination + number : this.moviePagination - number;
      if (moviePagination < 0) {
        this.moviePagination = 0;
      } else if (moviePagination >= this.getFilteredMovies.length - this.getPaginationStep) {
        this.moviePagination = this.getFilteredMovies.length - this.getPaginationStep;
      } else {
        this.moviePagination = moviePagination;
      }
    },
    //? Construction du contenu des genres pour les films
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
    //?  Récupération des films via l'API TMDB
    getGenres() {
      return new Promise((resolve) => {
        this.genres = [];
        axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=" + process.env.VUE_APP_MOVIEDB_KEY + "&language=fr-FR").then((response) => {
          for (let resultIndex in response.data?.genres) {
            this.genres.push(response.data.genres[resultIndex]);
          }
        });
        resolve();
      });
    },
    //?  Récupération des films via l'API TMDB
    getBestMovies() {
      return new Promise((resolve) => {
        this.results = [];
        // Récupération des  100 premières pages pour avoir les 2000 films
        for (let page = 1; page <= 100; page++) {
          axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + process.env.VUE_APP_MOVIEDB_KEY + "&language=fr-FR&page=" + page).then((response) => {
            // Parcours des films pour les ajouter au résultats
            for (let resultIndex in response.data.results) {
              this.results.push(response.data.results[resultIndex]);
            }
          });
        }
        resolve();
      });
    },
    //? Ajout / suppression d'un films dans la liste des films vus
    toggleSeenMovie(movieId) {
      // Si le film est déjà vu
      if (this.seenMoviesIds.includes(movieId)) {
        // Quel est son index dans le tableau?
        let movieIndex = this.seenMoviesIds.indexOf(movieId);
        if (movieIndex !== -1) {
          // On le retire de la liste
          this.seenMoviesIds.splice(movieIndex, 1);
        }
      } else {
        // On l'ajoute dans la liste
        this.seenMoviesIds.push(movieId);
      }
      // Modification dans le local storage
      localStorage.setItem("seen_movies", JSON.stringify(this.seenMoviesIds));
    },
  },
  beforeMount() {
    // Récupération des IDs de films déjà vus
    if (localStorage.getItem("seen_movies")) {
      this.seenMoviesIds = JSON.parse(localStorage.getItem("seen_movies"));
    }
    this.getGenres().then(() => this.getBestMovies().then(() => this.setYears(JSON.parse(JSON.stringify(this.results)))));
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
</style>
