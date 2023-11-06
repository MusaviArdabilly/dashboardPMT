<template>
  <div class="qoe">
    <div ref="qoereport">
      <div v-show="result_show">
        <v-row class="mt-5">
          <v-col lg="2">
            <v-autocomplete
              @input="selectCity"
              v-model="selected_province"
              :items="item_province"
              :search-input.sync="searchProvice"
              item-text="name"
              item-value="id"
              class="mx-4"
              flat
              hide-no-data
              hide-details
              dense
              :label="$t('ui.field.province')"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col lg="2">
            <v-autocomplete
              @input="selectDistrict"
              v-model="selected_city"
              :items="item_city"
              :search-input.sync="searchCity"
              item-text="name"
              item-value="id"
              class="mx-4"
              flat
              hide-no-data
              hide-details
              dense
              :label="$t('ui.field.city')"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col lg="2">
            <v-autocomplete
              @input="selectSubDistrict"
              v-model="selected_district"
              :items="item_district"
              :search-input.sync="searchDistrict"
              item-text="name"
              item-value="id"
              class="mx-4"
              flat
              hide-no-data
              hide-details
              dense
              :label="$t('ui.field.district')"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col lg="2">
            <v-autocomplete
              v-model="selected_sub_district"
              :items="item_sub_district"
              :search-input.sync="searchSubDistrict"
              item-text="name"
              item-value="id"
              class="mx-4"
              flat
              hide-no-data
              hide-details
              dense
              :label="$t('ui.field.sub_district')"
              outlined
            ></v-autocomplete>
          </v-col>

          <v-col lg="2">
            <v-btn
              elevation="0"
              class="mr-5 text-capitalize"
              color="primary"
              rounded
              >{{ $t("ui.button_apply") }}</v-btn
            >
            <v-btn elevation="0" class="text-capitalize" rounded color=""
              >Reset</v-btn
            >
          </v-col>

          <v-col lg="2">
            <v-btn
              width="100%"
              @click="printScreen"
              height="100%"
              style="color: #5e5873"
              color="white"
            >
              <div class="mr-2 text-capitalize">Export Data</div>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="3">
            <v-card height="100%">
              <div class="pa-5 d-flex">
                <div class="font-weight-bold">Speed Test (Mbps)</div>
                <v-spacer></v-spacer>
              </div>
              <v-divider></v-divider>
              <div class="pa-5">
                <v-row v-for="item in summary_speed" :key="item.index">
                  <v-col lg="2">
                    <img
                      width="100%"
                      :src="pmt_url + item.logo"
                      :alt="item.name"
                    />
                  </v-col>
                  <v-col lg="10">
                    <div class="d-flex">
                      <div class="text-lg-body-2 text-md-body-2">
                        {{ item.name }}
                      </div>
                      <v-spacer></v-spacer>
                      <div class="font-weight-bold">{{ item.progress }}</div>
                    </div>
                    <div class="d-flex mt-2">
                      <v-row>
                        <v-col cols="7">
                          <v-progress-linear
                            :value="item.value"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-4"
                          >
                            <div class="white--text font-weight-bold"></div>
                          </v-progress-linear>
                        </v-col>
                        <v-col cols="5" class="d-flex">
                          <div class="font-weight-bold mt-2">
                            {{ item.avg_download_speed }}
                          </div>
                          <div class="ml-2 mt-2">({{ item.count }})</div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
          <v-col lg="3">
            <v-card height="100%">
              <div class="pa-5 d-flex">
                <div class="font-weight-bold">Web Test (bps)</div>
                <v-spacer></v-spacer>
              </div>
              <v-divider></v-divider>
              <div class="pa-5">
                <v-row v-for="item in summary_web" :key="item.index">
                  <v-col lg="2">
                    <img
                      width="100%"
                      :src="pmt_url + item.logo"
                      :alt="item.name"
                    />
                  </v-col>
                  <v-col lg="10">
                    <div class="d-flex mt-2">
                      <div class="text-lg-body-2 text-md-body-2">
                        {{ item.name }}
                      </div>
                      <v-spacer></v-spacer>
                      <div class="font-weight-bold">{{ item.progress }}</div>
                    </div>
                    <div class="d-flex">
                      <v-row>
                        <v-col cols="7">
                          <v-progress-linear
                            :value="item.value"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-4"
                          >
                            <div class="white--text font-weight-bold"></div>
                          </v-progress-linear>
                        </v-col>
                        <v-col cols="5" class="d-flex">
                          <div class="font-weight-bold mt-2">
                            {{ item.avg_throughput }}
                          </div>
                          <div class="ml-2 mt-2">({{ item.count }})</div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
          <v-col lg="3">
            <v-card height="100%">
              <div class="pa-5 d-flex">
                <div class="font-weight-bold">Video Test (bps)</div>
                <v-spacer></v-spacer>
              </div>
              <v-divider></v-divider>
              <div class="pa-5">
                <v-row v-for="item in summary_video" :key="item.index">
                  <v-col lg="2">
                    <img
                      width="100%"
                      :src="pmt_url + item.logo"
                      :alt="item.name"
                    />
                  </v-col>
                  <v-col lg="10">
                    <div class="d-flex">
                      <div class="text-lg-body-2 text-md-body-2">
                        {{ item.name }}
                      </div>
                      <v-spacer></v-spacer>
                      <div class="font-weight-bold">{{ item.progress }}</div>
                    </div>
                    <div class="d-flex mt-2">
                      <v-row>
                        <v-col cols="7">
                          <v-progress-linear
                            :value="item.value"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-4"
                          >
                            <div class="white--text font-weight-bold"></div>
                          </v-progress-linear>
                        </v-col>
                        <v-col cols="5" class="d-flex">
                          <div class="font-weight-bold mt-2">
                            {{ item.avg_throughput }}
                          </div>
                          <div class="ml-2 mt-2">({{ item.count }})</div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
          <v-col lg="3">
            <v-card>
              <div class="pa-5 d-flex">
                <div class="font-weight-bold">Rating</div>
                <v-spacer></v-spacer>
              </div>
              <v-divider></v-divider>
              <div class="pa-5">
                <v-row v-for="item in summary_rating" :key="item.index">
                  <v-col lg="2">
                    <img
                      width="100%"
                      :src="pmt_url + item.logo"
                      :alt="item.name"
                    />
                  </v-col>
                  <v-col lg="10">
                    <div class="d-flex">
                      <div class="text-lg-body-2 text-md-body-2">
                        {{ item.name }}
                      </div>
                      <v-spacer></v-spacer>
                      <div class="font-weight-bold">{{ item.progress }}</div>
                    </div>
                    <div class="d-flex">
                      <v-rating
                        v-model="item.rating"
                        color="yellow darken-3"
                        background-color="yellow darken-3"
                        half-increments
                      ></v-rating>
                      <div class="rating-value font-weight-bold mr-2">
                        ({{ item.rating }})
                      </div>
                      <div class="rating-value mr-2">({{ item.count }})</div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row class="mt-15">
      <v-col lg="3">
        <v-card
          @click="changeTable('SpeedTable')"
          :class="[
            'pa-5 card-test d-flex',
            table == 'SpeedTable' ? 'active-card' : '',
          ]"
        >
          <v-icon
            size="40"
            :color="table == 'SpeedTable' ? '#169CD6' : '#5E5873'"
            >mdi-gauge</v-icon
          >
          <div class="ml-5 mt-2">Speed test</div>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card
          @click="changeTable('VideoTable')"
          :class="[
            'pa-5 card-test d-flex',
            table == 'VideoTable' ? 'active-card' : '',
          ]"
        >
          <v-icon
            size="40"
            :color="table == 'VideoTable' ? '#169CD6' : '#5E5873'"
            >mdi-television-play</v-icon
          >
          <div class="mt-2 ml-5">Video test</div>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card
          @click="changeTable('WebTable')"
          :class="[
            'pa-5 card-test d-flex',
            table == 'WebTable' ? 'active-card' : '',
          ]"
        >
          <v-icon size="40" :color="table == 'WebTable' ? '#169CD6' : '#5E5873'"
            >mdi-web</v-icon
          >
          <div class="ml-5 mt-2">Web test</div>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card
          @click="changeTable('RatingTable')"
          :class="[
            'pa-5 card-test d-flex',
            table == 'RatingTable' ? 'active-card' : '',
          ]"
        >
          <v-icon
            size="40"
            :color="table == 'RatingTable' ? '#169CD6' : '#5E5873'"
            >mdi-star</v-icon
          >
          <div class="ml-5 mt-2">Rating</div>
        </v-card>
      </v-col>
    </v-row>
    <div class="mt-15">
      <component :is="table" />
    </div>

    <div v-show="alarm_show">
      <v-row class="mt-5">
        <v-col cols="2">
          <v-card
            @click="setActive('Availability Device')"
            :class="[
              `pa-5 d-flex`,
              active_table == `Device` ? 'active-btn' : '',
            ]"
          >
            <v-icon
              :color="active_table == 'Device' ? '#FFFFFF' : '#000000'"
              class="mr-5"
              >mdi-cellphone</v-icon
            >
            <div>Availability Device</div>
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-card
            @click="setActive('Availability Alarm')"
            :class="[
              `pa-5 d-flex`,
              active_table == `Alarm` ? 'active-btn' : '',
            ]"
          >
            <v-icon
              :color="active_table == 'Alarm' ? '#FFFFFF' : '#000000'"
              class="mr-5"
              >mdi-alarm-light-outline</v-icon
            >
            <div>Availability Alarm</div>
          </v-card>
        </v-col>
      </v-row>
      <component :is="show_table" :data="device" :alarm="alarm" class="mt-10" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SpeedTable from "../../components/qoe/cell_table/SpeedTable.vue";
import VideoTable from "../../components/qoe/cell_table/VideoTable.vue";
import WebTable from "../../components/qoe/cell_table/WebTable.vue";
import RatingTable from "../../components/qoe/cell_table/RatingTable.vue";
import { ADD_ITEM } from "../../store/modules/mirroring.module";
import AvailabilityDeviceTable from "../../components/qoe/qoe_alarm/AvailabilityDeviceTable.vue";
// import AvailabilityAlarmTable from "../../components/qoe/qoe_alarm/AvailabilityAlarmTable.vue";
import AvailabilityAlarmTable from "../../components/qoe/qoe_alarm/AvailabilityAlarmTableV2.vue";
import JwtService from "../../services/jwt.services";
import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../store/modules/location.module";
import {
  GET_START_DATE,
  GET_END_DATE,
  GET_SPEED_TEST,
} from "../../store/modules/qoe.module";

export default {
  components: {
    SpeedTable,
    VideoTable,
    WebTable,
    RatingTable,
    AvailabilityDeviceTable,
    AvailabilityAlarmTable,
  },
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
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
    result_show: true,
    alarm_show: false,
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
    summary_rating: [],
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
  },

  created() {
    this.user_token = JwtService.getToken();
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
      const data = {
        limit: 100,
        page: 1,
        sort: "desc",
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: 0,
        connection_type: "",
      };

      this.$store.dispatch(GET_SPEED_TEST, data);
    },

    selectCity() {
      this.$store.dispatch(GET_CITY, this.selected_province);
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
      if (value == "Operator Cellular") {
        this.active_item = "Operator Cellular";
        this.result_show = true;
        this.alarm_show = false;
      } else {
        this.active_item = "Fixed Broadband";
        this.alarm_show = true;
        this.result_show = false;
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
        start_date: "",
        end_date: "",
        test_type: "",
        status: "active",
        network_type: 2,
      };
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-rating`,
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
          this.sortRating(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAvgSpeed() {
      const data = {
        start_date: "",
        end_date: "",
        test_type: "",
        status: "active",
        network_type: 2,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-speed`,
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
          this.sortValue(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAvgWeb() {
      const data = {
        start_date: "",
        end_date: "",
        test_type: "",
        status: "active",
        network_type: 2,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-web`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.sortWeb(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAvgVideo() {
      const data = {
        start_date: "",
        end_date: "",
        test_type: "",
        status: "active",
        network_type: 2,
        connection_type: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-video`,
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
          this.sortVideo(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    sortValue(value) {
      console.log(value);

      let arr = [];

      for (let item of value) {
        arr.push(item.avg_download_speed);
      }

      let max = Math.max(...arr);

      value.sort(function (a, b) {
        return b.avg_download_speed - a.avg_download_speed;
      });

      this.summary_speed = value;

      for (let key in this.summary_speed) {
        console.log(this.summary_speed[key].avg_download_speed / max);
        this.summary_speed[key].value = Math.round(
          (this.summary_speed[key].avg_download_speed / max) * 100
        );
      }
    },

    sortWeb(value) {
      console.log(value);

      let arr = [];

      for (let item of value) {
        arr.push(item.avg_throughput);
      }

      let max = Math.max(...arr);

      value.sort(function (a, b) {
        return b.avg_throughput - a.avg_throughput;
      });

      this.summary_web = value;
      console.log(this.summary_web);

      for (let key in this.summary_web) {
        console.log(this.summary_web[key].avg_throughput / max);
        this.summary_web[key].value = Math.round(
          (this.summary_web[key].avg_throughput / max) * 100
        );
      }
      console.log(this.summary_web);
    },

    sortVideo(value) {
      console.log(value);

      let arr = [];

      for (let item of value) {
        arr.push(item.avg_throughput);
      }

      let max = Math.max(...arr);

      console.log(arr, max);

      value.sort(function (a, b) {
        return b.avg_throughput - a.avg_throughput;
      });

      console.log(value);

      this.summary_video = value;

      for (let key in this.summary_video) {
        this.summary_video[key].value = Math.round(
          (this.summary_video[key].avg_throughput / max) * 100
        );
      }
    },

    sortRating(value) {
      console.log(value);

      value.sort(function (a, b) {
        return b.rating - a.rating;
      });

      this.summary_rating = value;
    },
  },
};
</script>

<style scoped>
.qoe {
  height: 100%;
}

.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}

.v-progress-linear--rounded {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

.v-sheet.v-card {
  border-radius: 10px;
}

.active-card {
  border: 1px solid #169cd6;
  box-shadow: rgba(3, 150, 248, 0.24) 0px 3px 8px !important;
  color: #169cd6 !important;
}

.active-btn {
  background-image: linear-gradient(
    109.6deg,
    rgba(45, 116, 213, 1) 11.2%,
    rgba(121, 137, 212, 1) 91.2%
  );
  color: white !important;
}

.rating-value {
  margin-top: 10px;
}
</style>
