import moment from "moment";
import JwtService from "../../../services/jwt.services.js";
import { jsPDF } from "jspdf";
import { GET_OPSEL } from "../../../store/modules/opsel.module.js";
import { GET_VIDEO_TEST } from "../../../store/modules/qoe.module.js";
import { GET_OPSEL_FO } from "../../../store/modules/opsel.module.js";
import { mixinsTableMethodQoe } from "../tablemethods.mixins.js";

export default {
  mixins: [mixinsTableMethodQoe],
  props: ["dateEnd", "dateStart", "dateCurrent"],
  data: () => ({
    user: null,
    dialog: false,
    date_picker: false,
    loading_overlay: false,
    menu: false,
    app_name: "",
    dateThreeMonths: "",
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
    selected_status: 1,
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
    selected_opsel: 0,
    form_create: {},
    singleSelect: true,
    selected: [],
    headers: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      {
        text: "Signal Strength",
        value: "signal_strength",
        sortable: false,
      },
      { text: "Throughput", value: "throughput", sortable: false },
      { text: "Buffering", value: "buffering", sortable: false },
      { text: "Re Buffering", value: "re_buffering", sortable: false },
      {
        text: "Youtube ID",
        value: "video_information.video.id",
        sortable: false,
      },
      { text: "PROVINCE", value: "province.name", sortable: false },
      { text: "CITY", value: "city.name", sortable: false },
      { text: "DISTRICT", value: "district.name", sortable: false },
      {
        text: "SUB DISTRICT",
        value: "sub_district.name",
        sortable: false,
      },
      { text: "Timestamp", value: "test_at", sortable: false },
      {
        text: "Action",
        value: "user_information.full_address",
        sortable: false,
      },
    ],
    threshold: 1,
    throughput: "",
    filter: {
      picker: {
        datepicker1: false,
        datepicker2: false,
      },
      date: {
        startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        default: true,
        defaultText: "All Time",
      },
    },
    selected_opsel_temp: 0,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    status: [
      {
        id: 1,
        name: "All Status",
      },
      {
        id: 2,
        name: "Above Threshold",
      },
      {
        id: 3,
        name: "Below Threshold",
      },
    ],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    cell_operator_id: 0,
    connection_type: "",
    search: "",
    sort: "desc",
    expanded: [],
    disabledCount: 0,

    json_fields: {
      ISP: "cell_operator.name",
      "CONNECTION TYPE": "connection_type",
      "SIGNAL STERNGTH": "signal_strength",
      "YOUTUBE ID": "video_information.video.id",
      BUFFERING: "buffering",
      "RE BUFFERING": "re_buffering",
      THROUGHPUT: "throughput",
      PROVINCE: "province.name",
      CITY: "city.name",
      DISTRICT: "district.name",
      "SUB DISTRICT": "sub_district.name",
      TIMESTAMP: "test_at",
      NAME: "user_information.name",
      EMAIL: "user_information.email",
      DEVICE: "user_information.device",
      LATITUDE: "user_information.full_address.latitude",
      LONGITUDE: "user_information.full_address.longitude",
      "IP ADDRESS": "user_information.ip",
    },
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8",
        },
      ],
    ],
    typeCell: 2,
    copyNotification: false,
  }),

  computed: {
    filterComputed: {
      //convert html standard datetime value into local time
      get() {
        return {
          preview: {
            startDate: moment(this.filter.date.startDate)
              .locale("id-ID")
              .format("DD-MM-YYYY"),
            endDate: moment(this.filter.date.endDate)
              .locale("id-ID")
              .format("DD-MM-YYYY"),
          },
          threemonthago: moment().subtract(2, "month").format("YYYY-MM-DD"),
        };
      },
    },
    dateFilter: {
      //convert html standard datetime value into local time
      get() {
        return {
          date: moment(this.date).locale("id-ID").format("YYYY-MM-DD"),
        };
      },
    },
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },

    video_test: function () {
      return this.$store.getters.video_test;
    },

    loading: function () {
      return this.$store.getters.loading;
    },

    start_date: function () {
      return this.$store.getters.start_date;
    },

    end_date: function () {
      return this.$store.getters.end_date;
    },

    video_threshold: function () {
      return this.$store.getters.video_threshold;
    },
    video_ss_threshold: function () {
      return this.$store.getters.video_ss_threshold;
    },
  },
  watch: {
    dateStart: function () {
      this.getVideoTest();
    },
    dateEnd: function () {
      this.getVideoTest();
    },
  },

  filters: {
    moment: function (date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  methods: {
    selectAllToggle(props) {
      if (
        this.selected.length != 0 &&
        this.selected.length != props.items.length
      ) {
        this.selected = [];
        return;
      }

      if (this.selected.length != this.video_test.length - this.disabledCount) {
        this.selected = [];
        const self = this;
        props.items.forEach((item) => {
          if (!item.ticket_flag) {
            self.selected.push(item);
          }
        });
      } else this.selected = [];
    },
    expandedRow(value) {
      this.expanded.push(value);
    },
    initialize() {
      this.filter.date.startDate = this.filterComputed.threemonthago;
      this.initData();
      this.getOperatorCellular();
      this.getProvince();
      this.$store.dispatch(GET_OPSEL_FO);
    },
    // First load fetch
    initData() {
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        cell_operator_type: 2,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.selected_opsel,
        threshold: this.selected_status.toString(),
        throughput: this.throughput.toString(),
      };
      this.$store.dispatch(GET_VIDEO_TEST, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }

        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
      });
    },
    // Filtering data reset page to 1
    filterData() {
      const data = {
        limit: this.pagination.rowsPerPage,
        page: 1,
        sort: this.sort,
        cell_operator_type: 2,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.selected_opsel,
        threshold: this.selected_status.toString(),
        throughput: this.throughput.toString(),
      };
      this.$store.dispatch(GET_VIDEO_TEST, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }
        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
      });
    },
    // Submit function and pagination
    switchPagination() {
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        cell_operator_type: 2,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.selected_opsel,
        threshold: this.selected_status.toString(),
        throughput: this.throughput.toString(),
      };
      this.$store.dispatch(GET_VIDEO_TEST, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }
        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
      });
    },
    getCurrentDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();

      // this.dateCurrent = yyyy + "-" + mm + "-" + dd;
      this.date.endDate = yyyy + "-" + mm + "-" + dd;
    },
    getThreeMontsAgoDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + -2);
      const yyyy = today.getFullYear();

      // this.dateThreeMonths = yyyy + "-" + mm + "-" + dd;
      this.date.startDate = yyyy + "-" + mm + "-" + dd;
    },
    resetFilter() {
      this.selected_opsel = 0;
      this.selected_status = 1;
      this.pagination.page = 1;
      this.pagination.rowsPerPage = 10;
      this.getVideoTest();
    },

    getProvince() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/location/province`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
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
          // // console.log(result);
          if (result.error == false) {
            this.province = result.data.data;
            if (this.selected_province != 0) {
              this.getCity();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCity() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        province_id: this.selected_province,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          // // console.log(result);
          if (result.error == false) {
            this.city = result.data.data;

            if (this.selected_city != 0) {
              this.getDistrict();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDistrict() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        city_id: this.selected_city,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          // // console.log(result);
          if (result.error == false) {
            this.district = result.data.data;
            if (this.selected_district != 0) {
              this.getSubDistrict();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getSubDistrict() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        district_id: this.selected_district,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          // // console.log(result);
          if (result.error == false) {
            this.sub_district = result.data.data;
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

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

    setupCreateTicket() {
      this.dialog = true;
      this.app_name = this.selected[0].app.name;
      this.selected_cell_operator = this.selected[0].cell_operator_id;
      this.selected_province = this.selected[0].province_id;
      this.selected_city = this.selected[0].city_id;
      this.selected_district = this.selected[0].district_id;
      this.selected_sub_district = this.selected[0].sub_district_id;
    },

    createTicket() {
      let data = new FormData();
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      // MAPPING DATA FOR CREATE
      this.form_create = {
        app_id: this.selected[0].app_id,
        cell_operator_id: this.selected_cell_operator,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
        ticket_status_id: 1,
        source_name: this.selected[0].app.key,
        category: this.category,
        subject: this.subject,
        description: this.description,
        open_at: this.date + hour + minute + second,
        attachment: this.attachment,
        source_data: JSON.stringify(this.selected),
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
            this.resetFilter();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    row_threshold(item) {
      if (
        item.throughput < this.video_threshold.value &&
        item.signal_strength >= this.video_ss_threshold.value
      ) {
        return "red--text";
      }
    },

    createPDF() {
      const doc = new jsPDF();

      doc.text("Format Sample Dashboard PMT!", 10, 10);
      doc.save("video-test.pdf");
    },

    copyLatlong(item) {
      this.copyNotification = true;

      const lat = item.user_information.full_address.latitude;
      const long = item.user_information.full_address.longitude;
      const latlong = long + ", " + lat;
      navigator.clipboard.writeText(latlong);
    },
  },

  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};
