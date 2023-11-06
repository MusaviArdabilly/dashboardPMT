import NavbarBigScreen from "../../../components/SummaryDashboard/NavbarBigScreen.vue";
import JwtService from "../../../services/jwt.services";
import moment from "moment";
import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../../store/modules/location.module";
import Telkomsel from "../../../assets/image/tsel.svg";
import Indosat from "../../../assets/image/indosat.svg";
import XL from "../../../assets/image/xl.svg";
import Tri from "../../../assets/image/3.svg";
import Smartfren from "../../../assets/image/smartfren.svg";
import STI from "../../../assets/image/sti.svg";
import TestResult from "../QoS/components/TestResult/TestResult.vue";
import BadSpot from "../QoS/components/BadSpot/BadSpot.vue";
import {
  GET_START_DATE,
  GET_END_DATE,
} from "../../../store/modules/qoe.module";

export default {
  components: { NavbarBigScreen },

  data: () => ({
    user: null,
    loadingAlarmList: false,
    pmt_url: process.env.VUE_APP_API_URL,
    alarm: [],
    date_1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    showDialog: false,
    items: [
      {
        logo: Telkomsel,
        name: "TSEL",
        progress: "87%",
        value: 87,
        color: "#74B8F6",
      },
      {
        logo: Indosat,
        name: "ISAT",
        progress: "75%",
        value: 75,
        color: "#74B8F6",
      },
      {
        logo: XL,
        name: "XL",
        progress: "70%",
        value: 70,
        color: "#74B8F6",
      },
      {
        logo: Tri,
        name: "H3I",
        progress: "63%",
        value: 63,
        color: "#27557E",
      },
      {
        logo: Smartfren,
        name: "FREN",
        progress: "50%",
        value: 50,
        color: "#27557E",
      },
      {
        logo: STI,
        name: "STI",
        progress: "45%",
        value: 45,
        color: "#27557E",
      },
    ],
    active_alarm: 0,
    province: [],
    city: [],
    district: [],
    sub_district: [],
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
    searchProvince: "",
    searchCity: "",
    searchDistrict: "",
    searchSubDistrict: "",
    selected_alarm: 1,
    alarm_severity: [
      {
        id: 1,
        name: "Critical",
      },
      {
        id: 2,
        name: "Major",
      },
    ],
    selected_detail: [],
    user_token: null,
    rowPerPage: [5, 10, 15, 20],
    pagination: {
      page: 1,
      rowsPerPage: 6,
      currentPage: 1,
      pageCount: 0,
      totalPage: 0,
    },
  }),

  computed: {
    startDate: function () {
      return moment(this.date_1).format("DD-MM-YYYY");
    },
    endDate: function () {
      return moment(this.date_2).format("DD-MM-YYYY");
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

    start_date: function () {
      return this.$store.getters.start_date;
    },

    end_date: function () {
      return this.$store.getters.end_date;
    },

    avg_speed_test: function () {
      return this.$store.getters.avg_speed_test;
    },

    avg_video_test: function () {
      return this.$store.getters.avg_video_test;
    },

    avg_web_test: function () {
      return this.$store.getters.avg_web_test;
    },

    province_selected: function () {
      return this.$store.getters.selected_province;
    },

    avg_rating: function () {
      return this.$store.getters.avg_rating;
    },
  },

  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },
  methods: {
    initialize() {
      this.getProvince();
      this.getAlarm();
    },

    getAlarm() {
      this.loadingAlarmList = true;
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.currentPage,
        sort: "desc",
        start_date: "",
        end_date: "",
        search: "",
        status: "unresolved",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: 0,
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
          this.loadingAlarmList = false;
          // console.log(result);
          this.active_alarm = result.data.active_alarm;
          this.alarm = result.data.data;
          this.pagination.totalPage = result.data.total_page;
          this.pagination.page = result.data.page;
          // console.log(this.alarm, "alarm");
          // console.log(this.active_alarm, "active alarm");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showDetail(value) {
      // console.log(value);
      this.showDialog = true;
      this.selected_detail = value;
    },

    changeComponent(value) {
      // console.log(value);
      if (value == "Bad Spot") {
        this.active_item = "Bad Spot";
        this.qos = BadSpot;
      } else {
        this.active_item = "Test Result";
        this.qos = TestResult;
      }

      // console.log(this.qos);
    },

    getProvince() {
      this.$store.dispatch(GET_PROVINCE);
    },

    inputDate() {
      this.start_date = this.date_1;
      this.end_date = this.date_2;
      this.$store.dispatch(GET_START_DATE, this.date_1);
      this.$store.dispatch(GET_END_DATE, this.date_2);
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
      // console.log(
      // 	this.selected_province,
      // 	this.selected_city,
      // 	this.selected_district,
      // 	this.selected_sub_district
      // );
      this.loadingAlarmList = true;
      const province = JSON.stringify([this.selected_province]);
      const city = JSON.stringify([this.selected_city]);
      const district = JSON.stringify([this.selected_district]);
      const sub_district = JSON.stringify([this.selected_sub_district]);

      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.currentPage,
        sort: "desc",
        start_date: "",
        end_date: "",
        search: "",
        status: "unresolved",
        province_id: province,
        city_id: city,
        district_id: district,
        sub_district_id: sub_district,
        cell_operator_id: 0,
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
          // console.log(result);
          this.loadingAlarmList = false;
          if (result.data == null) {
            this.active_alarm = 0;
            this.alarm = [];
          } else {
            this.active_alarm = result.data.active_alarm;
            this.alarm = result.data.data;
            this.pagination.totalPage = result.data.total_page;
            this.pagination.page = result.data.page;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    resetFilter() {
      this.selected_province = 0;
      this.selected_city = 0;
      this.selected_district = 0;
      this.selected_sub_district = 0;
      this.pagination.currentPage = 1;
      this.getAlarm();
    },

    nextPage(value) {
      const data = {
        limit: this.pagination.rowsPerPage,
        page: value,
        sort: "desc",
        start_date: "",
        end_date: "",
        search: "",
        status: "unresolved",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: 0,
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
          // console.log(result);
          this.alarm = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
