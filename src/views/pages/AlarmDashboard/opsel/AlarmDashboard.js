import moment from "moment";

import VueApexCharts from "vue-apexcharts";
import JwtService from "../../../../services/jwt.services";
import { GET_OPSEL } from "../../../../store/modules/opsel.module";
import {
  GET_START_DATE,
  GET_END_DATE,
} from "../../../../store/modules/qoe.module";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

// import AlarmTrendChart from "../../components/alarm_dashboard/AlarmTrendChart.vue";

// import NavBar from "../../components/dashboard/NavBar.vue";
// import DonutChart from "../../components/alarm_dashboard/DonutChart.vue";
export default {
  components: {
    apexchart: VueApexCharts,
    NavigationCellAndFo,
    // AlarmTrendChart,
  },
  data: () => ({
    alarm_modal: false,
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

    selected_opcell: 0,
    selected_opsel: [],
    onboarding: 0,
    onboarding_critical: 0,
    length: 2,
    length_critical: 2,

    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
    chartOptions: null,
    disabled_next: false,
    disabled_prev: true,
    disabled_next_critical: false,
    disabled_prev_crititcal: true,

    major: [],
    critical: [],
    minor: [],
    selected_alarm: 1,
    first_item: [],
    sec_item: [],
    first_item_critical: [],
    sec_item_critical: [],
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
        };
      },
    },
    start_date: function () {
      return this.$store.getters.start_date;
    },
    optionsCritical() {
      return this.$store.getters.optionsChartsCritical;
    },
    optionsMajor() {
      return this.$store.getters.optionsChartsMajor;
    },
    optionsMinor() {
      return this.$store.getters.optionsChartsMinor;
    },
    end_date: function () {
      return this.$store.getters.end_date;
    },

    opsel: function () {
      return this.$store.getters.getOpsel;
    },
  },

  methods: {
    initialize() {
      for (let data of this.opsel) {
        this.getAlarmMajor(data);
        this.getAlarmCritical(data);
        this.getAlarmMinor(data);
      }
    },

    getAlarmMajor(opsel) {
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
        start_date: this.start_date,
        end_date: this.end_date,
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
          this.major.push({
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
        start_date: this.start_date,
        end_date: this.end_date,
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
          this.critical.push({
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
        start_date: this.start_date,
        end_date: this.end_date,
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
          this.minor.push({
            opsel: opsel,
            data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

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
        this.critical = [];
        this.major = [];
        this.minor = [];
        this.initialize();
      }
    },

    resetFilter() {
      this.filter.date.default = true;

      this.$store.dispatch(GET_START_DATE, "");
      this.$store.dispatch(GET_END_DATE, "");
      this.critical = [];
      this.major = [];
      this.minor = [];
      this.initialize();
    },

    next() {
      this.onboarding =
        this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;

      if (this.onboarding == 1) {
        this.disabled_prev = false;
        this.disabled_next = true;
      }

      for (let value of this.alarm_severity) {
        value.items = this.sec_item;
      }
    },

    // prev() {
    //   let index =
    //     this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;

    //   if (this.onboarding == 0) {
    //     this.disabled_prev = true;
    //     this.disabled_next = false;
    //   }

    //   for (let value of this.alarm_severity) {
    //     value.items = this.first_item;
    //   }
    // },

    next_critical() {
      this.onboarding_critical =
        this.onboarding_critical + 1 === this.length_critical
          ? 0
          : this.onboarding_critical + 1;

      if (this.onboarding_critical == 1) {
        this.disabled_prev_crititcal = false;
        this.disabled_next_critical = true;
      }

      for (let value of this.alarm_major) {
        value.items = this.sec_item_critical;
      }
    },

    // prev_critical() {
    //   let index =
    //     this.onboarding_critical - 1 < 0
    //       ? this.length_critical - 1
    //       : this.onboarding_critical - 1;
    //   // index = index - 1 < 0 ? this.length_critical - 1 : index - 1;
    //   if (this.onboarding_critical == 0) {
    //     this.disabled_prev_crititcal = true;
    //     this.disabled_next_critical = false;
    //   }

    //   for (let value of this.alarm_major) {
    //     value.items = this.first_item_critical;
    //   }
    // },

    divideArray() {
      const middleIndex = Math.ceil(this.major.length / 2);
      this.first_item = this.major.splice(0, middleIndex);
      this.sec_item = this.major.splice(-middleIndex);

      for (let value of this.alarm_major) {
        this.first_item_critical = value.items;
        this.sec_item_critical = value.items.splice(3);
        value.items = this.first_item_critical;
      }
    },

    checkIsItemDisabled(item) {
      return item.id === 0;
    },

    selectOpsel() {
      // console.log(value);
    },

    seeDetails(val) {
      this.$router.push({ name: "details", params: val });
    },
    filterDate() {
      this.filter.date.default = false;
    },
  },
  mounted() {
    this.getOperatorCellular();

    setTimeout(() => {
      this.initialize();
    }, 1000);
  },

  created() {
    this.user_token = JwtService.getToken();
  },
};
