<template>
  <div id="chart">
    <apexchart
      type="line"
      width="100%"
      height="500"
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
  
    chartOptions: {
      chart: {
        type: "line",
        height: 550,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
      },
      xaxis: {
        categories: ["2019", "2020", "2021", "2022", "2023"],
      },
      fill: {
        opacity: 1,
      },
    },
    series: [
      {
        name: "Twitter",
        data: [30, 40, 35, 50, 60],
      },
      {
        name: "Facebook",
        data: [45, 55, 55, 60, 70],
      },
      {
        name: "Instagram",
        data: [25, 30, 35, 50, 45],
      },
      {
        name: "Others",
        data: [30, 60, 50, 60, 30],
      },
    ],
  }),
};
</script>