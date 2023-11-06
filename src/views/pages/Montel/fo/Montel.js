import moment from "moment";
import JwtService from "../../../../services/jwt.services";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";
import { mixinDownloadMontel } from "../montelDownload.mixins";

export default {
  mixins: [mixinDownloadMontel],
  components: { SkeletonLoader, NavigationCellAndFo },
  data: () => ({
    alert: true,
    start_time_picker: "00:00:00",
    end_time_picker: "23:00:00",
    datetab: "",
    user: null,
    search: "",
    dialog: false,
    loading_overlay: false,
    loading: false,
    app_name: "",
    item: [
      {
        text: "Cut",
      },
      {
        text: "Copy",
      },
      {
        text: "Paste",
      },
    ],
    completedSteps1: 80,
    completedSteps2: 50,
    completedSteps3: 20,
    completedSteps4: 90,
    totalSteps: 100,
    ck1: false,
    ck2: true,
    ck3: false,
    ck4: false,
    ck5: false,
    ck6: false,
    filter: {
      searchOperator: null,
    },
    telkomsel: null,
    indosat: null,
    xl: null,
    tri: null,
    smartfren: null,
    user_token: null,
    axis: false,
    menu: false,
    results: [],
    sort: [
      {
        name: "Ascending",
        value: "asc",
      },
      {
        name: "Descending",
        value: "desc",
      },
    ],
    list_category: [
      {
        id: 1,
        name: "Service",
      },
      {
        id: 2,
        name: "Network",
      },
    ],
    service: [
      { name: "All Service", value: "" },
      { name: "Data", value: "data" },
      { name: "Voice", value: "voice" },
    ],
    selected_service: "",
    selected_sort: "desc",
    // selected_opsel: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    selected_opsel: [],
    message: "",
    error: false,
    date_1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    selected_date: "",
    start_date: "",
    end_date: "",
    selected_status: 0,
    province: [],
    city: [],
    district: [],
    sub_district: [],
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
    selected_cell_operator: 0,
    category: "",
    subject: "",
    description: "",
    attachment: null,
    selected_data: {
      province_id: 0,
      city_id: 0,
      cell_operator_id: 0,
    },
    opsel: [],
    data_download: [],
    form_create: {},
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    date_open: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    summary_montel: {
      open: 0,
      on_progress: 0,
      closed: 0,
    },
  }),

  filters: {
    moment: function (date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  computed: {
    startDate: function () {
      return `${moment(this.date_1).format("YYYY-MM-DD")}`;
    },
    endDate: function () {
      return `${moment(this.date_2).format("YYYY-MM-DD")}`;
    },
    date: function () {
      return `${moment(this.date_open).utc().format("YYYY-MM-DD")} ${moment(
        this.startDate
      )
        .utc()
        .format("HH:mm:ss")}`;
    },
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    computedListOperator() {
      if (this.selected_opsel.includes(0)) {
        const operatorData = this.itemOperator.map((item) => {
          return item.id;
        });

        return operatorData;
      } else if (this.selected_opsel.length < 1) {
        const operatorData = this.itemOperator.map((item) => {
          return item.id;
        });

        return operatorData;
      } else {
        return this.selected_opsel;
      }
    },
  },

  methods: {
    initialize() {
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.selected_sort,
        search: "",
        service: this.selected_service,
        source: "",
        cell_operator_ids: this.computedListOperator,
      };
      this.getMontelData(payload);
      this.getSummaryMontel();
    },

    getSummaryMontel() {
      const data = {
        start_date: "",
        end_date: "",
        cell_operator_id: 0,
        app_id: 4,
      };
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/ticket-status`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error) {
            console.error(result.message);
            return;
          }

          for (let i = 0; i < result.data.length; i++) {
            switch (result.data[i].name) {
              case "Open":
                this.summary_montel.open = result.data[i].count;
                break;
              case "On Progress":
                this.summary_montel.on_progress = result.data[i].count;
                break;
              case "Closed":
                this.summary_montel.closed = result.data[i].count;
                break;

              default:
                break;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push({ name: "Login" });
    },

    inputDate() {
      this.start_date = this.date_1;
      this.end_date = this.date_2;
    },
    getMontelDataByPagination() {
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.selected_sort,
        search: this.search,
        service: this.selected_service,
        source: "",
        cell_operator_ids: this.computedListOperator,
      };
      this.getMontelData(payload);
    },
    getMontelDataByTableRow() {
      this.loading = true;
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.selected_sort,
        search: this.search,
        service: this.selected_service,
        source: "",
        cell_operator_ids: this.computedListOperator,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/montel`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          // console.log(response);
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            this.results = [];
            this.pagination.page = 1;
            this.pagination.totalItems = 0;
            this.loading = false;
            return;
          } else {
            this.results = result.data.data;
            this.data_download = [];
            result.data.data.forEach((item, index) => {
              this.data_download.push({
                no: index + 1,
                date: item.post_at,
                source: item.source,
                account: item.account,
                content: item.content,
                sentimen: item.sentimen,
                service: item.service,
                complaint: item.complaint,
              });
            });
            this.pagination.page = 1;
            this.pagination.totalItems = result.data.pagination.total_page;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getMontelData(payload) {
      this.loading = true;

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/montel`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          // console.log(response);
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            this.results = [];
            this.pagination.page = 1;
            this.pagination.totalItems = 0;
            this.loading = false;
            return;
          } else {
            this.results = result.data.data;
            this.data_download = [];
            result.data.data.forEach((item, index) => {
              this.data_download.push({
                no: index + 1,
                date: item.post_at,
                source: item.source,
                account: item.account,
                content: item.content,
                sentimen: item.sentimen,
                service: item.service,
                complaint: item.complaint,
              });
            });
            this.pagination.page = result.data.pagination.current_page;
            this.pagination.totalItems = result.data.pagination.total_page;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submitFilter() {
      this.loading = true;
      this.error = false;
      this.message = "";
      const payload = {
        start_date: this.start_date,
        end_date: this.end_date,
        limit: 10,
        page: 1,
        sort: this.selected_sort,
        service: this.selected_service,
        source: "",
        cell_operator_ids: this.computedListOperator,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v1/id/montel`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error == false) {
            this.results = result.data.data;
            this.data_download = [];

            result.data.data.forEach((item, index) => {
              this.data_download.push({
                no: index + 1,
                date: item.post_at,
                source: item.source,
                account: item.account,
                content: item.content,
                sentimen: item.sentimen,
                service: item.service,
                complaint: item.complaint,
              });
            });
            // console.log(this.results);
            setTimeout(() => {
              this.loading = false;
            }, 3000);
          } else {
            setTimeout(() => {
              this.loading = false;
              this.message = result.message;
              this.error = result.error;
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) {
            this.logout();
          }
        });
    },

    setupCreateTicket(item) {
      this.dialog = true;
      this.selected_ticket = [];
      this.selected_ticket.push(item);
      this.app_name = item.app.name;
      this.selected_cell_operator = item.cell_operator_id;
    },

    createTicket() {
      let data = new FormData();

      // MAPPING DATA FOR CREATE
      this.form_create = {
        app_id: this.selected_ticket[0].app_id,
        cell_operator_id: this.selected_cell_operator,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
        ticket_status_id: 1, //open
        source_id: this.selected_ticket.id,
        source_name: this.selected_ticket[0].app.key,
        category: this.category,
        subject: this.subject,
        description: this.description,
        open_at: this.date,
        attachment: this.attachment,
        source_data: JSON.stringify(this.selected_ticket),
      };

      for (let key in this.form_create) {
        if (Object.hasOwnProperty.call(this.form_create, key)) {
          data.append(key, this.form_create[key]);
        }
      }

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/ticket/create`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          if (result.error == true) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
          } else {
            this.dialog = false;
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
            this.initialize();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectOpsel() {
      return this.selected_opsel;
    },
    resetFilter() {
      this.selected_opsel = [];
      this.selected_sort = "desc";
      this.selected_service = "";
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: 10,
        page: 1,
        sort: "desc",
        search: "",
        service: "",
        source: "",
        cell_operator_ids: this.computedListOperator,
      };
      this.getMontelData(payload);
    },
    submitFilterMontel() {
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: this.pagination.rowsPerPage,
        page: 1,
        sort: this.selected_sort,
        search: this.search,
        service: this.selected_service,
        source: "",
        cell_operator_ids: this.computedListOperator,
      };
      this.loading = true;

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/montel`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          // console.log(response);
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            this.results = [];
            this.pagination.page = 1;
            this.pagination.totalItems = 0;
            this.loading = false;
            return;
          } else {
            this.results = result.data.data;
            this.data_download = [];
            result.data.data.forEach((item, index) => {
              this.data_download.push({
                no: index + 1,
                date: item.post_at,
                source: item.source,
                account: item.account,
                content: item.content,
                sentimen: item.sentimen,
                service: item.service,
                complaint: item.complaint,
              });
            });
            this.pagination.page = 1;
            this.pagination.totalItems = result.data.pagination.total_page;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.$store.dispatch("getOpselFo").then(() => this.initialize());
  },
  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();

    this.date_1 = moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss");
    this.date_2 = moment().format("YYYY-MM-DD HH:mm:ss");
    this.start_time_picker = moment(this.date_open).utc().format("HH:mm:ss");
  },
};
