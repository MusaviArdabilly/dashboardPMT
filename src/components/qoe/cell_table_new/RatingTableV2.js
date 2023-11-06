import moment from "moment";
import { jsPDF } from "jspdf";
import { GET_RATING } from "../../../store/modules/qoe.module.js";
import { GET_OPSEL } from "../../../store/modules/opsel.module.js";
import JwtService from "../../../services/jwt.services.js";
import { mixinsTableMethodQoe } from "../tablemethods.mixins.js";
export default {
  mixins: [mixinsTableMethodQoe],
  data: () => ({
    user: null,
    loading_overlay: false,
    dialog: false,
    menu: false,
    app_name: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),

    selected_status: "",
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
      { text: "RATING", value: "rating", sortable: false },
      {
        text: "Connection Type",
        value: "connection_type",
        sortable: false,
      },
      { text: "TEST TYPE", value: "test_type", sortable: false },
      { text: "PROVINCE", value: "province.name", sortable: false },
      { text: "CITY", value: "city.name", sortable: false },
      { text: "DISTRICT", value: "district.name", sortable: false },
      {
        text: "SUB DISTRICT",
        value: "sub_district.name",
        sortable: false,
      },
      { text: "Timestamp", value: "rating_at", sortable: false },
    ],
    threshold: 0,
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
      status: "",
    },
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
              id: "",
              name: "All Test Type",
            },
            {
              id: "speedtest",
              name: "Speed Test",
            },
            {
              id: "webtest",
              name: "Web Test",
            },
            {
              id: "videotest",
              name: "Video Test",
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

    rating: function () {
      return this.$store.getters.rating;
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
      if (this.selected.length != this.rating.length - this.disabledCount) {
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
      this.getOperatorCellular();
      this.initData();
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
        cell_operator_type: this.typeCell,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        test_type: this.filter.status,
      };

      this.$store.dispatch(GET_RATING, data).then((result) => {
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
      this.selected_opsel = this.selected_opsel_temp;
      this.selected = [];

      const data = {
        limit: this.pagination.rowsPerPage,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_type: this.typeCell,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        test_type: this.filter.status,
      };

      this.$store.dispatch(GET_RATING, data).then((result) => {
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
      this.selected_opsel = this.selected_opsel_temp;
      this.selected = [];

      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_type: this.typeCell,

        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        test_type: this.filter.status,
      };

      this.$store.dispatch(GET_RATING, data).then((result) => {
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
      this.filter.status = "";
      this.pagination.page = 1;

      this.initData();
    },

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

    createPDF() {
      const doc = new jsPDF();

      doc.text("Format Sample Dashboard PMT!", 10, 10);
      doc.save("rating.pdf");
    },

    setupCreateTicket() {
      this.dialog = true;
      this.app_name = this.selected[0].app.name;
      this.selected_cell_operator = this.selected[0].cell_operator_id;
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
            this.getRating();
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
          // console.log(result);
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
          // console.log(result);
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
          // console.log(result);
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
          // console.log(result);
          if (result.error == false) {
            this.sub_district = result.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.initialize();
  },
  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    // this.initialize();
  },
};
