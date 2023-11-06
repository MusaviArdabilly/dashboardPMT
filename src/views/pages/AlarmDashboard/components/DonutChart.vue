<template>
  <div id="chart" class="pa-5">
    <apexchart
      type="donut"
      :options="chartOptions"
      :series="series"
      height="475"
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
    series: [50, 10, 90, 0],
    chartOptions: {
      chart: {
        type: "donut",
      },
      legend: {
        position: "bottom",
        horizontalAlignment: "center",
      },
      colors: ["#27557E", "#3C7FBE", "#74B8F6", "#8ED6FF"],
      labels: ["2G", "3G", "4G", "5G"],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.globals.seriesTotals[opts.seriesIndex];
        },
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
.apexcharts-legend {
  justify-content: center !important;
}
</style>