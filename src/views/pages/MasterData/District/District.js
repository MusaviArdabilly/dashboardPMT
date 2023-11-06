import JwtService from "../../../../services/jwt.services";
// import {
//   GET_CITY,
//   GET_DISTRICT,
//   SEARCH_CITY_NAME,
//   SEARCH_DISTRICT,
// } from "../../store/modules/location.module";

import {
  GET_CITY,
  SEARCH_CITY_NAME,
} from "../../../../store/modules/location.module";

export default {
  components: {},
  data: () => ({
    loading: false,
    loading_overlay: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    data: [],
    singleSelect: false,
    selected: [],
    selected_data: {},
    selected_city: 0,
    headers: [
      {
        text: "Kode Provinsi",
        value: `province_id`,
        sortable: false,
      },
      {
        text: "Kode Kota",
        value: `city_id`,
        sortable: false,
      },
      { text: "Kode", align: "start", value: "id", sortable: false },
      {
        text: "Nama",
        value: `name`,
        sortable: false,
      },

      // { text: "Alternative Name", value: "alt_name", sortable: false },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    user_token: null,
    search: "",
    searchCity: "",
    loadingSearch: false,
  }),

  watch: {
    searchCity(val) {
      if (val.length > 2) {
        this.$store.dispatch(SEARCH_CITY_NAME, val);
      }
    },
  },

  computed: {
    searchLength: function () {
      return this.search.length;
    },
    // loading: function () {
    //   return this.$store.getters.loading;
    // },
    // data: function () {
    //   return this.$store.getters.district;
    // },
    city: function () {
      return this.$store.getters.city;
    },
    item_city: function () {
      return this.$store.getters.item_city;
    },
  },

  methods: {
    initialize() {
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
        city_id: this.selected_city,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/district`, {
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

    changeCity() {
      this.pagination.page = 1;

      this.initialize();
    },
    setRows() {
      this.pagination.page = 1;

      this.initialize();
    },

    resetData() {
      this.pagination.rowsPerPage = 10;
      this.pagination.page = 1;
      this.search = "";
      this.selected_city == 0;

      this.initialize();
    },

    getCity() {
      this.$store.dispatch(GET_CITY);
    },
  },

  created() {
    this.user_token = JwtService.getToken();
    this.initialize();
    this.getCity();
  },
};
