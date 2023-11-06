import moment from "moment";
export default {
  data() {
    return {
      sortBy: "name",
      sortDesc: false,
      categoryDialog: false,
      category: {},
      search: "",
      fetchId: "",
      rules: {
        required: (value) => !!value || "Required.",
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 1,
        rowsPerPageItems: [10, 50, 100, 250, 500],
        sort: "desc",
      },
      isSubmit: false,
    };
  },
  watch: {
    categoryDialog(value) {
      if (value) {
        setTimeout(() => {
          if (this.fetchId != "") {
            this.$refs.dialogtitle.innerText = "Edit Category";
          } else {
            this.$refs.dialogtitle.innerText = "Create Category";
          }
        }, 300);
      } else {
        this.category = {};
        this.$store.commit("loaders", false);
        setTimeout(() => {
          this.fetchId = "";
        }, 200);
      }
    },
    pagination(value) {
      console.log(value);
    },
  },
  computed: {
    headers() {
      return this.$store.getters.headersCategory;
    },
    setTableCategoryParams() {
      return this.$store.getters.tableCategory;
    },
    dataItems() {
      return this.$store.getters.getPotensiDesaCategory.data;
    },
    paginationType() {
      const paginationType = {
        page: this.pagination.page,
        rowsPerPage: this.pagination.rowsPerPage,
        totalItems:
          this.$store.getters.getPotensiDesaCategory.pagination.total_page,
        sort: this.pagination.sort,
      };
      this.pagination.totalItems =
        this.$store.getters.getPotensiDesaCategory.pagination.total_page;
      return paginationType;
    },
    loadingCircle() {
      return this.$store.getters.loadingCircle;
    },
    loadingTable() {
      return this.$store.getters.loadingTable;
    },
    loadingData() {
      return this.$store.getters.loadingData;
    },
    error() {
      return this.$store.getters.response;
    },
    errorCommit() {
      return this.$store.getters.responseCommit;
    },
  },
  filters: {
    moment(value) {
      return moment(value).format("DD-MM-YYYY - hh:mm");
    },
  },
  methods: {
    initializeDataCategory(payload) {
      this.$store.dispatch("fetchPotensiDesaCategory", payload);
    },
    editDialog(val) {
      this.category["name"] = "loading...";
      this.category["description"] = "loading...";

      this.$store.commit("loadingCircle", true);
      this.fetchId = val;
      this.$store.commit("fetchCategoryById", { id: this.fetchId });
      setTimeout(() => {
        this.category = {
          id: this.$store.getters.getDataCategoryById.id,
          name: this.$store.getters.getDataCategoryById.name,
          description: this.$store.getters.getDataCategoryById.description,
        };
      }, 800);
      this.categoryDialog = true;
    },
    deleteDialog(val) {
      // console.log(val);
      this.$swal({
        title: "Do you want to delete this category?",
        icon: "question",
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonColor: "#134889",
        confirmButtonText: "Yes",
        denyButtonColor: "#cfcfcf",
        denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.commit("loadingTable", true);
          this.$store
            .dispatch("deletePotensiDesaCategory", val)
            .then(() => {
              this.$swal({
                title: "Success deleted",
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              })
                .then(() => {
                  this.pagination.page = 1;
                  this.$store.commit("loadingTable", false);
                })
                .then(() => {
                  this.$store.dispatch(
                    "fetchPotensiDesaCategory",
                    this.setTableCategoryParams
                  );
                });
            })
            .catch((message) => {
              this.$swal({
                title: message,
                icon: "error",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              }).then(() => this.$store.commit("loadingTable", false));
            });
        } else if (result.isDenied) {
          console.log(`Delete canceled`);
        }
      });
    },
    handleSortAsc() {
      this.sortDesc = false;
    },
    handleSortDesc() {
      this.sortDesc = true;
    },
    handleSort(val) {
      this.pagination.sort = val;
      this.setTableLimit();
    },
    saveCategory() {
      if (this.$refs.inputName.value == undefined) {
        this.$swal({
          title: "Name is required",
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "#134889",
          timer: 3000,
        });
      } else {
        if ("description" in this.category == false) {
          this.category["description"] = "";
          this.$store.commit("loadingTable", true);
          this.$store.commit("loadingCircle", true);
          this.$store
            .dispatch(
              "createPotensiDesaCategory",
              JSON.stringify(this.category)
            )
            .then((result) => {
              this.$swal({
                title: "Sukses",
                text: result.message,
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              })
                .then(() => {
                  this.$store.dispatch(
                    "fetchPotensiDesaCategory",
                    this.setTableCategoryParams
                  );
                })
                .then(() => {
                  this.category = {};
                  this.$store.commit("loadingTable", false);
                  this.$store.commit("loadingCircle", false);
                  this.pagination.page = 1;
                });
            })
            .catch((error) => {
              this.$swal({
                title: "Gagal",
                text: error.message,
                icon: "error",
                showConfirmButton: true,
                timer: 3000,
              }).then(() => {
                this.$store.commit("loadingTable", false);
                this.$store.commit("loadingCircle", false);
              });
            });
        } else {
          this.$store.commit("loadingTable", true);
          this.$store.commit("loadingCircle", true);
          this.$store
            .dispatch(
              "createPotensiDesaCategory",
              JSON.stringify(this.category)
            )
            .then((result) => {
              this.$swal({
                title: "Sukses",
                text: result.message,
                icon: "success",
                showConfirmButton: true,
                timer: 3000,
              })
                .then(() => {
                  this.$store.dispatch(
                    "fetchPotensiDesaCategory",
                    this.setTableCategoryParams
                  );
                })
                .then(() => {
                  this.category = {};
                  this.$store.commit("loadingTable", false);
                  this.$store.commit("loadingCircle", false);
                  this.pagination.page = 1;
                });
            })
            .catch((error) => {
              this.$swal({
                title: "Gagal",
                text: error.message,
                icon: "error",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              }).then(() => {
                this.$store.commit("loadingTable", false);
                this.$store.commit("loadingCircle", false);
              });
            });
        }
      }
    },
    saveExitCategory() {
      if (this.$refs.inputName.value == undefined) {
        this.$swal({
          title: "Name is required",
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "#134889",
          timer: 3000,
        });
      } else {
        if ("description" in this.category == false) {
          this.category["description"] = "";
          this.$store.commit("loadingTable", true);
          this.$store.commit("loadingCircle", true);
          this.$store
            .dispatch(
              "createPotensiDesaCategory",
              JSON.stringify(this.category)
            )
            .then((result) => {
              this.$swal({
                title: "Sukses",
                text: result.message,
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              })
                .then(() => {
                  this.$store.dispatch(
                    "fetchPotensiDesaCategory",
                    this.setTableCategoryParams
                  );
                })
                .then(() => {
                  this.category = {};
                  this.$store.commit("loadingTable", false);
                  this.$store.commit("loadingCircle", false);
                  this.categoryDialog = false;
                  this.pagination.page = 1;
                });
            })
            .catch((error) => {
              this.$swal({
                title: "Gagal",
                text: error.message,
                icon: "error",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              }).then(() => {
                this.$store.commit("loadingTable", false);
                this.$store.commit("loadingCircle", false);
              });
            });
        } else if ("id" in this.category == true) {
          this.$store.commit("loadingTable", true);
          this.$store.commit("loadingCircle", true);
          this.$store
            .dispatch("updatePotensiDesaCategory", this.category)
            .then((result) => {
              this.$swal({
                title: "Sukses",
                text: result.message,
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              })
                .then(() => {
                  this.$store.dispatch(
                    "fetchPotensiDesaCategory",
                    this.setTableCategoryParams
                  );
                })
                .then(() => {
                  this.category = {};
                  this.$store.commit("loadingTable", false);
                  this.$store.commit("loadingCircle", false);
                  this.categoryDialog = false;
                  this.pagination.page = 1;
                });
            })
            .catch((error) => {
              this.$swal({
                title: "Gagal",
                text: error.message,
                icon: "error",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              }).then(() => {
                this.$store.commit("loadingTable", false);
                this.$store.commit("loadingCircle", false);
              });
            });
        } else {
          this.$store.commit("loadingTable", true);
          this.$store.commit("loadingCircle", true);
          this.$store
            .dispatch(
              "createPotensiDesaCategory",
              JSON.stringify(this.category)
            )
            .then((result) => {
              this.$swal({
                title: "Sukses",
                text: result.message,
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              })
                .then(() => {
                  this.$store.dispatch(
                    "fetchPotensiDesaCategory",
                    this.setTableCategoryParams
                  );
                })
                .then(() => {
                  this.category = {};
                  this.$store.commit("loadingTable", false);
                  this.$store.commit("loadingCircle", false);
                  this.categoryDialog = false;
                  this.pagination.page = 1;
                });
            })
            .catch((error) => {
              this.$swal({
                title: "Gagal",
                text: error.message,
                icon: "error",
                showConfirmButton: true,
                confirmButtonColor: "#134889",
                timer: 3000,
              }).then(() => {
                this.$store.commit("loadingTable", false);
                this.$store.commit("loadingCircle", false);
              });
            });
        }
      }
    },
    setTable() {
      const payload = {
        limit: this.paginationType.rowsPerPage,
        page: this.paginationType.page,
        sort: this.pagination.sort,
        search: this.search,
      };
      this.$store.commit("loadingTable", true);
      this.initializeDataCategory(payload);
    },
    setTableLimit() {
      if (this.search.length < 3 && this.search.length != 0) {
        return;
      }
      const payload = {
        limit: this.paginationType.rowsPerPage,
        page: "",
        sort: this.pagination.sort,
        search: this.search,
      };
      this.pagination.page = 1;
      this.pagination.totalItems = 1;
      this.$store.commit("loadingTable", true);
      this.initializeDataCategory(payload);
    },
    resetData() {
      this.pagination.rowsPerPage = 10;
      this.search = "";
      this.initializeDataCategory(this.setTableCategoryParams);
    },
  },
  created() {
    this.$store.commit("loadingData", true);
    this.$store.commit("loadingTable", true);
    this.initializeDataCategory(this.setTableCategoryParams);
    // setTimeout(()=>{
    //   this.pagination.totalItems = this.$store.getters.getPotensiDesaCategory.pagination.total_page;
    // },1000)
    // this.$store.commit('testMutations')
    // console.log(this.$store.getters.loaders);
    // console.log(this.$store.getters);
    // console.log(this.$store.getters.getDataCategoryDesa);
  },
  mounted() {
    // console.log(this.$store.getters);
  },
};
