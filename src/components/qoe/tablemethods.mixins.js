import moment from "moment";
import {
  GET_SPEED_TEST,
  GET_VIDEO_TEST,
  GET_WEB_TEST,
  GET_RATING,
} from "../../store/modules/qoe.module.js";

export const mixinsTableMethodQoe = {
  data() {
    return {
      speedFields: {
        ISP: "cell_operator.name",
        "CONNECTION TYPE": "connection_type",
        DL: "download_speed",
        UL: "upload_speed",
        PING: "ping",
        JITTER: "jitter",
        LOSS: "loss",
        "SIGNAL STERNGTH": "signal_strength",
        PROVINCE: "province.name",
        CITY: "city.name",
        DISTRICT: "district.name",
        "SUB DISTRICT": "sub_district.name",
        TIMESTAMP: "test_at",
        NAME: "user_information.name",
        DEVICE: "user_information.device",
        LATITUDE: "user_information.full_address.latitude",
        LONGITUDE: "user_information.full_address.longitude",
        "IP ADDRESS": "user_information.ip",
      },
      videoFields: {
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
      webFields: {
        ISP: "cell_operator.name",
        "CONNECTION TYPE": "connection_type",
        "SIGNAL STERNGTH": "signal_strength",
        URL: "url",
        THROUGHPUT: "throughput",
        "LOADING TIME": "loading_time",
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
      ratingFields: {
        ISP: "cell_operator.name",
        RATING: "rating",
        "CONNECTION TYPE": "connection_type",
        "TEST TYPE": "test_type",
        PROVINCE: "province.name",
        CITY: "city.name",
        DISTRICT: "district.name",
        "SUB DISTRICT": "sub_district.name",
        TIMESTAMP: "rating_at",
      },
      whileDownload: false,
    };
  },
  computed: {
    directToMap() {
      return this.$store.getters.settingByName.value;
    },
  },
  methods: {
    timeFilter(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    excelFields(value) {
      if (value === "speed") {
        return this.speedFields;
      } else if (value === "video") {
        return this.videoFields;
      } else if (value === "web") {
        return this.webFields;
      } else if (value === "rating") {
        return this.ratingFields;
      }
    },
    async fetchSpeedCell() {
      let data = [];
      const payload = {
        cell_operator_type: this.typeCell,
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        threshold: this.filter.status.toString(),
        download: this.filter.download.toString(),
      };
      await this.$store.dispatch(GET_SPEED_TEST, payload).then((result) => {
        data = result.data.data;
      });
      return data;
    },
    async fetchSpeedFO() {
      let data = [];
      const payload = {
        cell_operator_type: this.typeCell,
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.selected_opsel,
        threshold: this.selected_status.toString(),
        download: this.download,
      };
      await this.$store.dispatch(GET_SPEED_TEST, payload).then((result) => {
        data = result.data.data;
        // console.log(result);
      });
      return data;
    },
    async fetchVideoCell() {
      let data = [];
      const payload = {
        cell_operator_type: this.typeCell,
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        threshold: this.filter.status.toString(),
        throughput: this.filter.throughput.toString(),
      };
      await this.$store.dispatch(GET_VIDEO_TEST, payload).then((result) => {
        data = result.data.data;
      });
      return data;
    },
    async fetchVideoFO() {
      let data = [];
      const payload = {
        cell_operator_type: this.typeCell,
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.selected_opsel,
        threshold: this.selected_status.toString(),
        throughput: this.throughput.toString(),
      };
      await this.$store.dispatch(GET_VIDEO_TEST, payload).then((result) => {
        data = result.data.data;
      });
      return data;
    },
    async fetchWebCell() {
      let data = [];
      const payload = {
        cell_operator_type: this.typeCell,
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        threshold: this.filter.status.toString(),
        throughput: this.filter.throughput.toString(),
      };
      await this.$store.dispatch(GET_WEB_TEST, payload).then((result) => {
        data = result.data.data;
      });
      return data;
    },
    async fetchWebFO() {
      let data = [];
      const payload = {
        cell_operator_type: this.typeCell,
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_id: this.selected_opsel,
        threshold: this.selected_status.toString(),
        throughput: this.throughput.toString(),
      };
      await this.$store.dispatch(GET_WEB_TEST, payload).then((result) => {
        data = result.data.data;
      });
      return data;
    },
    async fetchRatingCell() {
      let data = [];
      const payload = {
        limit: -1,
        page: 1,
        sort: this.sort,
        start_date: this.filter.date.startDate,
        end_date: this.filter.date.endDate,
        cell_operator_type: this.typeCell,
        cell_operator_id: this.filter.sort_cell_operator,
        connection_type: this.filter.technology,
        test_type: this.filter.status,
      };
      await this.$store.dispatch(GET_RATING, payload).then((result) => {
        data = result.data.data;
      });
      return data;
    },
    startDownload() {
      this.whileDownload = true;
    },
    finishDownload() {
      this.whileDownload = false;
    },
  },
  mounted() {
    const name = {
      name: "route_map",
    };
    this.$store.dispatch("getSettingsByName", name);
  },
};
