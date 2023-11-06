<template>
  <div id="chart">
    <apexchart
      type="bar"
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
        type: "bar",
        height: 550,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadius: 5
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,  // Set show to true to display lines
        width: 2,  // Set the line width as needed
        colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"], // Line colors
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
        name: "Indosat",
        data: [30, 40, 35, 50, 60],
      },
      {
        name: "Telkomsel",
        data: [45, 55, 55, 60, 70],
      },
      {
        name: "XL",
        data: [25, 30, 35, 50, 45],
      },
      {
        name: "Tri",
        data: [30, 60, 50, 60, 30],
      },
      {
        name: "Smartfren",
        data: [45, 55, 60, 40, 50],
      },
    ],
  }),
};
</script>