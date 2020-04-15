import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/less/index.less";
import api from "./api";
import "./plugins/element.js";
import VueAwesomeSwiper from "vue-awesome-swiper";
import Moment from "moment";
// require styles
import "swiper/css/swiper.css";
Vue.use(VueAwesomeSwiper);
Vue.prototype.$moment = Moment;
// import debug from "electron-debug";
// debug({ showDevTools: true });

Vue.prototype.$api = api;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
