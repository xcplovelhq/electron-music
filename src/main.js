import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import "@/less/index.less";
import api from "./api";
import "./plugins/element.js";
import VueAwesomeSwiper from "vue-awesome-swiper";
import Moment from "moment";
import Toasted from "vue-toasted";
import "./lib/directives";
import { Drawer, Skeleton, Spin } from "ant-design-vue";
Vue.use(Drawer);
Vue.use(Skeleton);
Vue.use(Spin);

// require styles
import "swiper/css/swiper.css";
Vue.use(VueAwesomeSwiper);
Vue.use(Toasted, {
  position: "top-center",
  duration: 1000,
  singleton: true,
  iconPack: "fontawesome",
  icon: "&#xe60f;"
});

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
