import Vue from "vue";
import Vuex from "vuex";
import sitesetting from "./modules/sitesetting.module.js";
import analysis from "./modules/analysis.module";
import auth from "./modules/auth.module";
import executive_navigation from "./modules/executive_navigation.module";
import location from "./modules/location.module";
import maps from "./modules/maps.module";
import mirroring from "./modules/mirroring.module";
import opsel from "./modules/opsel.module";
import qoe from "./modules/qoe.module";
import charts from "./modules/charts.module.js";
import potensiDesa from "./modules/potensidesa.module.js";
import potensiDesaCategory from "./modules/potensidesa.category.module.js";
import potensiDesaSubCategory from "./modules/potensidesa.sub-category.module";
import potensiDesaDetailsEdit from "./modules/potensidesa.details-edit.module";
import qoeFo from "./modules/qoe.fo.module.js";
import ticket from "./modules/ticket.module";
import alarm from "./modules/alarm.module";

Vue.use(Vuex);
const state = {
  error: true,
  errorCommit: true,
  loaders: false,
  loadingTable: false,
  loadingCircle: false,
  loadingData: false,
  loadingContent: false,
  colorList: [
    "#FFB900",
    "#c8cf00",
    "#B50E0E",
    "#E81123",
    "#B4009E",
    "#5C2D91",
    "#0078D7",
    "#134889",
    "#ff0087",
    "#008272",
    "#107C10",
    "#2cabe3",
    "#74b8f6",
    "#7113d6",
    "#066056",
    "#cc6e34",
    "#cc57ca",
    "#a01ef4",
    "#627c60",
  ],
};
const mutations = {
  response(state, payload) {
    state.error = payload;
  },
  responseCommit(state, payload) {
    state.errorCommit = payload;
  },
  loaders(state, payload) {
    state.loaders = payload;
  },
  loadingTable(state, payload) {
    state.loadingTable = payload;
  },
  loadingCircle(state, payload) {
    state.loadingCircle = payload;
  },
  loadingData(state, payload) {
    state.loadingData = payload;
  },
  loadingContent(state, payload) {
    state.loadingContent = payload;
  },
};
const getters = {
  response: (state) => state.error,
  responseCommit: (state) => state.errorCommit,
  loaders: (state) => state.loaders,
  loadingTable: (state) => state.loadingTable,
  loadingCircle: (state) => state.loadingCircle,
  loadingData: (state) => state.loadingData,
  loadingContent: (state) => state.loadingContent,
  colorList: (state) => state.colorList,
};
export default new Vuex.Store({
  state,
  mutations,
  getters,
  modules: {
    sitesetting,
    analysis,
    auth,
    executive_navigation,
    location,
    maps,
    mirroring,
    opsel,
    qoe,
    qoeFo,
    charts,
    potensiDesa,
    potensiDesaCategory,
    potensiDesaSubCategory,
    potensiDesaDetailsEdit,
    ticket,
    alarm,
  },
});
