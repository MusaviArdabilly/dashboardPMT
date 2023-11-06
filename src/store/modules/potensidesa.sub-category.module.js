import JwtService from "../../services/jwt.services.js";

const state = {
  headersTableSubCategory: [],
  dataSubCategory: [],
  dataSubCategoryById: "",
  dataSubCategoryDataType: [],
  tableSubCategory: {
    limit: 10,
    page: 1,
    sort: "asc",
    search: "",
  },
  errorMessage: "",
  isLoading: false,
  isAddDialog: false,
  isEditDialog: false,
};

const mutations = {
  setTableSubCategory(state, payload) {
    state.tableSubCategory = payload;
  },
  setSubCategory(state, payload) {
    if (payload == null) {
      state.dataSubCategory.data = [];
    } else {
      state.dataSubCategory = payload;
    }

    const headers = [
      {
        text: "Name",
        value: "name",
        sortable: false,
      },
      {
        text: "Description",
        value: "description",
        sortable: false,
      },
      {
        text: "Unit",
        value: "unit",
        sortable: false,
      },
      {
        text: "Category",
        value: "category.name",
        sortable: false,
      },
      {
        text: "Created at",
        value: "created_at",
        sortable: false,
      },
      {
        text: "Updated at",
        value: "updated_at",
        sortable: false,
      },
      {
        text: "On Table",
        value: "is_on_table",
        sortable: false,
      },
      {
        text: "Need Formula",
        value: "is_calculated",
        sortable: false,
      },
      {
        text: "Need on Calculation",
        value: "is_used_by_calculation",
        sortable: false,
      },
      {
        text: "Show On Map Detail",
        value: "is_show_on_pop_up",
        sortable: false,
      },
      {
        text: "Actions",
        value: "id",
        sortable: false,
      },
    ];
    state.headersTableSubCategory = headers;
  },
  setSubCategoryDataType(state, payload) {
    state.dataSubCategoryDataType = payload;
  },
  fetchSubCategoryById(state, data) {
    fetch(
      process.env.VUE_APP_API_URL + `api/v1/id/sdp/sub-category/${data.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtService.getToken()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const form = {
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
          unit: result.data.unit,
          category_id: {
            id: result.data.category.id,
            name: result.data.category.name,
          },
          data_type: { name: result.data.data_type },
          is_on_table: result.data.is_on_table,
          is_calculated: result.data.is_calculated,
          is_show_on_pop_up: result.data.is_show_on_pop_up,
          is_used_by_calculation: result.data.is_used_by_calculation,
          dynamicField: [],
        };

        result.data.option.split(",").forEach((item, index) => {
          result.data.weight.split(",").forEach((item2, index2) => {
            if (index == index2) {
              form.dynamicField.push({
                value: item,
                isDisabled: true,
                oldValue: item,
                weight: item2,
              });
            }
          });
        });
        // console.log(form, "by id");
        state.dataSubCategoryById = form;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  setErrorMessage(state, payload) {
    state.errorMessage = payload;
  },
  setAddDialog(state, payload) {
    state.isAddDialog = payload;
  },
  setEditDialog(state, payload) {
    state.isEditDialog = payload;
  },
  setLoading(state, payload) {
    state.isLoading = payload;
  },
};

const getters = {
  headersSubCategory: (state) => state.headersTableSubCategory,
  tableSubCategory: (state) => state.tableSubCategory,
  getDataSubcategoryDesa: (state) => state.dataSubCategory,
  getDataSubcategoryDesaById: (state) => state.dataSubCategoryById,
  getDataSubCategoryDataType: (state) => state.dataSubCategoryDataType,
  errorMessageSubcategory: (state) => state.errorMessage,
  isAddDialog: (state) => state.isAddDialog,
  isEditDialog: (state) => state.isEditDialog,
  isLoading: (state) => state.isLoading,
};

const actions = {
  fetchPotensiDesaSubcategory(context, request) {
    const url = new URL(
      process.env.VUE_APP_API_URL + `api/v1/id/sdp/sub-category`
    );
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
          context.commit("setSubCategory", result.data);
          this.commit("loadingTable", false);
          this.commit("setLoading", false);
        } else {
          this.commit("setLoading", false);
          this.commit("response", result.error);
          context.commit("setSubCategory", result.data);
          this.commit("loadingTable", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  fetchPotensiDesaSubcategoryDataType(context, request) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/setting/findbyname`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          const createArr = result.data.data.value.split(/\s*,\s*/);
          const finalizeArr = [];
          createArr.forEach((item) => finalizeArr.push({ name: item }));
          context.commit("setSubCategoryDataType", finalizeArr);
        } else {
          this.commit("response", result.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  createPotensiDesaSubCategory(context, request) {
    this.commit("setLoading", true);
    return new Promise((resolve, reject) => {
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/sub-category/create`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtService.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error != true) {
            this.commit("setLoading", false);
            this.commit("setAddDialog", false);
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
  updatePotensiDesaSubCategory(context, request) {
    this.commit("setLoading", true);
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/id/sdp/sub-category/${request.id}`,
        {
          method: "PUT",
          body: JSON.stringify(request.data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtService.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.error != true) {
            this.commit("setLoading", false);
            this.commit("setEditDialog", false);
            resolve();
          } else {
            reject(result.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  updateOptionPotensiDesaSubCategory(context, request) {
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/id/sdp/sub-category/option/${request.id}`,
        {
          method: "PUT",
          body: JSON.stringify(request.data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtService.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.error != true) {
            this.commit("loadingContent", false);
            resolve({ message: result.message, id: request.id });
          } else {
            reject(result.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  deletePotensiDesaSubCategory(context, request) {
    this.commit("loadingTable", true);
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/sdp/sub-category/${request}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtService.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.error != true) {
            this.commit("loadingTable", false);
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
  checkOptionsPotensiDesaSubCategory(context, request) {
    const url = new URL(
      process.env.VUE_APP_API_URL + `api/v1/id/sdp/sub-category/option`
    );
    for (let key in request) {
      url.searchParams.append(key, request[key]);
    }
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtService.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          //   console.log(result);
          if (result.error != true) {
            this.commit("loadingContent", false);
            resolve(result.message);
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
