import CryptoJS from "crypto-js";
import JwtService from "../../services/jwt.services";
import router from "../../router/index";

// actions type
export const AUTH_SIGNIN = "signin";
export const AUTH_SIGNOUT = "signout";
export const GET_SETTING = "getSetting";

// mutations type
export const SET_AUTH = "setUser";
export const SET_ERROR = "setError";
export const PURGE_AUTH = "purgeAuth";

const state = {
  user: {},
  isAuthenticated: false,
  errors: null,
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  getError(state) {
    return state.errors;
  },
};

const actions = {
  [AUTH_SIGNIN](context, credentials) {
    return new Promise((resolve, reject) => {
      fetch(process.env.VUE_APP_API_URL + "api/v1/id/account/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
        .then((response) => response.json())
        .then((result) => {
          status(result);
          if (context.state.errors != null) {
            reject(context.state.errors);
          }
          // context.commit(SET_AUTH, result.data)
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    function status(res) {
      if (res.error === true) {
        context.commit(SET_ERROR, res.message);
      } else {
        context.commit(SET_ERROR, null);
      }
      return res;
    }
  },

  [AUTH_SIGNOUT](context, data) {
    // console.log(data);
    const id = {
      id: data,
    };
    return new Promise((resolve, reject) => {
      fetch(process.env.VUE_APP_API_URL + "api/v1/id/account/signout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(id),
      })
        .then((response) => response.json())
        .then((result) => {
          //   console.log(result);
          status(result);
          if (context.state.errors != null) {
            reject(context.state.errors);
          }
          context.commit(PURGE_AUTH);
          router.replace("/auth/login");
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    function status(res) {
      if (res.error === true) {
        context.commit(SET_ERROR, res.message);
      } else {
        context.commit(SET_ERROR, null);
      }
      return res;
    }
  },

  [GET_SETTING](context) {
    let user = JwtService.getUser();
    let user_token = JwtService.getToken();

    if (user == null) {
      router.push("/auth/login");
      return;
    }

    const data = {
      limit: 100,
      page: 1,
      sort: "asc",
      start_date: "",
      end_date: "",
      search: "",
    };
    fetch(process.env.VUE_APP_API_URL + `api/v1/${user.language}/setting`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      },
    })
      .then((response) => {
        if (response.status == 401) {
          context.dispatch(AUTH_SIGNOUT, user.id);
          return;
        }
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    // console.log(state)
    state.errors = {};

    if (state.user.token != null) {
      var token = CryptoJS.AES.encrypt(
        JSON.stringify(state.user.token),
        "K0m1nf0@2021"
      ).toString();
      JwtService.saveToken(token);
    }

    var user_data = CryptoJS.AES.encrypt(
      JSON.stringify(state.user),
      "K0m1nf0@2021"
    ).toString();
    JwtService.saveUserData(user_data);
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
    JwtService.destroyUserData();
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
