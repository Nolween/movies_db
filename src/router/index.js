import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { authOnly: false, title: "Movies DB - Les 2000 meilleurs films" },
    component: Home
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

const DEFAULT_TITLE = 'Movies DB';
router.afterEach((to, from) => {
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});

export default router
