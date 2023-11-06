<template>
  <div class="map-qos">
    <!-- <NavBar /> -->
    <div class="font-weight-bold mt-5" style="font-size: 24px">
      Map Dashboard
    </div>
    <v-row class="mt-5">
      <v-col lg="2">
        <v-autocomplete
          @input="selectCity"
          v-model="selected_province"
          :items="item_province"
          :search-input.sync="searchProvince"
          item-text="name"
          item-value="id"
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
          @click="applyFilter"
          >{{ $t("ui.button_apply") }}</v-btn
        >
        <v-btn
          @click="resetFilter"
          elevation="0"
          class="text-capitalize"
          rounded
          color=""
          >Reset</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col lg="6">
        <div class="font-weight-bold">Coverage</div>
        <img width="100%" src="../../assets/image/map-qos-1.png" alt="map" />
      </v-col>
      <v-col lg="6">
        <div class="font-weight-bold">Quality</div>
        <img width="100%" src="../../assets/image/map-qos-2.png" alt="map" />
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12">
        <BadSpot />
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import NavBar from "../../components/dashboard/NavBar.vue";
import BadSpot from "./QoS/components/BadSpot/BadSpot.vue";
import TestResult from "./QoS/components/TestResult/TestResult.vue";
import moment from "moment";
import {
  GET_PROVINCE,
  GET_CITY,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
} from "../../store/modules/location.module";

import { GET_START_DATE, GET_END_DATE } from "../../store/modules/qoe.module";
import Telkomsel from "../../assets/image/telkomsel-br_01.svg";
import Indosat from "../../assets/image/isat.svg";
import XL from "../../assets/image/xl.svg";
import Tri from "../../assets/image/3.svg";
import Smartfren from "../../assets/image/smartfren.svg";
import STI from "../../assets/image/sti1.svg";

export default {
  components: { BadSpot },
  data: () => ({
    table: "SpeedTable",
    active_item: "Test Result",
    card_active: false,
    qos: TestResult,
    user: null,
    date_1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
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

    province_selected: function () {
      return this.$store.getters.selected_province;
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getProvince();
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

    submitFilter() {},

    applyFilter() {},

    resetFilter() {},
  },
};
</script>

<style scoped>
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
</style>
