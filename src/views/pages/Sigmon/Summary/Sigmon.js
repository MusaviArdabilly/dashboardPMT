// import NavBar from "../dashboard/NavBar.vue";
import NavbarBigScreen from "../../../../layouts/NavbarFull/NavbarBigScreen.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

import moment from "moment";
import {
  GET_AVG_SPEED_TEST,
  GET_AVG_WEB_TEST,
  GET_AVG_VIDEO_TEST,
  GET_AVG_SPEED_TEST_BY_PROVINCE,
  GET_AVG_VIDEO_TEST_BY_PROVINCE,
  GET_AVG_WEB_TEST_BY_PROVINCE,
  GET_START_DATE,
  GET_END_DATE,
  CHANGE_SUMMARY,
} from "../../../../store/modules/qoe.module";
import { GET_PROVINCE } from "../../../../store/modules/location.module";

export default {
  components: { NavbarBigScreen, NavigationCellAndFo },
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
    searchProvince: "",
    page: 1,
    message: "hello world",
    date_picker_1: false,
    date_picker_2: false,
    selected_qoe: 0,
    selected_province: 0,

    qoe_item: [
      {
        id: 0,
        name: "Speed Test",
      },
      {
        id: 1,
        name: "Video Test",
      },
      {
        id: 2,
        name: "Web Test",
      },
      // {
      //   id: 3,
      //   name: "Rating",
      // },
    ],
    carousel_item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    onboarding: 0,
    timer: null,
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

    avg_speed_test_by_province: function () {
      return this.$store.getters.avg_speed_test_by_province;
    },

    province: function () {
      return this.$store.getters.province;
    },

    summary: function () {
      return this.$store.getters.summary;
    },

    summary_province: function () {
      return this.$store.getters.summary_province;
    },

    currentColor: function () {
      let color = null;
      for (var item of this.items) {
        if (item.value < 70) {
          console.log(item.value);
          color = "#27557E";
        }
        if (item.value > 70) {
          color = "#74B8F6";
        }
      }
      return color;
    },

    dataTest: function () {
      let data = null;
      for (var item of this.items) {
        console.log(item.data);
        data = item.data;
      }
      return data;
    },

    title: function () {
      return this.$store.getters.currentItem;
    },
  },

  methods: {
    startSlide() {
      this.timer = setInterval(this.next, 5000);
    },

    next() {
      this.onboarding++;
      this.onboarding == 34 ? (this.onboarding = 0) : "";
    },

    prev() {
      this.onboarding--;
    },

    getAvgSpeedTest() {
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

    getAvgWebTest() {
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

    getAvgVideoTest() {
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

    getProvince() {
      this.$store.dispatch(GET_PROVINCE);
    },

    getAvgSpeedTestByProvince() {
      console.log("masuk");
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        status: "active",
        network_type: 1,
        province_id: 0,
        connection_type: "",
      };

      this.$store.dispatch(GET_AVG_SPEED_TEST_BY_PROVINCE, data);
    },

    getAvgVideoTestByProvince() {
      console.log("masuk");
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        status: "active",
        network_type: 1,
        province_id: 0,
        connection_type: "",
      };

      this.$store.dispatch(GET_AVG_VIDEO_TEST_BY_PROVINCE, data);
    },

    getAvgWebTestByProvince() {
      console.log("masuk");
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        status: "active",
        network_type: 1,
        province_id: 0,
        connection_type: "",
      };

      this.$store.dispatch(GET_AVG_WEB_TEST_BY_PROVINCE, data);
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
        const data = {
          start_date: this.start_date,
          end_date: this.end_date,
          status: "active",
          network_type: 1,
          province_id: 0,
          connection_type: "",
        };
        switch (this.selected_qoe) {
          case 0:
            {
              this.$store.dispatch(GET_AVG_SPEED_TEST_BY_PROVINCE, data);
              this.$store.dispatch(GET_AVG_SPEED_TEST, data);
            }
            break;
          case 1:
            {
              this.$store.dispatch(GET_AVG_VIDEO_TEST_BY_PROVINCE, data);
              this.$store.dispatch(GET_AVG_VIDEO_TEST, data);
            }
            break;
          case 2:
            {
              this.$store.dispatch(GET_AVG_WEB_TEST_BY_PROVINCE, data);
              this.$store.dispatch(GET_AVG_WEB_TEST, data);
            }
            break;
        }
      }
    },
    filterDate() {
      this.filter.date.default = false;
      this.$store.dispatch(GET_START_DATE, this.filter.date.startDate);
      this.$store.dispatch(GET_END_DATE, this.filter.date.endDate);
    },

    selectCity() {
      console.log("masuk");
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        status: "active",
        network_type: 1,
        province_id: this.selected_province,
        connection_type: "",
      };
      switch (this.selected_qoe) {
        case 0:
          {
            this.$store.dispatch(GET_AVG_SPEED_TEST_BY_PROVINCE, data);
          }
          break;
        case 1:
          {
            this.$store.dispatch(GET_AVG_VIDEO_TEST_BY_PROVINCE, data);
          }
          break;
        case 2:
          {
            this.$store.dispatch(GET_AVG_WEB_TEST_BY_PROVINCE, data);
          }
          break;
      }
    },

    changeNational(value) {
      console.log(value);
      if (value == "") {
        this.selected_qoe = 0;
      }
      this.$store.dispatch(CHANGE_SUMMARY, this.selected_qoe);
    },
  },
  mounted() {
    this.startSlide();
  },

  created() {
    this.getAvgSpeedTest();
    this.getAvgWebTest();
    this.getAvgVideoTest();
    this.getProvince();
    this.getAvgSpeedTestByProvince();
    this.getAvgWebTestByProvince();
    this.getAvgVideoTestByProvince();
  },
};
