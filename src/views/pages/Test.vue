<template>
  <v-responsive class="bg-screen" :aspect-ratio="16 / 9">
    <v-row>
      <v-col lg="12" xl="12">
        <Maps height="100vh" :opsel="opsel" />
      </v-col>
    </v-row>
    <v-dialog fullscreen v-model="dialog">
      <v-card class="pa-5">
        <div class="d-flex">
          <div class="font-weight-bold">{{ selected_chart }}</div>
          <v-spacer></v-spacer>
          <v-btn icon x-large @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <apexchart
          type="line"
          height="80%"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </v-card>
    </v-dialog>
  </v-responsive>
</template>

<script>
import Maps from "../../components/dashboard/NewMaps.vue";
import VueApexCharts from "vue-apexcharts";
import Telkomsel from "../../assets/image/tsel.svg";
import XL from "../../assets/image/xl.svg";
import H3I from "../../assets/image/3.svg";
import Indosat from "../../assets/image/indosat.svg";
import Smartfren from "../../assets/image/smartfren.svg";
import STI from "../../assets/image/sti.svg";
import JwtServices from "../../services/jwt.services";
import { GET_OPSEL } from "../../store/modules/opsel.module";

export default {
  components: { Maps, apexchart: VueApexCharts },
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    dialog: false,
    active_alarm: 0,
    alarm: [],
    total_bts: [
      {
        name: "Telkomsel",
        logo: Telkomsel,
        total: 25.539,
      },
      {
        name: "XL",
        logo: XL,
        total: 10.127,
      },
      {
        name: "H3I",
        logo: H3I,
        total: 9.235,
      },
      {
        name: "Indosat",
        logo: Indosat,
        total: 12.467,
      },
      {
        name: "Smartfren",
        logo: Smartfren,
        total: 2.786,
      },
      {
        name: "STI",
        logo: STI,
        total: 749,
      },
    ],
    selected_chart: "",
    series: [
      {
        name: "Telkomsel",
        data: [15, 16, 13, 15, 18, 20, 19, 22, 20, 17, 19, 20, 21],
      },
      {
        name: "Indosat",
        data: [23, 20, 18, 20, 22, 16, 15, 18, 19, 16, 17, 22, 24],
      },
      {
        name: "Smartfren",
        data: [12, 13, 8, 10, 11, 12, 13, 12, 16, 13, 14, 15, 18],
      },
      {
        name: "H3I",
        data: [8, 10, 11, 14, 13, 9, 10, 15, 14, 10, 11, 12, 11],
      },
      {
        name: "XL",
        data: [9, 5, 3, 4, 3, 5, 6, 5, 4, 6, 10, 14, 13],
      },
      {
        name: "NET1",
        data: [3, 2, 5, 2, 1, 4, 9, 8, 10, 11, 8, 9, 7],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      // title: {
      //   text: "Product Trends by Month",
      //   align: "left",
      // },
      colors: [
        "#E04949",
        "#F9E307",
        "#FA739F",
        "#AFAFAF",
        "#0044C8",
        "#FF7232",
      ],
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "11-2020",
          "12-2020",
          "01-2021",
          "02-2021",
          "03-2021",
          "04-2021",
          "05-2021",
          "06-2021",
          "07-2021",
          "08-2021",
          "09-2021",
          "10-2021",
          "11-2021",
        ],
      },
    },
    user_token: null,
  }),

  computed: {
    opsel: function () {
      return this.$store.getters.getOpsel;
    },
  },

  created() {
    this.user_token = JwtServices.getToken();
    this.$store.dispatch(GET_OPSEL);
  },

  mounted() {},

  methods: {
    fullScreenChart(value) {
      this.dialog = true;
      this.selected_chart = value;
    },

    // nextPage(value) {
    //   const data = {
    //     limit: this.pagination.rowsPerPage,
    //     page: value,
    //     sort: "desc",
    //     start_date: "",
    //     end_date: "",
    //     search: "",
    //     status: "unresolved",
    //     province_id: "[]",
    //     city_id: "[]",
    //     district_id: "[]",
    //     sub_district_id: "[]",
    //     cell_operator_id: 0,
    //   };

    //   fetch(process.env.VUE_APP_API_URL + `api/v1/id/alarm`, {
    //     method: "POST",
    //     body: JSON.stringify(data),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${this.user_token}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((result) => {
    //       console.log(result);
    //       this.alarm = result.data.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
  },
};
</script>

<style scoped>
.btm-card {
  position: relative;
  bottom: 0;
}

.bg-screen {
  font-size: 24px;
  background-color: #aad3df;
}

.v-dialog--fullscreen > .v-card {
  padding: 24px !important;
  font-size: 24px;
}

.bg-alarm {
  background-image: url("../../assets/image/bg-alarm.svg");
  background-size: cover;
  object-fit: fill;
  border-radius: 40px !important;
  background-position: center;
}

.alarm-summary {
  position: relative;
  top: 155px;
  color: #fff !important;
}

#total-alarm {
  font-weight: bold;
  font-size: 64px;
}
</style>
