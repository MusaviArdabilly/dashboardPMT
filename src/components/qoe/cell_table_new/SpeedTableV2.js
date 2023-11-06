import moment from "moment";
import JwtService from "../../../services/jwt.services.js";
import { GET_OPSEL } from "../../../store/modules/opsel.module.js";
import { GET_SPEED_TEST } from "../../../store/modules/qoe.module.js";
import { mixinsTableMethodQoe } from "../tablemethods.mixins.js";

export default {
  mixins: [mixinsTableMethodQoe],
  props: [],
  data: () => ({
    user: null,
    dialog: false,
    loading_overlay: false,
    menu: false,
    app_name: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
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
    form_create: {},
    singleSelect: true,
    selected: [],
    headers: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      {
        text: "Connection Type",
        value: "connection_type",
        sortable: false,
      },
      { text: "DL", value: "download_speed", sortable: false },
      { text: "UL", value: "upload_speed", sortable: false },
      { text: "PING", value: "latency", sortable: false },
      { text: "JITTER", value: "jitter", sortable: false },
      { text: "LOSS", value: "loss", sortable: false },
      {
        text: "Signal Strength",
        value: "signal_strength",
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
    editedIndex: -1,
    threshold: 0,
    //filter aggregation
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
      sort_cell_operator: 0,
      cell_operator: 0,
      technology: "",
      status: 1,
      download: "",
    },
    selected_opsel_temp: 0,
    selected_opsel: 0,
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
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8",
        },
      ],
    ],
    typeCell: 1,
    copyNotification: false,
  }),

  computed: {
    filterComputed: {
      //convert html standard datetime value into local time
      get() {
        return {
          technology: [
            {
              name: "All Technology",
              value: "",
            },
            {
              name: "2G",
              value: "2G",
            },
            {
              name: "3G",
              value: "3G",
            },
            {
              name: "4G",
              value: "4G",
            },
            {
              name: "Wi-fi",
              value: "Wi-fi",
            },
          ],
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
          cell_operator: this.$store.getters.item_opsel,
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
    opsel: function () {
      return this.$store.getters.getOpsel;
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

    speed_test: function () {
      return this.$store.getters.speed_test;
    },

    speed_threshold: function () {
      return this.$store.getters.speed_threshold;
    },

    speed_ss_threshold: function () {
      return this.$store.getters.speed_ss_threshold;
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
      if (this.selected.length != this.speed_test.length - this.disabledCount) {
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
    },
    // First load fetch
    initData() {
      this.selected_opsel = this.selected_opsel_temp;
      this.selected = [];

      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        threshold: this.filter.status.toString(),
        cell_operator_type: 1,
        download: "",
      };
      this.$store.dispatch(GET_SPEED_TEST, data).then((result) => {
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
        cell_operator_type: 1,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        threshold: this.filter.status.toString(),
        download: this.filter.download.toString(),
      };
      this.$store.dispatch(GET_SPEED_TEST, data).then((result) => {
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
      this.selected_opsel = this.filter.sort_cell_operator;
      this.selected = [];

      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.filter.sort_cell_operator,
        cell_operator_type: 1,
        connection_type: this.filter.technology,
        threshold: this.filter.status.toString(),
        download: this.filter.download.toString(),
      };
      this.$store.dispatch(GET_SPEED_TEST, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }
        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
      });
    },

    resetFilter() {
      this.filter.sort_cell_operator = 0;
      this.filter.technology = "";
      this.filter.status = 1;
      this.pagination.page = 1;

      this.initData();
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
      this.filter.cell_operator = this.selected[0].cell_operator_id;
    },

    createTicket() {
      let data = new FormData();

      // MAPPING DATA FOR CREATE
      this.form_create = {
        app_id: this.selected[0].app_id,
        cell_operator_id: this.filter.cell_operator,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
        ticket_status_id: 1, //open
        source_name: this.selected[0].app.key,
        category: this.category,
        subject: this.subject,
        description: this.description,
        open_at: this.date + " 00:00:00",
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
            this.initData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    viewDetail() {
      this.dialog = true;
    },

    row_threshold(item) {
      // console.log("Under", this.speed_threshold.value);

      if (
        item.download_speed < this.speed_threshold.value &&
        item.signal_strength >= this.speed_ss_threshold.value
      ) {
        return "red--text";
      }
    },

    createPDF() {
      let network_operator = "";
      let technology = this.filter.technology;
      let status = this.filter.status;

      // Check opsel
      for (const iterator of this.opsel) {
        if (this.selected_opsel == 0) {
          network_operator = "All";
          break;
        }

        if (this.selected_opsel == iterator.id) {
          network_operator = iterator.name;
        }
      }

      // Check technology
      if (this.filter.technology == "") {
        technology = "All";
      }

      // Check status
      switch (this.filter.status) {
        case 1:
          status = "All";
          break;
        case 2:
          status = "Above Threshold";
          break;
        case 3:
          status = "Below Threshold";
          break;

        default:
          break;
      }

      let items = [
        {
          isp: "PT Hutchison 3 Indonesia",
          connection: "4G",
          dl: "4.12",
          ul: "1.64",
          ping: "496",
          jitter: "164",
          loss: "0",
          signal_streght: "-104",
          province: "JAWA BARAT",
          city: "KOTA BANDUNG",
          district: "RANCASARI",
          subdistrict: "MANJAHLEGA",
          date: "2021-10-24 19:39:02",
        },
        {
          isp: "PT Hutchison 3 Indonesia",
          connection: "4G",
          dl: "4.12",
          ul: "1.64",
          ping: "496",
          jitter: "164",
          loss: "0",
          signal_streght: "-104",
          province: "JAWA BARAT",
          city: "KOTA BANDUNG",
          district: "RANCASARI",
          subdistrict: "MANJAHLEGA",
          date: "2021-10-24 19:39:02",
        },
      ];

      for (const iterator of this.speed_test) {
        let item = {
          isp: iterator.cell_operator.name,
          connection: iterator.connection_type,
          dl: iterator.download_speed.toString(),
          ul: iterator.upload_speed.toString(),
          ping: iterator.ping.toString(),
          jitter: iterator.jitter.toString(),
          loss: iterator.loss.toString(),
          signal_streght: iterator.signal_strength.toString(),
          province: iterator.province.name,
          city: iterator.city.name,
          district: iterator.district.name,
          subdistrict: iterator.sub_district.name,
          date: iterator.test_at,
        };

        items.push(item);
      }

      let data = {
        operator: network_operator,
        technology: technology,
        status: status,
        items: items,
      };

      const payload = {
        type: "qoe",
        data: JSON.stringify(data),
      };

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/pdf/generate`,
        {
          method: "POST",
          body: JSON.stringify(payload),
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
          // console.log("GENERATE PDF", result);
          if (result.error) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            return;
          }

          this.download(
            "qoe-download",
            `${process.env.VUE_APP_API_URL}${result.data}`
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },

    generateCSV() {},

    async download(id, href) {
      const link = document.createElement("a");
      link.id = id;
      link.href = href;
      link.target = "_blank";
      document.body.appendChild(link);

      document.getElementById(id).click();
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
    // console.log("GENERATE PDF", this.speed_test);
  },
};
