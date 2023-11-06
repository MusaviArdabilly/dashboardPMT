import JwtServices from "../../services/jwt.services";

// actions type
export const GET_INFO_DRAWER = "getInfoDrawer";
export const GET_DARK_MODE = "getDarkMode";
export const GET_MAP_FILTER = "getMapFilter";

// mutations type
export const SET_INFO_DRAWER = "setInfoDrawer";
export const SET_INFO = "setInfo";
export const SET_DARK_MODE = "setDarkMode";
export const SET_MAP_FILTER = "setMapFilter";
export const SET_ACTIVE_LAYER = "setActiveLayer";
export const SET_TOGGLED_LAYER = "setToggledLayer";
export const SET_SELECTED_CATEGORY = "setSelectedCategory";
export const SET_SELECTED_BTS = "setSelectedBts";
export const SHOW_ALARM = "showAlarm";

const state = {
  info_drawer: false,
  mode: "Light",
  map_mode: "mapbox://styles/fauzanmasulili/cktntyz1r0mqp18nwi0tstwll",
  info_data: {},
  dark_mode: false,
  map_layers: [],
  coverage: [],
  borderline: [],
  bts: [],
  mukim: [],
  fixed_broadband: [],
  others: [],
  resident: [],
  componentKey: 0,
  active_layers: [],
  toggled_layer: "",
  selected_category: null,
  selected_bts: null,
  show_alarm: false,
};

const getters = {
  getInfoDrawer() {
    return state.info_drawer;
  },
  getInfo() {
    return state.info_data;
  },
  getBorderline() {
    return state.borderline;
  },
  getBts() {
    return state.bts;
  },
  getCoverage() {
    return state.coverage;
  },
  getFixedBroadband() {
    return state.fixed_broadband;
  },
  getMukim() {
    return state.mukim;
  },
  getOthers() {
    return state.others;
  },
  getResident() {
    return state.resident;
  },
  getMode() {
    return state.mode;
  },
  getDarkMode() {
    return state.dark_mode;
  },
  getMapStyle() {
    return state.map_mode;
  },
  componentKey() {
    return state.componentKey;
  },
  getActiveLayers() {
    return state.active_layers;
  },
  getToggledLayer() {
    return state.toggled_layer;
  },
  getCategory() {
    return state.selected_category;
  },
  showAlarm() {
    return state.show_alarm;
  },
};

const actions = {
  [GET_INFO_DRAWER](context, payload) {
    console.log(payload);
    context.commit(SET_INFO_DRAWER, payload);
  },
  [GET_DARK_MODE](context, payload) {
    console.log(payload);
    context.commit(SET_DARK_MODE, payload);
  },
  [GET_MAP_FILTER](context, payload) {
    console.log(payload);
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/map-layer`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Beaerer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        context.commit(SET_MAP_FILTER, result.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // context.commit(SET_DARK_MODE, payload)
  },
};

const mutations = {
  [SET_INFO_DRAWER](state, payload) {
    state.info_drawer = payload;
  },
  [SET_INFO](state, payload) {
    state.info_data = payload;
  },
  [SET_DARK_MODE](state, payload) {
    state.componentKey += 1;

    if (payload) {
      state.mode = "Dark";
      state.map_mode =
        "mapbox://styles/fauzanmasulili/cktnuivpv0nb418nwakgy6189";
    } else {
      state.mode = "Light";
      state.map_mode =
        "mapbox://styles/fauzanmasulili/cktntyz1r0mqp18nwi0tstwll";
    }
  },

  [SET_MAP_FILTER](state, payload) {
    console.log(payload);
    if (
      state.others.length == 0 &&
      state.coverage.length == 0 &&
      state.bts.length == 0 &&
      state.fixed_broadband.length == 0 &&
      state.resident.length == 0
    ) {
      for (let item of payload) {
        if (item.keywords.length == 0) {
          state.others.push(item);
        }

        switch (item.keywords[0]) {
          case "coverage":
            {
              state.coverage.push(item);
            }
            break;
          case "BTS":
            {
              state.bts.push(item);
            }
            break;
          case "FO":
            {
              state.fixed_broadband.push(item);
            }
            break;
          case "penduduk":
            {
              state.resident.push(item);
            }
            break;
        }
      }
    }
    // for (let item of payload) {
    //     // console.log(item.map_layer_category)

    //     if (item.map_layer_category == 'Batas Wilayah') {
    //         state.borderline = item
    //     }

    //     if (item.map_layer_category == 'BTS') {
    //         let group = item.data.reduce((r, a) => {
    //             r[a.cell_operator.name] = [...r[a.cell_operator.name] || [], a]
    //             return r;
    //         }, {});
    //         state.bts = group
    //     }

    //     if (item.map_layer_category == 'Coverage') {
    //         console.log(item.data)
    //         let coverage = {}
    //         item.data.reduce((r, a) => {
    //             if (a.cell_operator_id != 0) {
    //                 coverage[a.cell_operator.name] = [...coverage[a.cell_operator.name] || [], a]
    //                 return coverage;
    //             } else {
    //                 coverage["Lainnya"] = [...coverage["Lainnya"] || [], a]
    //                 return coverage;
    //             }
    //         }, {});

    //         // Set lainnya on the bottom of the list
    //         let sorted_list = {}
    //         let other = null
    //         for (const key in coverage) {
    //             if (Object.hasOwnProperty.call(coverage, key)) {

    //                 if (key == "Lainnya") {
    //                     console.log("Coverage", key, coverage[key])
    //                     other = coverage[key]
    //                     continue
    //                 }
    //                 sorted_list[key] = coverage[key];
    //             }
    //         }
    //         sorted_list["Lainnya"] = other;

    //         state.coverage = sorted_list
    //     }

    //     if (item.map_layer_category == 'Fixed Broadband') {
    //         // console.log("Fixed", item)
    //         // state.fixed_broadband = item
    //     }

    //     if (item.map_layer_category == 'Kontur') {
    //         // console.log("Kontur", item)
    //         // state.coverage = item
    //     }

    //     if (item.map_layer_category == 'Pemukiman') {
    //         // console.log("mukim", item)
    //         // state.mukim = item
    //     }

    //     if (item.map_layer_category == 'Lain-lain') {
    //         // console.log("others", item)
    //         // state.others = item
    //     }
    // }
  },

  [SET_ACTIVE_LAYER](state, payload) {
    state.componentKey += 1;
    state.active_layers = payload;
  },

  [SET_TOGGLED_LAYER](state, payload) {
    state.toggled_layer = payload;
  },

  [SET_SELECTED_CATEGORY](state, payload) {
    state.selected_category = payload;
  },

  [SHOW_ALARM](state, payload) {
    state.show_alarm = payload;
  },

  [SET_SELECTED_BTS](state, payload) {
    console.log(payload);
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
