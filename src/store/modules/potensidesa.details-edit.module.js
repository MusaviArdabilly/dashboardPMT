import JwtService from "../../services/jwt.services";

// actions type
export const GET_FIELD_LIST = "getFieldList";
export const GET_DATA_BY_ID = "getDataById";

// mutations type
export const SET_OPSEL = "setOpsel";
export const SET_LOADING = "setLoading";

const state = {
  routeId: "",
  routeName: "",
};

const getters = {};

const actions = {
  [GET_FIELD_LIST]() {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        this.fieldData = result.data;
        // console.log(this.valueData);
        this.getDataByID(this.$route.params.id);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_DATA_BY_ID](id) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.error == false) {
          this.filter.object_id = result.data.object_id;
          this.filter.province = result.data.province.id;
          this.filter.city = result.data.city.id;
          this.filter.district = result.data.district.id;
          this.filter.subDistrict = result.data.sub_district.id;

          // console.log(this.filter);

          result.data.data.forEach((item) => {
            this.valueData[item.id] = item.value;
          });
          this.panel = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20,
          ];

          this.initialize(
            this.filter.province,
            this.filter.city,
            this.filter.district
          );

          this.updated_at = result.data.updated_at;
          this.updated_by = result.data.updated_by;
        }
      })

      .catch((err) => {
        console.log(err);
      });
  },
};

const mutations = {
  [SET_OPSEL](state, payload) {
    state.opsel = payload;
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
