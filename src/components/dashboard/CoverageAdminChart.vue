<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="300"
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
  props: ["series"],
  data: () => ({
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
      colors: ["#D4ECDD", "#345B63", "#152D35", "#112031"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      yaxis: [
        {
          logarithmic: true,
        },
      ],
      xaxis: {
        categories: ["2G", "3G", "4G"],
      },
      fill: {
        opacity: 1,
      },
      title: {
        text: "Luas Cakupan Sinyal",
        position: "top",
        align: "center",
      },
    },
  }),
};
</script>

<style>
</style>