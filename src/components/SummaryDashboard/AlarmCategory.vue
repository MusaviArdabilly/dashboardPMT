<template>
  <div class="coverage">
    <div class="d-flex">
      <div class="coverager-title font-weight-bold mt-3 ml-8">Alarm Category</div>
      <v-spacer></v-spacer>
      <v-card class="refresh-btn pa-2 mr-8">
        <div class="d-flex">
          <div class="ml-5 mr-5 mt-2">Last update: {{ now }}</div>
          <v-btn rounded class="mr-1 white--text" color="#3C7FBE">
            <v-icon color="white">mdi-sync</v-icon> Refresh</v-btn
          >
        </div>
      </v-card>
    </div>
    <v-row class="pa-9">
      <v-col lg="12">
        <v-card class="text-center category-card">
          <!-- <div class="pa-5 status-title font-weight-bold">Category Alarm</div> -->
          <!-- <v-divider></v-divider> -->
          <v-row class="pb-5">
            <v-col lg="4" class="card-alarm-category">
              <div class="grey--text font-weight-bold">Hardware RF</div>
              <apexchart
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-col>
            <v-col lg="4" class="card-alarm-category">
              <div class="grey--text font-weight-bold">Hardware VSWR/RTWP</div>
              <apexchart
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-col>
            <v-col lg="4" class="card-alarm-category">
              <div class="grey--text font-weight-bold">Cell Down/Blocked</div>
              <apexchart
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-col>
            <v-col lg="4" class="card-alarm-category">
              <div class="grey--text font-weight-bold">Transmission</div>
              <apexchart
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-col>
            <v-col lg="4" class="card-alarm-category">
              <div class="grey--text font-weight-bold">Clock</div>
              <apexchart
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-col>
            <v-col lg="4" class="card-alarm-category">
              <div class="grey--text font-weight-bold">License/Configuration</div>
              <apexchart
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import moment from "moment";

export default {
  computed: {
    now() {
      return moment().format("DD/MM/YYYY - hh:mm:ss");
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  data: () => ({
    active: true,
    items: [0, 1, 2, 3],
    rowPerPage: [5, 10, 15, 20],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      currentPage: 1,
      pageCount: 0,
      totalPage: 0,
    },
    series: [5, 35, 55],
    chartOptions: {
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                fontSize: "30px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
              value: {
                show: true,
                fontSize: "55px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                color: undefined,
                offsetY: 35,
                formatter: function (val) {
                  return val;
                },
              },
            },
          },
        },
      },
      labels: ["2G ", "3G ", "4G"],
      legend: {
        position: "bottom",
        fontSize: "20px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 400,
      },
      dataLabels: {
        fontSize: "50px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 400,
        formatter: function (val, opts) {
          return opts.w.globals.seriesTotals[opts.seriesIndex];
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      colors: ["#27557E", "#3C7FBE", "#74B8F6"],

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  }),
};
</script>

<style scoped>
.card-alarm-category {
  padding: 4em;
  padding-bottom: 2em !important;
  padding-top: 2em !important;
}

.coverage {
  padding: 20px;
}

.coverager-title,
.status-title {
  font-size: 24px;
}

.refresh-btn {
  border-radius: 20px !important;
}
.v-progress-linear--rounded {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

.crd-coverage {
  border: 1px solid black !important;
  /* border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important; */
}

.category-card {
  border-radius: 20px;
}
</style>
