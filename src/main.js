import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import store from "./store";
import Maps from "highcharts/modules/map";
import router from "./router";
import * as VueGoogleMaps from "vue2-google-maps";
import VueSweetalert2 from "vue-sweetalert2";
import VueI18n from "vue-i18n";
import JsonExcel from "vue-json-excel";

Vue.use(VueI18n);
Vue.component("downloadExcel", JsonExcel);

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

// import '@syncfusion/ej2-base/styles/material.css'
// import '@syncfusion/ej2-vue-layouts/styles/material.css'
import "./assets/sass/main.scss";
import "leaflet/dist/leaflet.css";

//pmt global mixins
import { globalFeatures, pmtGlobal } from "./components/mixins/";
Vue.mixin(globalFeatures);
Vue.mixin(pmtGlobal);
// Language
import en from "./locale/en.json";
import id from "./locale/id.json";

const messages = {
  en: en,
  id: id,
};

// Create VueI18n instance with options
let i18n = new VueI18n({
  locale: "id", // set locale
  messages, // set locale messages
});

Maps(Highcharts);
Vue.use(HighchartsVue);
Vue.use(VueSweetalert2);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyClK_YfoEU2yFffWhf4lGT7SGLDBz1qq4M",
    libraries: "places",

    installComponents: true,
  },
});
Vue.config.productionTip = false;

global.$t = Vue.t;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
