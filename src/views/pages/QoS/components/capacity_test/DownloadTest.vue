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
import { GET_OPSEL } from "../../../../../store/modules/opsel.module";

export default {
	name: "DonwloadTest",
	components: {
		apexchart: VueApexCharts,
	},
	props: ["data"],
	data: () => ({
		download: [
			// {
			//   name: "Avg Speed",
			//   data: [8.76, 8.24, 8.03, 7.78, 7.39, 7.17],
			// },
			// {
			//   name: "Min Speed",
			//   data: [7.51, 7.81, 6.73, 7.31, 6.83, 6.79],
			// },
			// {
			//   name: "Max Speed",
			//   data: [11.48, 9.36, 9.18, 9.15, 8.11, 7.72],
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

	computed: {
		opsel: function () {
			return this.$store.getters.getOpsel;
		},
	},

	created() {
		this.getOperatorCellular();
		this.changeCategories();
	},

	methods: {
		getOperatorCellular() {
			this.$store.dispatch(GET_OPSEL);
		},

		changeCategories() {
			// console.log("MS");
			// for (let item of this.opsel) {
			//   console.log("MASUK", item);
			// }
		},
	},
};
</script>

<style></style>
