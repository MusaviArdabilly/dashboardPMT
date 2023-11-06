import JwtService from "../../services/jwt.services.js";
const state = {
  dataDesaCategory: {
    error: false,
    validation_error: null,
    message: "success",
    data: [
      {
        id: 1,
        name: "Potensi Desa",
        description: "Deskripsi potensi desa",
        created_at: "2022-07-21 09:36:09.633 +0700",
        updated_at: "2022-07-21 09:36:09.633 +0700",
      },
      {
        id: 2,
        name: "Administrasi Desa",
        description: "Deskripsi administrasi desa",
        created_at: "2022-07-21 09:36:09.633 +0700",
        updated_at: "2022-07-21 09:36:09.633 +0700",
      },
    ],
  },
  headersTableCategory: [],
  dataCategory: [],
  dataCategoryById: "",
  tableCategory: {
    limit: 10,
    page: 1,
    sort: "desc",
    search: "",
  },
};

const mutations = {
  setCategory(state, payload) {
    if (payload == null) {
      state.dataCategory.data = [];
    } else {
      state.dataCategory = payload;
    }
    const headers = [
      {
        text: "Name",
        align: "start",
        value: "name",
      },
      {
        text: "Description",
        sortable: false,
        value: "description",
      },
      {
        text: "Created At",
        sortable: false,
        value: "created_at",
      },
      {
        text: "Updated",
        sortable: false,
        value: "updated_at",
      },
      {
        text: "Actions",
        sortable: false,
        value: "id",
      },
    ];
    state.headersTableCategory = headers;
  },
  fetchCategoryById(state, data) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/category/${data.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        state.dataCategoryById = result.data;
        setTimeout(() => {
          this.commit("loadingCircle", false);
        }, 800);
        this.commit("loadingTable", false);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  setTableCategory(state, data) {
    state.tableCategory = data;
  },
  testMutations() {
    console.log(this.state);
  },
};

const getters = {
  headersCategory: (state) => state.headersTableCategory,
  tableCategory: (state) => state.tableCategory,
  getDataCategoryDesa: (state) => state.dataDesaCategory,
  getDataCategoryById: (state) => state.dataCategoryById,
  getPotensiDesaCategory: (state) => state.dataCategory,
};

const actions = {
  fetchPotensiDesaCategory(context, request) {
    const url = new URL(process.env.VUE_APP_API_URL + `api/v1/id/sdp/category`);
    for (let key in request) {
      url.searchParams.append(key, request[key]);
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          this.commit("loadingData", false);
          this.commit("response", result.error);
          context.commit("setCategory", result.data);
          this.commit("loadingTable", false);
        } else {
          this.commit("loadingData", false);
          context.commit("setCategory", result.data);
          this.commit("response", result.error);
          this.commit("loadingTable", false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  fetchPotensiDesaCategoryNonTable(context, request) {
    const url = new URL(process.env.VUE_APP_API_URL + `api/v1/id/sdp/category`);
    for (let key in request) {
      url.searchParams.append(key, request[key]);
    }
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          this.commit("response", result.error);
          context.commit("setCategory", result.data);
        } else {
          this.commit("response", result.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  createPotensiDesaCategory(context, request) {
    return new Promise((resolve, reject) => {
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/category/create`, {
        method: "POST",
        body: request,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtService.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error != true) {
            resolve(response.message);
          } else {
            reject(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },
  updatePotensiDesaCategory(context, request) {
    const body = {
      name: request.name,
      description: request.description,
    };
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/sdp/category/${request.id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtService.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.error != true) {
            resolve(response.message);
          } else {
            reject(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },
  deletePotensiDesaCategory(context, request) {
    return new Promise((resolve, reject) => {
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/category/` + request, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtService.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error != true) {
            resolve();
          } else {
            reject(result.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
