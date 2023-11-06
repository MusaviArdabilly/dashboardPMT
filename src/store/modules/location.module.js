import JwtServices from "../../services/jwt.services";

// actions type
export const GET_PROVINCE = "getProvince";
export const GET_CITY = "getCity";
export const GET_DISTRICT = "getDistrict";
export const GET_SUB_DISTRICT = "getSubDistrict";
export const SEARCH_PROVINCE = "searchProvince";
export const SEARCH_CITY = "searchCity";
export const SEARCH_CITY_NAME = "searchCityName";
export const SEARCH_DISTRICT = "searchCity";
export const SEARCH_DISTRICT_NAME = "searchDistrictName";
export const SEARCH_SUB_DISTRICT = "searchCity";

// mutations type
export const SET_PROVINCE = "setProvince";
export const SET_CITY = "setCity";
export const SET_DISTRICT = "setDistrict";
export const SET_SUB_DISTRICT = "setSubDistrict";
export const SELECTED_PROVINCE = "selectedProvince";
export const SELECTED_CITY = "selectedCity";
export const SELECTED_DISTRICT = "selectedDistrict";
export const SET_LOADING = "setLoading";

const state = {
  province: [],
  item_province: [
    {
      name: "All Province",
      id: 0,
    },
  ],
  city: [],
  item_city: [
    {
      alt_name: "",
      created_at: "",
      id: 0,
      latitude: "",
      longitude: "",
      name: "All City",
      updated_at: "",
    },
  ],
  district: [],
  item_district: [
    {
      alt_name: "",
      created_at: "",
      id: 0,
      latitude: "",
      longitude: "",
      name: "All District",
      updated_at: "",
    },
  ],
  sub_district: [],
  item_sub_district: [
    {
      alt_name: "",
      created_at: "",
      id: 0,
      latitude: "",
      longitude: "",
      name: "All Sub-District",
      updated_at: "",
    },
  ],
  selected_province: 0,
  selected_city: 0,
  selected_district: 0,
  search: "",
  loading: false,
};

const getters = {
  province(state) {
    return state.province;
  },
  item_province(state) {
    return state.item_province;
  },
  city(state) {
    return state.city;
  },
  item_city(state) {
    return state.item_city;
  },

  district(state) {
    return state.district;
  },
  item_district(state) {
    return state.item_district;
  },
  sub_district(state) {
    return state.sub_district;
  },
  item_sub_district(state) {
    return state.item_sub_district;
  },
  loading(state) {
    return state.loading;
  },
  selected_province(state) {
    return state.selected_province;
  },
};

const actions = {
  [GET_PROVINCE](context) {
    context.commit(SET_LOADING, true);
    const data = {
      limit: -1,
      page: 1,
      sort: "asc",
      start_date: "",
      end_date: "",
      search: "",
    };
    fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/province`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        context.commit(SET_PROVINCE, result.data.data);
        for (var item of result.data.data) {
          state.item_province.push(item);
        }
        context.commit(SET_LOADING, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_CITY](context, payload) {
    if (payload == 0) {
      state.item_city = [
        {
          alt_name: "",
          created_at: "",
          id: 0,
          latitude: "",
          longitude: "",
          name: "All City",
          updated_at: "",
        },
      ];
    }
    context.commit(SET_LOADING, true);
    // console.log(payload)
    if (payload == undefined) {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        province_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/city`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_CITY, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      context.commit(SELECTED_PROVINCE, payload);
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        province_id: payload,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/city`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          state.item_city = [
            {
              alt_name: "",
              created_at: "",
              id: 0,
              latitude: "",
              longitude: "",
              name: "All City",
              updated_at: "",
            },
          ];
          for (var item of result.data.data) {
            state.item_city.push(item);
          }
          context.commit(SET_CITY, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [GET_DISTRICT](context, payload) {
    if (payload == 0) {
      state.item_district = [
        {
          alt_name: "",
          created_at: "",
          id: 0,
          latitude: "",
          longitude: "",
          name: "All District",
          updated_at: "",
        },
      ];
    }
    context.commit(SET_LOADING, true);
    if (payload == undefined) {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        city_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          context.commit(SET_LOADING, false);
          context.commit(SET_DISTRICT, result.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      context.commit(SELECTED_CITY, payload);
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        city_id: payload,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          state.item_district = [
            {
              alt_name: "",
              created_at: "",
              id: 0,
              latitude: "",
              longitude: "",
              name: "All District",
              updated_at: "",
            },
          ];
          for (var item of result.data.data) {
            state.item_district.push(item);
          }
          context.commit(SET_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [GET_SUB_DISTRICT](context, payload) {
    if (payload == 0) {
      state.item_sub_district = [
        {
          alt_name: "",
          created_at: "",
          id: 0,
          latitude: "",
          longitude: "",
          name: "All Sub-District",
          updated_at: "",
        },
      ];
    }

    context.commit(SET_LOADING, true);
    if (payload == undefined) {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        district_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/sub_district`, {
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

          for (var item of result.data.data) {
            state.item_sub_district.push(item);
          }
          context.commit(SET_SUB_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      context.commit(SELECTED_DISTRICT, payload);
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        district_id: payload,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/sub_district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          state.item_sub_district = [
            {
              alt_name: "",
              created_at: "",
              id: 0,
              latitude: "",
              longitude: "",
              name: "All Sub District",
              updated_at: "",
            },
          ];
          for (var item of result.data.data) {
            state.item_sub_district.push(item);
            // console.log(state.item_sub_district)
          }
          context.commit(SET_SUB_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [SEARCH_CITY](context, payload) {
    context.commit(SET_LOADING, true);
    state.search = payload;
    if (state.selected_province == 0) {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: payload,
        province_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/city`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_CITY, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: payload,
        province_id: state.selected_province,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/city`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_CITY, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [SEARCH_DISTRICT](context, payload) {
    // console.log(payload)
    context.commit(SET_LOADING, true);
    state.search = payload;
    if (state.selected_city == 0) {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: payload,
        city_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: payload,
        city_id: state.selected_city,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [SEARCH_SUB_DISTRICT](context, payload) {
    // console.log(payload, state.selected_district)
    context.commit(SET_LOADING, true);
    state.search = payload;
    if (state.selected_district == 0) {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: payload,
        district_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/sub_district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_SUB_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: payload,
        district_id: state.selected_district,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/sub_district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          context.commit(SET_SUB_DISTRICT, result.data.data);
          context.commit(SET_LOADING, false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [SEARCH_CITY_NAME](context, payload) {
    // console.log("searchCity", payload);
    context.commit(SET_LOADING, true);
    state.search = payload;

    const data = {
      limit: -1,
      page: 1,
      sort: "asc",
      start_date: "",
      end_date: "",
      search: payload,
      province_id: 0,
    };
    fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/city`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        for (var item of result.data.data) {
          state.item_city.push(item);
        }
        context.commit(SET_CITY, result.data.data);
        context.commit(SET_LOADING, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [SEARCH_DISTRICT_NAME](context, payload) {
    context.commit(SET_LOADING, true);
    state.search = payload;

    const data = {
      limit: -1,
      page: 1,
      sort: "asc",
      start_date: "",
      end_date: "",
      search: payload,
      city_id: 0,
    };
    fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/district`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        for (var item of result.data.data) {
          state.item_district.push(item);
        }
        context.commit(SET_DISTRICT, result.data.data);
        context.commit(SET_LOADING, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

const mutations = {
  [SET_PROVINCE](state, payload) {
    state.province = payload;
  },
  [SET_CITY](state, payload) {
    state.city = payload;
  },
  [SET_DISTRICT](state, payload) {
    state.district = payload;
    // console.log(state);
  },
  [SET_SUB_DISTRICT](state, payload) {
    state.sub_district = payload;
  },

  [SELECTED_PROVINCE](state, payload) {
    state.selected_province = payload;
  },

  [SELECTED_CITY](state, payload) {
    // console.log(payload);
    state.selected_city = payload;
  },

  [SELECTED_DISTRICT](state, payload) {
    // console.log(payload);
    state.selected_district = payload;
  },

  [SET_LOADING](state, payload) {
    state.loading = payload;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
