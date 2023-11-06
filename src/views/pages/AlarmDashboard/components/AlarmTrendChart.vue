<template>
  <div id="chart" class="pa-5">
    <!-- <div class="toolbar">
      <v-row>
        <v-col cols="2">
          <v-select rounded dense solo placeholder="2021"></v-select>
        </v-col>
      </v-row>
    </div> -->
    <apexchart
      type="bar"
      height="535"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data: () => ({
    series: [
      {
        name: "Major",
        data: [40, 15, 25, 9, 9, 9],
      },
      {
        name: "Critical",
        data: [25, 25, 27, 30, 30, 10],
      },
    ],
    chartOptions: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
        },
      },
      colors: ["#CB4F4F", "#EA8426"],
      
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
      },
      fill: {
        opacity: 1,
      },
    },
  }),
};
</script>

<style>
</style>