import JwtServices from "../../services/jwt.services";

// Action
export const ALL_SETTINGS = "allSettings";
export const GET_SETTINGS_BY_NAME = "getSettingsByName";

// Mutation
export const SET_ALL_SETTINGS = "setAllSettings";
export const SET_THRESHOLD = "setThreshold";
export const SET_FO_THRESHOLD = "setFoThreshold";
export const SET_SETTING_BY_NAME = "setSettingByName";

const state = {
  allSettings: [],
  threshold: {
    cell: {},
    fo: {},
  },
  settingByName: {},
};

const getters = {
  allSettings: (state) => state.all,

  foThreshold: (state) => state.threshold,

  settingByName: (state) => state.settingByName,
};
const mutations = {
  [SET_ALL_SETTINGS]: (state, payload) => {
    const mapped = payload.map((item) => {
      let map = {
        [item.name]: item.value,
      };
      return map;
    });
    state.allSettings = mapped;
  },
  [SET_FO_THRESHOLD]: (state, payload) => {
    state.threshold.fo = payload;
  },
  [SET_SETTING_BY_NAME]: (state, payload) => {
    // console.log(payload);
    state.settingByName = payload;
  },
};
const actions = {
  [ALL_SETTINGS](context) {
    const defaultBody = {
      limit: 100,
      page: 1,
      sort: "asc",
      start_date: "",
      end_date: "",
      search: "",
    };
    fetch(
      process.env.VUE_APP_API_URL +
        `api/v1/${JwtServices.getUser().language}/setting`,
      {
        method: "POST",
        body: JSON.stringify(defaultBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.data);
        if (result.error != true) {
          context.commit(SET_ALL_SETTINGS, result.data.data);
          // context.commit(SET_FO_THRESHOLD, result.data.data);
        } else {
          console.log("Error :", result.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_SETTINGS_BY_NAME](context, request) {
    fetch(
      process.env.VUE_APP_API_URL +
        `api/v1/${JwtServices.getUser().language}/setting/findbyname`,
      {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.data);
        if (result.error != true) {
          context.commit(SET_SETTING_BY_NAME, result.data.data);
          // context.commit(SET_FO_THRESHOLD, result.data.data);
        } else {
          console.log("Error :", result.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
