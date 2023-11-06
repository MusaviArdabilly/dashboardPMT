// Table
import SpeedTable from "../../../../components/qoe/fo_table/SpeedTable.vue";
import VideoTable from "../../../../components/qoe/fo_table//VideoTable.vue";
import WebTable from "../../../../components/qoe/fo_table/WebTable.vue";
// Cards
import SpeedTest from "./CardDialog/SpeedTest.vue";
import VideoTest from "./CardDialog/VideoTest.vue";
import WebTest from "./CardDialog/WebTest.vue";
// Vuex store
import {
  GET_AVG_SPEED_FO,
  GET_AVG_VIDEO_FO,
  GET_AVG_WEB_FO,
  SET_LOADING,
  SET_LOADING_AVG_SPEED,
  SET_LOADING_AVG_WEB,
  SET_LOADING_AVG_VIDEO,
} from "../../../../store/modules/qoe.fo.module";
import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../../../store/modules/location.module";
import { GET_OPSEL_FO } from "../../../../store/modules/opsel.module";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

import moment from "moment";
export default {
  components: {
    SpeedTest,
    VideoTest,
    WebTest,
    SpeedTable,
    VideoTable,
    WebTable,
    NavigationCellAndFo,
  },
  data() {
    return {
      isAlertShow: true,
      table: "SpeedTable",
      select_speed_test: "download",
      select_operator: 0,
      dialogSpeedTest: false,
      dialogWebTest: false,
      date_picker_1: false,
      date_picker_2: false,
      dialogVideoTest: false,
      selected_province: 0,
      selected_city: 0,
      selected_district: 0,
      selected_sub_district: 0,
      dateCurrent: "",
      dateThreeMonths: "",
      date: {
        startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
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
            .format("YYYY-MM-DD"),
          endDate: moment(this.date.endDate)
            .locale("id-ID")
            .format("YYYY-MM-DD"),
        };
      },
    },
    logo_url() {
      return process.env.VUE_APP_API_URL;
    },
    itemOperator() {
      return this.$store.getters.item_opselFo;
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
    colorList() {
      return this.$store.getters.colorList;
    },
    loading() {
      return this.$store.getters.foLoading;
    },
    loadingAvgSpeed() {
      return this.$store.getters.loadingAvgSpeed;
    },
    loadingAvgVideo() {
      return this.$store.getters.loadingAvgVideo;
    },
    loadingAvgWeb() {
      return this.$store.getters.loadingAvgWeb;
    },
    avgSpeedFoDownload() {
      return this.$store.getters.avgSpeedFoDownload;
    },
    avgSpeedFoUpload() {
      return this.$store.getters.avgSpeedFoUpload;
    },
    avgVideoFo() {
      return this.$store.getters.avgVideoFo;
    },
    avgWebFo() {
      return this.$store.getters.avgWebFo;
    },
  },

  methods: {
    intialize() {
      const dataSpeed = {
        start_date: this.dateThreeMonths,
        end_date: this.dateCurrent,
        status: "active",
        network_type: 2,
        search: "",
        sort: "avg_download_speed",
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
      };
      const dataAvg = {
        start_date: this.dateThreeMonths,
        end_date: this.dateCurrent,
        status: "active",
        network_type: 2,
        search: "",
        sort: "avg_throughput",
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
      };
      this.$store.commit(SET_LOADING, true);
      this.$store.commit(SET_LOADING_AVG_SPEED, true);
      this.$store.commit(SET_LOADING_AVG_VIDEO, true);
      this.$store.commit(SET_LOADING_AVG_WEB, true);

      this.$store.dispatch(GET_AVG_SPEED_FO, dataSpeed);
      this.$store.dispatch(GET_AVG_VIDEO_FO, dataAvg);
      this.$store.dispatch(GET_AVG_WEB_FO, dataAvg);
      this.$store.dispatch(GET_PROVINCE);
      this.$store.dispatch(GET_OPSEL_FO);
      this.$store.dispatch("allSettings");
    },
    applyFilter() {
      this.$store.commit(SET_LOADING, true);
      this.$store.commit(SET_LOADING_AVG_SPEED, true);
      this.$store.commit(SET_LOADING_AVG_VIDEO, true);
      this.$store.commit(SET_LOADING_AVG_WEB, true);
      if (this.select_operator !== 0 && this.select_operator !== undefined) {
        const payloadSpeed = {
          start_date: this.date.startDate,
          end_date: this.date.endDate,
          status: "active",
          network_type: 2,
          search: "",
          sort: "avg_download_speed",
          cell_operator_id: this.select_operator,
          province_id: this.selected_province,
          city_id: this.selected_city,
          district_id: this.selected_district,
          sub_district_id: this.selected_sub_district,
        };
        const payloadThroughput = {
          start_date: this.date.startDate,
          end_date: this.date.endDate,
          status: "active",
          network_type: 2,
          search: "",
          sort: "avg_throughput",
          cell_operator_id: this.select_operator,
          province_id: this.selected_province,
          city_id: this.selected_city,
          district_id: this.selected_district,
          sub_district_id: this.selected_sub_district,
        };

        this.$store.dispatch(GET_AVG_SPEED_FO, payloadSpeed);
        this.$store.dispatch(GET_AVG_WEB_FO, payloadThroughput);
        this.$store.dispatch(GET_AVG_VIDEO_FO, payloadThroughput);
      } else {
        const payloadSpeed = {
          start_date: this.date.startDate,
          end_date: this.date.endDate,
          status: "active",
          network_type: 2,
          search: "",
          sort: "avg_download_speed",
          province_id: this.selected_province,
          city_id: this.selected_city,
          district_id: this.selected_district,
          sub_district_id: this.selected_sub_district,
        };
        const payloadThroughput = {
          start_date: this.date.startDate,
          end_date: this.date.endDate,
          status: "active",
          network_type: 2,
          search: "",
          sort: "avg_throughput",
          province_id: this.selected_province,
          city_id: this.selected_city,
          district_id: this.selected_district,
          sub_district_id: this.selected_sub_district,
        };

        this.$store.dispatch(GET_AVG_SPEED_FO, payloadSpeed);
        this.$store.dispatch(GET_AVG_WEB_FO, payloadThroughput);
        this.$store.dispatch(GET_AVG_VIDEO_FO, payloadThroughput);
      }
    },
    applyByOperator() {
      this.$store.commit(SET_LOADING, true);
      const payloadSpeed = {
        start_date: this.date.startDate,
        end_date: this.date.endDate,
        status: "active",
        network_type: 2,
        search: "",
        sort: "avg_download_speed",
        cell_operator_id: this.select_operator,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
      };
      const payloadThroughput = {
        start_date: this.date.startDate,
        end_date: this.date.endDate,
        status: "active",
        network_type: 2,
        search: "",
        sort: "avg_throughput",
        cell_operator_id: this.select_operator,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
      };
      this.$store.commit(SET_LOADING_AVG_SPEED, true);
      this.$store.commit(SET_LOADING_AVG_VIDEO, true);
      this.$store.commit(SET_LOADING_AVG_WEB, true);
      this.$store.dispatch(GET_AVG_SPEED_FO, payloadSpeed);
      this.$store.dispatch(GET_AVG_WEB_FO, payloadThroughput);
      this.$store.dispatch(GET_AVG_VIDEO_FO, payloadThroughput);
    },
    resetFilter() {
      this.$store.commit(SET_LOADING, true);
      this.$store.commit(SET_LOADING_AVG_SPEED, true);
      this.$store.commit(SET_LOADING_AVG_VIDEO, true);
      this.$store.commit(SET_LOADING_AVG_WEB, true);
      this.select_operator = 0;
      this.selected_province = 0;
      this.selected_city = 0;
      this.selected_district = 0;
      this.selected_sub_district = 0;
      const payloadSpeed = {
        start_date: this.dateThreeMonths,
        end_date: this.dateCurrent,
        status: "active",
        network_type: 2,
        sort: "avg_download_speed",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      const payloadThroughput = {
        start_date: this.dateThreeMonths,
        end_date: this.dateCurrent,
        status: "active",
        network_type: 2,
        sort: "avg_throughput",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      this.$store.dispatch(GET_AVG_SPEED_FO, payloadSpeed);
      this.$store.dispatch(GET_AVG_WEB_FO, payloadThroughput);
      this.$store.dispatch(GET_AVG_VIDEO_FO, payloadThroughput);
    },
    changeSpeedTest() {
      if (this.select_speed_test === "download") {
        this.select_speed_test = "upload";
        return;
      }
      if (this.select_speed_test === "upload") {
        this.select_speed_test = "download";
        return;
      }
    },
    selectCity() {
      if (this.selected_province == 0) {
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
    avatarBackground(value) {
      let requestText = value.toLowerCase();
      let separateText = requestText.split("");
      let sum = 0;
      for (const i of separateText) {
        sum += requestText.charCodeAt(i);
      }
      const percentage = sum % this.colorList.length;
      return this.colorList[percentage];
    },

    getCurrentDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();

      this.dateCurrent = yyyy + "-" + mm + "-" + dd;
      this.date.endDate = yyyy + "-" + mm + "-" + dd;
    },
    getThreeMontsAgoDate() {
      this.dateThreeMonths = moment().subtract(2, "month").format("YYYY-MM-DD");
      this.date.startDate = moment().subtract(2, "month").format("YYYY-MM-DD");
    },
    changeTable(value) {
      // console.log(value);
      this.table = value;
    },
  },
  filters: {
    initial: function (value) {
      var str = value;
      var matches = str.match(/\b(\w)/g);
      var acronym = matches.join("");
      return acronym.slice(0, 2);
    },
  },
  created() {
    this.getCurrentDate();
    this.getThreeMontsAgoDate();
    this.intialize();
  },
};
