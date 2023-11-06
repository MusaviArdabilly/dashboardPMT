// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../../services/jwt.services";

export default {
  components: {},
  data: () => ({
    loading: false,
    loading_overlay: false,
    isEditDialog: false,
    overlayLoading: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    data: [],
    formUpdate: {
      id: "",
      alternative_name: "",
      average_population: "",
      capital: "",
    },
    singleSelect: false,
    selected: [],
    search: "",
    selected_data: {},
    headers: [
      { text: "Kode", align: "start", value: "id", sortable: false },
      {
        text: "Nama",
        value: `name`,
        sortable: false,
      },
      {
        text: "Latitude",
        value: `latitude`,
        sortable: false,
      },
      {
        text: "Longitude",
        value: `longitude`,
        sortable: false,
      },
      {
        text: "Ibu Kota",
        value: `capital`,
        sortable: false,
      },

      { text: "Alternative Name", value: "alt_name", sortable: false },
      { text: "Pulau", value: "island.island", sortable: false },
      {
        text: "Rata-rata Populasi",
        value: "island.average_population",
        sortable: false,
      },
      { text: "Actions", value: "island.province_id", sortable: false },
    ],
    user_token: null,
  }),

  computed: {
    searchLength: function () {
      return this.search.length;
    },
  },

  methods: {
    initialize() {
      this.search = "";

      this.loading = true;
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        search: "",
        sort: "asc",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/province`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.loading = false;
          this.data = [];
          if (result.error) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            return;
          }
          this.data = result.data.data;
          this.pagination.page = result.data.pagination.current_page;
          this.pagination.totalItems = result.data.pagination.total_page;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDataProvince() {
      if (this.searchLength < 3 && this.searchLength != 0) {
        return;
      }

      if (this.search != "") {
        this.pagination.page = 1;
      }

      this.loading = true;
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        search: this.search,
        sort: "asc",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/province`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.loading = false;
          this.data = [];
          if (result.error) {
            this.$swal({
              text: result.message,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              timer: 3000,
              icon: "error",
            });
            return;
          }
          this.data = result.data.data;
          this.pagination.page = result.data.pagination.current_page;
          this.pagination.totalItems = result.data.pagination.total_page;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setRows() {
      this.pagination.page = 1;

      this.initialize();
    },
    editData(data) {
      // console.log("edit data", data);
      this.isEditDialog = true;
      this.formUpdate = {
        id: data.id,
        capital: data.capital,
        alternative_name: data.alt_name,
        average_population: data.island.average_population,
      };
    },

    submitUpdateData() {
      this.overlayLoading = true;
      const payload = {
        capital: this.formUpdate.capital,
        alternative_name: this.formUpdate.alternative_name,
        average_population: Number(this.formUpdate.average_population),
      };
      console.log("plod", payload);
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v2/id/location/province/${this.formUpdate.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.overlayLoading = false;
          console.log(result);
          if (result.error) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            return;
          } else {
            this.isEditDialog = false;
            this.$swal
              .fire({
                title: "Data Updated",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              })
              .then(() => this.initialize());
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    resetData() {
      this.pagination.rowsPerPage = 10;
      this.pagination.page = 1;
      this.search = "";

      this.initialize();
    },
  },

  created() {
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};
