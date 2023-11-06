import JwtService from "../../../services/jwt.services";

import moment from "moment";

export default {
  components: {},
  data: () => ({
    dialog: false,
    dialogDelete: false,
    loading: false,
    loading_overlay: false,
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "created_at",
      },
      {
        text: "Name",
        sortable: false,
        value: "user",
      },
      { text: "Service", value: "service", sortable: false },
      { text: "Action", value: "action", sortable: false },
      { text: "Message", value: "message", sortable: false },
      { text: "Detail", value: "detail", sortable: false },
      { text: "IP Address", value: "ip", sortable: false },
    ],
    start_time_picker: "00:00:00",
    end_time_picker: "23:00:00",
    datetab: "",
    data: [],
    date_1: new Date(Date.now()).toISOString().substr(0, 10),
    date_2: new Date(Date.now()).toISOString().substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    user_token: null,
    user: null,
    start_date: "",
    end_date: "",
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    search: "",
    sort: "desc",
  }),

  computed: {
    startDate: function () {
      return `${moment(this.date_1).format("YYYY-MM-DD")} ${
        this.start_time_picker
      }`;
    },
    endDate: function () {
      return `${moment(this.date_2).format("YYYY-MM-DD")} ${
        this.end_time_picker
      }`;
    },
  },

  filters: {
    moment: function (date) {
      return moment(date).format("YYYY-MM-DD - hh:mm:ss");
    },
  },

  methods: {
    initialize() {
      this.loading = true;
      this.loading_overlay = true;

      if (this.$route.query.log != "" && this.$route.query.log != undefined) {
        this.search = this.$route.query.log;
        const data = {
          limit: this.pagination.rowsPerPage,
          page: this.pagination.page,
          search: this.$route.query.log,
          start_date: "",
          end_date: "",
          sort: this.sort,
        };
        this.fetchData(data);
      } else {
        const data = {
          limit: this.pagination.rowsPerPage,
          page: 1,
          search: "",
          start_date: this.startDate,
          end_date: this.endDate,
          sort: this.sort,
        };
        // console.log(data, "plod init");
        this.fetchData(data);
      }
    },
    fetchData(payload) {
      // console.log(payload, "payload");
      console.log(this.search);
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/log-activity`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.loading = false;
          console.log(this.search, "search");
          this.loading_overlay = false;
          this.data = [];
          if (result.error) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            this.data = [];
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
    fetchDataLimit(payload) {
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/log-activity`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.loading = false;
          console.log(this.search, "search");
          this.loading_overlay = false;
          this.data = [];
          if (result.error) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            this.data = [];
            return;
          }
          this.data = result.data.data;
          this.pagination.page = 1;
          this.pagination.totalItems = result.data.pagination.total_page;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getByPagination() {
      console.log("by pagination");
      console.log(this.$route.query.log, "route query");
      this.loading = true;
      if (this.$route.query.log != "" && this.$route.query.log != undefined) {
        this.search = this.$route.query.log;
        const payload = {
          limit: this.pagination.rowsPerPage,
          page: this.pagination.page,
          search: this.search,
          start_date: "",
          end_date: "",
          sort: this.sort,
        };
        this.fetchData(payload);
      } else if (this.$route.query.log == undefined) {
        console.log("masuk else searh");
        const payload = {
          limit: this.pagination.rowsPerPage,
          page: this.pagination.page,
          search: this.search,
          start_date: this.startDate,
          end_date: this.endDate,
          sort: this.sort,
        };
        this.fetchData(payload);
      }
    },
    getBySearch() {
      if (this.search.length < 3 && this.search.length != 0) {
        return;
      }
      this.loading = true;

      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        search: this.search,
        start_date: this.startDate,
        end_date: this.endDate,
        sort: this.sort,
      };
      this.fetchData(data);
    },
    getByTableRow() {
      this.loading = true;
      this.pagination.page = 1;
      if (this.$route.query.log != "" && this.$route.query.log != undefined) {
        this.search = this.$route.query.log;
        const payload = {
          limit: this.pagination.rowsPerPage,
          page: 1,
          search: this.search,
          start_date: "",
          end_date: "",
          sort: this.sort,
        };
        this.fetchDataLimit(payload);
      } else if (this.$route.query.log == undefined) {
        const payload = {
          limit: this.pagination.rowsPerPage,
          page: this.pagination.page,
          search: this.search,
          start_date: this.startDate,
          end_date: this.endDate,
          sort: this.sort,
        };
        this.fetchDataLimit(payload);
      }
    },

    inputDate() {
      this.start_date = this.date_1;
      this.end_date = this.date_2;
    },

    submitFilter() {
      this.data = [];
      this.initialize();
    },
  },

  created() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    // console.log(this.date_1, this.date_2);
    this.initialize();
    console.log("testset");
  },
};
