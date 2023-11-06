import { GET_OPSEL } from "../../../../store/modules/opsel.module";
import NavbarBigScreen from "../../../../layouts/NavbarFull/NavbarBigScreen.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

import Telkomsel from "../../../../assets/image/telkomsel-br_01.svg";
import Indosat from "../../../../assets/image/isat.svg";
import XL from "../../../../assets/image/xl.svg";
import Tri from "../../../../assets/image/3.svg";
import Smartfren from "../../../../assets/image/smartfren.svg";
import STI from "../../../../assets/image/sti1.svg";
import VueApexCharts from "vue-apexcharts";
import JwtServices from "../../../../services/jwt.services";

export default {
  components: {
    apexchart: VueApexCharts,
    NavbarBigScreen,
    NavigationCellAndFo,
  },

  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    onboarding: 0,
    timer: null,
    criticalOptions: {
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
      labels: ["Open ", "Cleared"],
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
      colors: ["#CB4F4F", "#EDC2C2"],

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

    majorOptions: {
      chart: {
        width: 100,
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
      labels: ["Open", "Cleared"],
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
      colors: ["#EA8426", "#F4E0CD"],

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

    minorOptions: {
      chart: {
        width: 100,
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
      labels: ["Open", "Cleared"],
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
      colors: ["#EA8426", "#F4E0CD"],

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

    alarm_severity: [
      {
        name: "PT Telekomunikasi Selular",
        logo: Telkomsel,
        major: [2, 4],
        critical: [2, 4],
        hardware: 2,
        transmission: 4,
        power_failure: 0,
      },
      {
        name: "PT Indosat Ooredoo",
        logo: Indosat,
        major: [4, 12],
        critical: [4, 12],
        hardware: 4,
        transmission: 12,
        power_failure: 0,
      },
      {
        name: "PT XL Axiata",
        logo: XL,
        major: [2, 1],
        critical: [2, 1],
        hardware: 2,
        transmission: 1,
        power_failure: 0,
      },
      {
        name: "PT Hutchison 3 Indonesia (Tri)",
        logo: Tri,
        major: [6, 8],
        critical: [6, 8],
        hardware: 6,
        transmission: 8,
        power_failure: 0,
      },
      {
        name: "PT Smartfren Telecom",
        logo: Smartfren,
        major: [0, 10],
        critical: [0, 10],
        hardware: 0,
        transmission: 10,
        power_failure: 0,
      },
      {
        name: "PT Sampoerna Telekomunikasi Indonesia (STI)",
        logo: STI,
        major: [10, 20],
        critical: [10, 20],
        hardware: 10,
        transmission: 20,
        power_failure: 0,
      },
    ],

    alarm_major: [],
    alarm_critical: [],
    alarm_minor: [],
    user_token: null,
    model: null,
  }),

  computed: {
    opsel: function () {
      return this.$store.getters.getOpsel;
    },
  },

  mounted() {
    this.startSlide();
    this.initialize();
  },

  created() {
    this.user_token = JwtServices.getToken();
    this.getOperatorCellular();
  },

  methods: {
    initialize() {
      setTimeout(() => {
        for (let data of this.opsel) {
          this.getAlarmMajor(data);
          this.getAlarmCritical(data);
          this.getAlarmMinor(data);
        }
      }, 1000);
    },

    getAlarmMajor(opsel) {
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
        start_date: "",
        end_date: "",
        search: "",
        status: "",
        severity: "Major",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: opsel.id,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          const data = result.data;
          this.alarm_major.push({
            opsel: opsel,
            data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAlarmCritical(opsel) {
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
        start_date: "",
        end_date: "",
        search: "",
        status: "",
        severity: "Critical",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: opsel.id,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          const data = result.data;
          this.alarm_critical.push({
            opsel: opsel,
            data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAlarmMinor(opsel) {
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
        start_date: "",
        end_date: "",
        search: "",
        status: "",
        severity: "Minor",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: opsel.id,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          const data = result.data;
          this.alarm_minor.push({
            opsel: opsel,
            data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // convertData() {
    //   for (let data of this.opsel) {
    //     if (data.name == this.alarm_major.opsel.name) {
    //     }
    //   }
    // },

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

    startSlide() {
      this.timer = setInterval(this.next, 3000);
    },

    next() {
      this.onboarding++;
      this.onboarding == 6 ? (this.onboarding = 0) : "";
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 < 0 ? this.opsel.length - 1 : this.onboarding - 1;
    },
  },
};
