import JwtService from "../../../../services/jwt.services";
import NavbarBigScreen from "../../../../layouts/NavbarFull/NavbarBigScreen.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";
import Telkomsel from "../../../../assets/image/telkomsel-br_01.svg";
import Indosat from "../../../../assets/image/isat.svg";
import XL from "../../../../assets/image/xl.svg";
import Tri from "../../../../assets/image/3.svg";
import Smartfren from "../../../../assets/image/logo.svg";
import STI from "../../../../assets/image/sti1.svg";
import VueApexCharts from "vue-apexcharts";
import moment from "moment";
import { GET_OPSEL } from "../../../../store/modules/opsel.module";
import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../../../store/modules/location.module";
import {
  GET_AVG_SPEED_TEST,
  GET_AVG_WEB_TEST,
  GET_AVG_VIDEO_TEST,
  GET_START_DATE,
  GET_END_DATE,
  GET_AVG_RATING,
  // GET_SPEED_TEST,
} from "../../../../store/modules/qoe.module";

export default {
  components: {
    apexchart: VueApexCharts,
    NavbarBigScreen,
    NavigationCellAndFo,
  },
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    filter: {
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
    date_picker_1: false,
    date_picker_2: false,
    items: [
      {
        name: "PT Telekomunikasi Selular",
        logo: Telkomsel,
        data: [50, 100, 200],
        montel: [11, 8, 13],
        qoe: [26, 30, 62],
        qos: [110, 23, 62],
      },
      {
        name: "PT Indosat Ooredoo",
        logo: Indosat,
        data: [30, 150, 320],
        montel: [10, 50, 50],
        qoe: [10, 30, 150],
        qos: [10, 70, 120],
      },
      {
        name: "PT XL Axiata",
        logo: XL,
        data: [20, 10, 170],
        montel: [3, 3, 50],
        qoe: [15, 5, 70],
        qos: [2, 2, 50],
      },
      {
        name: "PT Hutchison 3 Indonesia",
        logo: Tri,
        data: [50, 10, 90],
        montel: [10, 3, 30],
        qoe: [30, 5, 30],
        qos: [10, 2, 30],
      },
      {
        name: "PT Smartfren Telecom",
        logo: Smartfren,
        data: [60, 260, 100],
        montel: [20, 50, 20],
        qoe: [20, 150, 30],
        qos: [20, 60, 50],
      },
      {
        name: "PT Sampoerna Telekomunikasi Indonesia (STI)",
        logo: STI,
        data: [70, 130, 120],
        montel: [20, 20, 40],
        qoe: [30, 50, 40],
        qos: [20, 60, 40],
      },
    ],
    series: [44, 55, 41, 17, 15],
    chartOptions: {
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                fontSize: "22px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
              value: {
                show: true,
                fontSize: "2em",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val;
                },
              },
            },
          },
        },
      },
      labels: ["Open ", "Follow Up ", "Closed "],
      legend: {
        show: true,
        position: "bottom",
        fontSize: "15px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 400,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.globals.seriesTotals[opts.seriesIndex];
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      colors: ["#F2C94C", "#27AE60", "#56CCF2"],
      noData: {
        text: "No Tickets Available",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#000",
          fontSize: "20px",
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },

    sourceOptions: {
      chart: {
        width: 500,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                fontSize: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
              value: {
                show: true,
                fontSize: "1.5em",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val;
                },
              },
            },
          },
        },
      },
      labels: ["Open ", "Follow Up ", "Closed "],
      legend: {
        show: true,
        position: "bottom",
        fontSize: "15px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 400,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.globals.seriesTotals[opts.seriesIndex];
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      colors: ["#F2C94C", "#27AE60", "#56CCF2"],
      noData: {
        text: "No Tickets Available",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#000",
          fontSize: "20px",
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },

    total_ticket: 0,
    ticket_summary: [],
  }),
  computed: {
    now() {
      return moment().format("DD/MM/YYYY - hh:mm:ss");
    },
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
        };
      },
    },

    start_date: function () {
      return this.$store.getters.start_date;
    },

    end_date: function () {
      return this.$store.getters.end_date;
    },

    item_province: function () {
      return this.$store.getters.item_province;
    },

    item_city: function () {
      return this.$store.getters.item_city;
    },

    item_district: function () {
      return this.$store.getters.item_district;
    },

    item_sub_district: function () {
      return this.$store.getters.item_sub_district;
    },

    opsel: function () {
      return this.$store.getters.getOpsel;
    },
  },
  methods: {
    initialize() {
      this.getOperatorCellular();

      this.getProvince();
      this.getAvgRating();
      this.getAvgSpeed();
      this.getAvgWeb();
      this.getAvgVideo();
    },

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

    async getSummaryByOperators() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_type: 0,
      };

      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/operators`,
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
          const arr = [];
          // SELF INVOKE ASYNC FUNC
          (async () => {
            for (let data of result.data) {
              let finalArray = data.data.map(({ count }) => count);

              for (let opsel of this.opsel) {
                if (data.name == opsel.name) {
                  let montelArray = [];
                  let qosArray = [];
                  let qoeArray = [];
                  // GET DATA SUMMARY QOE
                  await this.getQOESummary(opsel).then((result) => {
                    qoeArray = result;
                  });

                  // GET DATA SUMMARY MONTEL
                  await this.getMontelSummary(opsel).then((result) => {
                    montelArray = result;
                  });

                  // GET DATA SUMMARY QOS
                  await this.getQOSSummary(opsel).then((result) => {
                    qosArray = result;
                  });

                  // PUSH DATA
                  this.ticket_summary.push({
                    data: finalArray,
                    logo: opsel.logo,
                    name: opsel.name,
                    qoe: qoeArray,
                    montel: montelArray,
                    qos: qosArray,
                  });
                }
              }

              // this.ticket_summary.push({
              //   data: finalArray,
              //   logo: data.logo,
              //   name: data.name,
              // });
              //   console.log(this.ticket_summary);
            }
          })();

          this.total_ticket = arr.reduce((a, b) => a + b, 0);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getQOESummary(opsel) {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: opsel.id,
        app_id: 2,
      };

      return fetch(
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
          let qoeArray = result.data.map(({ count }) => count);
          return Promise.resolve(qoeArray);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getQOSSummary(opsel) {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: opsel.id,
        app_id: 3,
      };

      return fetch(
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
          let qosArray = result.data.map(({ count }) => count);
          return Promise.resolve(qosArray);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getMontelSummary(opsel) {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: opsel.id,
        app_id: 4,
      };

      return fetch(
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
          let montelArray = result.data.map(({ count }) => count);
          return Promise.resolve(montelArray);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // getSummaryTicket(value) {
    //   console.log(this.opsel);
    //   for (let key in value) {
    //   }
    // },

    getProvince() {
      this.$store.dispatch(GET_PROVINCE);
    },

    // inputDate() {

    // },

    submitFilter() {
      if (this.filter.date.default == true) {
        this.$swal({
          title: this.$t("ui.message.date_range"),
          icon: "info",
          confirmButtonColor: "#134889",
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        this.$store.dispatch(GET_START_DATE, this.filter.date.startDate);
        this.$store.dispatch(GET_END_DATE, this.filter.date.endDate);
        this.ticket_summary = [];
        this.getSummaryByOperators();
        // const data = {
        //   limit: 100,
        //   page: 1,
        //   sort: "desc",
        //   start_date: this.start_date,
        //   end_date: this.end_date,
        //   cell_operator_id: 0,
        //   connection_type: "",
        // };

        // this.$store.dispatch(GET_SPEED_TEST, data);
      }
    },

    selectCity() {
      if (this.selected_province == this.province_selected) {
        this.$store.dispatch(GET_CITY, this.selected_province);
      } else {
        this.selected_city = 0;
        this.selected_district = 0;
        this.selected_sub_district = 0;
        this.$store.dispatch(GET_CITY, this.selected_province);
      }
    },

    selectDistrict() {
      this.$store.dispatch(GET_DISTRICT, this.selected_city);
    },

    selectSubDistrict() {
      this.$store.dispatch(GET_SUB_DISTRICT, this.selected_district);
    },

    applyFilter() {
      // const data = {
      //   start_date: this.start_date,
      //   end_date: this.end_date,
      //   test_type: "",
      //   status: "active",
      //   network_type: 1,
      //   connection_type: "",
      //   province_id: this.selected_province,
      //   city_id: this.selected_city,
      //   district_id: this.selected_district,
      //   sub_district_id: this.selected_sub_district,
      // };
      // this.$store.dispatch(GET_AVG_SPEED_TEST, data);
      // this.$store.dispatch(GET_AVG_WEB_TEST, data);
      // this.$store.dispatch(GET_AVG_VIDEO_TEST, data);
      // this.$store.dispatch(GET_AVG_RATING, data);
    },

    resetFilter() {
      this.filter.date.default = true;

      this.selected_province = 0;
      this.selected_city = 0;
      this.selected_district = 0;
      this.selected_sub_district = 0;

      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        test_type: "",
        status: "active",
        network_type: 1,
        connection_type: "",
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
      };

      this.$store.dispatch(GET_AVG_SPEED_TEST, data);

      this.$store.dispatch(GET_AVG_WEB_TEST, data);

      this.$store.dispatch(GET_AVG_VIDEO_TEST, data);

      this.$store.dispatch(GET_AVG_RATING, data);
    },

    filterDate() {
      this.filter.date.default = false;
    },
  },

  mounted() {
    this.getSummaryByOperators();
  },

  created() {
    this.user_token = JwtService.getToken();
    console.log(this.start_date, this.end_date);
    this.initialize();
  },
};
