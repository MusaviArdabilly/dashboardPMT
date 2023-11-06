// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../../services/jwt.services";
// import {
//   GET_CITY,
//   GET_PROVINCE,
//   SEARCH_CITY,
// } from "../../store/modules/location.module";

import { GET_PROVINCE } from "../../../../store/modules/location.module";

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
    selected_province: 0,
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
      { text: "Alternative Name", value: "alt_name", sortable: false },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    user_token: null,
    search: "",
    searchCity: "",
    loadingSearch: false,
  }),

  watch: {
    search(val) {
      console.log(val);
    },
  },

  computed: {
    searchLength: function () {
      return this.search.length;
    },

    // data: function () {
    //   return this.$store.getters.city;
    // },

    province: function () {
      return this.$store.getters.province;
    },

    item_province: function () {
      return this.$store.getters.item_province;
    },

    loading: function () {
      return this.$store.getters.loading;
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
        province_id: this.selected_province,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/city`, {
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

    changeProvince() {
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
      this.selected_province == 0;

      this.initialize();
    },

    getProvince() {
      this.$store.dispatch(GET_PROVINCE);
    },

    // selectCity(value) {
    //   console.log(value);
    //   this.$store.dispatch(GET_CITY, value);
    // },

    // searchData(value) {
    //   console.log(value);
    //   if (this.searchLength > 2) {
    //     this.$store.dispatch(SEARCH_CITY, value);
    //   }
    //   if (value == "") {
    //     this.$store.dispatch(SEARCH_CITY, value);
    //   }
    // },
  },

  created() {
    this.user_token = JwtService.getToken();
    this.initialize();
    this.getProvince();
  },
};
