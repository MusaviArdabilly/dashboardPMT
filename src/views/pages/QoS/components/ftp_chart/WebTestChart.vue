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
	props: ["data"],
	components: {
		apexchart: VueApexCharts,
	},
	data: () => ({
		download: [
			// {
			//   name: "Avg Speed",
			//   data: [7.64, 6.69, 6.23, 5.06, 4.36, 4.2],
			// },
			// {
			//   name: "Min Speed",
			//   data: [7.24, 6.14, 4.11, 2.37, 4.11, 3.49],
			// },
			// {
			//   name: "Max Speed",
			//   data: [8.13, 7.48, 7.14, 7.19, 5.02, 4.71],
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
			// console.log("MASUK", item);
			// }
		},
	},
};
</script>

<style></style>
