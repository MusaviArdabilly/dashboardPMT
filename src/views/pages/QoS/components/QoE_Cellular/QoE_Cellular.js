import JwtService from "../../../../../services/jwt.services";
import moment from "moment";
import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../../../../store/modules/location.module";
import {
  GET_AVG_SPEED_TEST,
  GET_AVG_WEB_TEST,
  GET_AVG_VIDEO_TEST,
  GET_AVG_RATING,
  SET_LOADING_AVG_SPEED,
  SET_LOADING_AVG_WEB,
  SET_LOADING_AVG_VIDEO,
  SET_LOADING_AVG_RATING,
} from "../../../../../store/modules/qoe.module";

export default {
  data() {
    return {
      pmt_url: process.env.VUE_APP_API_URL,
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
      dateCurrent: "",
      dateThreeMonths: "",
      date_picker_1: false,
      date_picker_2: false,
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
    };
  },
  computed: {
    dateFilter: {
      //convert html standard datetime value into local time
      get() {
        return {
          startDate: moment(this.date.startDate)
            .locale("id-ID")
            .format("DD-MM-YYYY"),
          endDate: moment(this.date.endDate)
            .locale("id-ID")
            .format("DD-MM-YYYY"),
        };
      },
    },
    startDate: function () {
      return moment(this.date_3).format("DD-MM-YYYY");
    },
    endDate: function () {
      return moment(this.date_4).format("DD-MM-YYYY");
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
    avg_speed_test: function () {
      return this.$store.getters.avg_speed_test;
    },

    avg_video_test: function () {
      return this.$store.getters.avg_video_test;
    },

    avg_web_test: function () {
      return this.$store.getters.avg_web_test;
    },
    avg_rating: function () {
      return this.$store.getters.avg_rating;
    },
    loadingAvgWeb: function () {
      return this.$store.getters.loadingAvgWeb;
    },
    loadingAvgVideo: function () {
      return this.$store.getters.loadingAvgVideo;
    },
    loadingAvgSpeed: function () {
      return this.$store.getters.loadingAvgSpeed;
    },
    loadingAvgRating: function () {
      return this.$store.getters.loadingAvgRating;
    },
  },
  mounted() {
    this.user = JwtService.getUser();
    this.getCurrentDate();
    this.getThreeMontsAgoDate();
    this.initialize();
  },
  methods: {
    initialize() {
      // this.getQoS();
      const payload = {
        start_date: "",
        end_date: "",
        test_type: "",
        status: "active",
        network_type: 1,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      this.$store.commit(SET_LOADING_AVG_SPEED, true);
      this.$store.commit(SET_LOADING_AVG_VIDEO, true);
      this.$store.commit(SET_LOADING_AVG_WEB, true);
      this.$store.commit(SET_LOADING_AVG_RATING, true);
      this.getProvince();
      this.getAvgRating(payload);
      this.getAvgSpeed(payload);
      this.getAvgWeb(payload);
      this.getAvgVideo(payload);
    },

    getProvince() {
      this.$store.dispatch(GET_PROVINCE);
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
    applyFilterQoe() {
      if (this.date.default == true) {
        // this.$swal({
        //   title: this.$t("ui.message.date_range"),
        //   icon: "info",
        //   confirmButtonColor: "#134889",
        //   showConfirmButton: true,
        //   timer: 3000,
        // });
        this.$store.commit(SET_LOADING_AVG_SPEED, true);
        this.$store.commit(SET_LOADING_AVG_VIDEO, true);
        this.$store.commit(SET_LOADING_AVG_WEB, true);
        this.$store.commit(SET_LOADING_AVG_RATING, true);
        const data = {
          start_date: "",
          end_date: "",
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
      } else {
        this.$store.commit(SET_LOADING_AVG_SPEED, true);
        this.$store.commit(SET_LOADING_AVG_VIDEO, true);
        this.$store.commit(SET_LOADING_AVG_WEB, true);
        this.$store.commit(SET_LOADING_AVG_RATING, true);
        const data = {
          start_date: this.date.startDate,
          end_date: this.date.endDate,
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
      }
    },

    resetFilterQoe() {
      this.date.default = true;
      this.initialize();
    },
    getCurrentDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      this.date.endDate = yyyy + "-" + mm + "-" + dd;
      this.dateCurrent = yyyy + "-" + mm + "-" + dd;
    },
    getThreeMontsAgoDate() {
      this.date.startDate = moment().subtract(2, "month").format("YYYY-MM-DD");
      this.dateThreeMonths = moment().subtract(2, "month").format("YYYY-MM-DD");
    },
    getAvgRating(payload) {
      this.$store.dispatch(GET_AVG_RATING, payload);
    },

    getAvgSpeed(payload) {
      this.$store.dispatch(GET_AVG_SPEED_TEST, payload);
    },

    getAvgWeb(payload) {
      this.$store.dispatch(GET_AVG_WEB_TEST, payload);
    },

    getAvgVideo(payload) {
      this.$store.dispatch(GET_AVG_VIDEO_TEST, payload);
    },
    filterDate() {
      this.date.default = false;
    },
  },
};
