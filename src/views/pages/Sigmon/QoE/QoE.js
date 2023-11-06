import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// V1
// import SpeedTable from "../../components/qoe/SpeedTable.vue";
// import VideoTable from "../../components/qoe/VideoTable.vue";
// import WebTable from "../../components/qoe/WebTable.vue";
// import RatingTable from "../../components/qoe/RatingTable.vue";

// V2
import SpeedTable from "../../../../components/qoe/cell_table_new/SpeedTableV2.vue";
import VideoTable from "../../../../components/qoe/cell_table_new/VideoTableV2.vue";
import WebTable from "../../../../components/qoe/cell_table_new/WebTableV2.vue";
import RatingTable from "../../../../components/qoe/cell_table_new/RatingTableV2.vue";

import { ADD_ITEM } from "../../../../store/modules/mirroring.module";
import AvailabilityDeviceTable from "../../../../components/qoe/qoe_alarm/AvailabilityDeviceTable.vue";
// import AvailabilityAlarmTable from "../../components/qoe/qoe_alarm/AvailabilityAlarmTable.vue";
import AvailabilityAlarmTable from "../../../../components/qoe/qoe_alarm/AvailabilityAlarmTableV2.vue";
import FixedbroadBand from "../../FixedBroadband.vue";
import JwtService from "../../../../services/jwt.services";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../../../store/modules/location.module";
import {
  GET_START_DATE,
  GET_END_DATE,
  GET_AVG_SPEED_TEST,
  GET_AVG_WEB_TEST,
  GET_AVG_VIDEO_TEST,
  GET_AVG_RATING,
} from "../../../../store/modules/qoe.module";

export default {
  components: {
    SpeedTable,
    VideoTable,
    WebTable,
    RatingTable,
    AvailabilityDeviceTable,
    AvailabilityAlarmTable,
    FixedbroadBand,
    NavigationCellAndFo,
  },
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    isAlertShow: true,
    table: "SpeedTable",
    card_active: false,
    loading: false,
    opsel: [],
    user_token: null,
    data: [],
    video_data: [],
    rating_value: 4.5,
    web_data: [],
    rating: [],
    active_item: "Operator Cellular",
    show_opsel: true,
    show_fo: false,
    show_table: "AvailabilityDeviceTable",
    active_table: "Device",
    device: [],
    alarm: [],
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
    date_1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    selected_date: "",

    cell_operator_id: 0,
    connection_type: "",
    threshold: 0,
    summary_speed: [
      {
        avg_download_speed: 0,
        avg_upload_speed: 0,
        count: 0,
        id: 0,
        logo: "",
        name: "",
        value: 0,
      },
    ],
    summary_web: [],
    summary_video: [],
    screenshot: "",
    searchProvince: "",
    searchCity: "",
    searchDistrict: "",
    searchSubDistrict: "",
  }),

  computed: {
    startDate: function () {
      return `${moment(this.date_1).format("YYYY-MM-DD")}`;
    },
    endDate: function () {
      return `${moment(this.date_2).format("YYYY-MM-DD")}`;
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

  created() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.date_1 = moment().subtract(2, "month").format("YYYY-MM-DD");
    this.$store.dispatch(GET_START_DATE, this.date_1);
    this.$store.dispatch(GET_END_DATE, this.date_2);
    this.initialize();
  },

  methods: {
    async printScreen() {
      let el = this.$refs.qoereport;

      var svgElements = document.body.querySelectorAll("img");
      svgElements.forEach(function (item) {
        item.setAttribute("width", item.getBoundingClientRect().width);
        item.setAttribute("height", item.getBoundingClientRect().height);
        item.style.width = null;
        item.style.height = null;
      });

      this.screenshot = (
        await html2canvas(el, {
          scale: 2,
          onrendered: function (canvas) {
            var context = canvas.getContext("2d");
            context.scale(2, 2);
            context["imageSmoothingEnabled"] = false;
            context["mozImageSmoothingEnabled"] = false;
            context["oImageSmoothingEnabled"] = false;
            context["webkitImageSmoothingEnabled"] = false;
            context["msImageSmoothingEnabled"] = false;
          },
        })
      ).toDataURL();

      const doc = new jsPDF();
      doc.addImage(this.screenshot, "JPEG", 10, 10, 190, 120);
      doc.save("qoe.pdf");

      // var a = document.createElement("a"); //Create <a>
      // a.href = doc; //Image Base64 Goes here
      // a.download = "QOE Report.pdf"; //File name Here
      // a.click(); //Downloaded file
    },
    initialize() {
      this.getProvince();
      this.getAvgRating();
      this.getAvgSpeed();
      this.getAvgWeb();
      this.getAvgVideo();
    },
    changeTable(value) {
      console.log(value);
      this.table = value;
    },

    inputDate() {
      this.start_date = this.date_1;
      this.end_date = this.date_2;
      this.$store.dispatch(GET_START_DATE, this.date_1);
      this.$store.dispatch(GET_END_DATE, this.date_2);
    },

    submitFilter() {
      this.applyFilter();
    },

    selectCity() {
      console.log(this.selected_province, this.province_selected);
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

    getSpeedTestByTech(value) {
      this.connection_type = value;
      console.log(value);
      if (value != undefined) {
        this.loading = true;
        const data = {
          limit: 100,
          page: 1,
          sort: "desc",
          start_date: this.start_date,
          end_date: this.end_date,
          cell_operator_id: this.cell_operator_id,
          connection_type: this.connection_type,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/speedtest`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            this.data = result.data.data;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.loading = true;
        const data = {
          limit: 100,
          page: 1,
          sort: "desc",
          start_date: this.start_date,
          end_date: this.end_date,
          cell_operator_id: 0,
          connection_type: "",
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/speedtest`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            this.data = result.data.data;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    setItem(value) {
      console.log(value);
      this.$store.dispatch(ADD_ITEM, value);
    },

    changeComponent(value) {
      console.log(value);
      if (value == "Operator Cellular") {
        this.active_item = "Operator Cellular";
        this.show_opsel = true;
        this.show_fo = false;
      }
      if (value == "Fixed Broadband") {
        this.active_item = "Fixed Broadband";
        this.show_fo = true;
        this.show_opsel = false;
      }
    },

    setActive(value) {
      if (value == "Availability Device") {
        this.show_table = "AvailabilityDeviceTable";
        this.active_table = "Device";
      } else {
        this.show_table = "AvailabilityAlarmTable";
        this.active_table = "Alarm";
      }
    },

    getProvince() {
      this.$store.dispatch(GET_PROVINCE);
    },

    createPDF() {
      const doc = new jsPDF();

      doc.text("Format Sample Dashboard PMT!", 10, 10);
      doc.save("qoe.pdf");
    },

    getAvgRating() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        test_type: "",
        status: "active",
        network_type: 1,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };

      this.$store.dispatch(GET_AVG_RATING, data);
    },

    getAvgSpeed() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        test_type: "",
        status: "active",
        network_type: 1,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      this.$store.dispatch(GET_AVG_SPEED_TEST, data);
    },

    getAvgWeb() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        test_type: "",
        status: "active",
        network_type: 1,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      this.$store.dispatch(GET_AVG_WEB_TEST, data);
    },

    getAvgVideo() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        test_type: "",
        status: "active",
        network_type: 1,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      this.$store.dispatch(GET_AVG_VIDEO_TEST, data);
    },

    applyFilter() {
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

    resetFilter() {
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
  },
};
