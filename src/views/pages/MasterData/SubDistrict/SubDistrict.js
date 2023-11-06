import JwtService from "../../../../services/jwt.services";
import {
  GET_DISTRICT,
  SEARCH_DISTRICT_NAME,
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
    selected_district: 0,
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
      {
        text: "Kode Kecamatan",
        value: `district_id`,
        sortable: false,
      },
      { text: "Kode", align: "start", value: "id", sortable: false },
      {
        text: "Nama",
        value: `name`,
        sortable: false,
      },
    ],
    user_token: null,
    search: "",
    loadingSearch: false,
    searchDistrict: "",
  }),

  watch: {
    searchDistrict(val) {
      console.log(val);
      if (val.length > 2) {
        this.$store.dispatch(SEARCH_DISTRICT_NAME, val);
      }
    },
  },

  computed: {
    searchLength: function () {
      return this.search.length;
    },

    // data: function () {
    //   return this.$store.getters.sub_district;
    // },

    district: function () {
      return this.$store.getters.district;
    },

    item_district: function () {
      return this.$store.getters.item_district;
    },

    // loading: function () {
    //   return this.$store.getters.loading;
    // },
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
        district_id: this.selected_district,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/location/sub_district`, {
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

    changeDistrict() {
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
      this.selected_district == 0;

      this.initialize();
    },

    getDistrict() {
      this.$store.dispatch(GET_DISTRICT);
    },
  },

  created() {
    this.user_token = JwtService.getToken();
    this.initialize();
    this.getDistrict();
  },
};
