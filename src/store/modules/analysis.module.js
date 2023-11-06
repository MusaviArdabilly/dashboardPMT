import JwtServices from "../../services/jwt.services";

// actions type
export const GET_ANALYSIS_PROVINCE = "getAnalysisProvince";
export const GET_ANALYSIS_CITY = "getAnalysisCity";
export const GET_ANALYSIS_DISTRICT = "getAnalysisDistrict";

// mutations type
export const SET_ACTIVE_FILTER = "setActiveFilter";
export const SET_ANALYSIS_PROVINCE = "setAnalysisProvince";
export const SET_ANALYSIS_CITY = "setAnalysisCity";
export const SET_ANALYSIS_DISTRICT = "setAnalysisDistrict";
export const RESET_FILTER = "resetFilter";

const state = {
  active_param: {
    opsel: "",
    technology: "",
    province: "",
    city: "",
    district: "",
  },
  active_filter: "",
  province: "",
  city: "",
  district: "",
  reset: false,
};

const getters = {
  active_param(state) {
    return state.active_param;
  },

  active_filter(state) {
    return state.active_filter;
  },

  analysis_province(state) {
    return state.province;
  },
  analysis_city(state) {
    return state.city;
  },
  analysis_district(state) {
    return state.district;
  },
};

const actions = {
  [GET_ANALYSIS_PROVINCE](context, payload) {
    function toTitles(s) {
      if (s == "DKI JAKARTA") {
        return "DKI Jakarta";
      } else {
        return s.replace(/\w\S*/g, function (t) {
          return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
        });
      }
    }

    context.commit(SET_ANALYSIS_PROVINCE, toTitles(payload));
  },

  [GET_ANALYSIS_CITY](context, payload) {
    let city = payload.replace("KAB. ", "");

    function toTitles(s) {
      return s.replace(/\w\S*/g, function (t) {
        return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
      });
    }

    context.commit(SET_ANALYSIS_CITY, toTitles(city));
  },

  [GET_ANALYSIS_DISTRICT](context, payload) {
    const data = {
      limit: 100,
      page: 1,
      sort: "asc",
      start_date: "",
      end_date: "",
      search: "",
      city_id: payload,
    };
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        context.commit(SET_ANALYSIS_DISTRICT, result.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

const mutations = {
  [SET_ACTIVE_FILTER](state, payload) {
    state.active_filter = payload;
  },

  [SET_ANALYSIS_PROVINCE](state, payload) {
    state.active_param.province = payload;
    state.province = payload;

    console.log(state);
  },
  [SET_ANALYSIS_CITY](state, payload) {
    state.city = payload;
  },
  [SET_ANALYSIS_DISTRICT](state, payload) {
    state.district = payload;
  },

  [RESET_FILTER](state) {
    state.active_param = {
      opsel: "",
      technology: "",
      province: "",
      city: "",
      district: "",
    };
    state.active_filter = "";
    state.province = "";
    state.city = "";
    state.district = "";
    state.reset = !state.reset;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
