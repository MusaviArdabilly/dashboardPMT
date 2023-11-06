<template>
	<div id="chart">
		<apexchart
			type="bar"
			height="350"
			:options="chartOptions"
			:series="data"
		></apexchart>
	</div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
	components: {
		apexchart: VueApexCharts,
	},
	props: ["data"],
	data: () => ({
		upload: [
			// {
			//   name: "Avg Speed",
			//   data: [25.31, 23.12, 21.19, 17.47, 10.33, 8.6],
			// },
			// {
			//   name: "Min Speed",
			//   data: [22.46, 20.15, 18.24, 8.62, 9.04, 7.51],
			// },
			// {
			//   name: "Max Speed",
			//   data: [31.24, 25.36, 22.89, 21.38, 12.29, 9.98],
			// },
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
					endingShape: "rounded",
					dataLabels: {
						orientation: "vertical",
						position: "top", // top, center, bottom
					},
				},
			},
			dataLabels: {
				enabled: true,
				offsetY: 10,
				style: {
					fontSize: "10px",
					colors: ["#304758"],
				},
				formatter: function (val) {
					if (val === null) {
						return "No Data";
					} else {
						return val;
					}
				},
			},
			stroke: {
				show: true,
				width: 2,
				colors: ["transparent"],
			},
			colors: ["#5088ED", "#EDBF42", "#DB4F43"],
			xaxis: {
				categories: [
					"PT Hutchison 3 Indonesia",
					"PT XL Axiata",
					"PT Indosat Ooredoo",
					"PT Telekomunikasi Selular",
					"PT Smartfren Telecom",
				],
			},

			fill: {
				opacity: 1,
			},
		},
	}),
};
</script>

<style></style>
