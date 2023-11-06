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
	props: ["data", "categories"],
	components: {
		apexchart: VueApexCharts,
	},
	data: () => ({
		// download: [
		//   {
		//     name: "Avg Speed",
		//     data: [2.84, 2.05, 1.58, 1.56, 1.41, 1.12],
		//   },
		//   {
		//     name: "Min Speed",

		//     data: [2.57, 1.84, 1.43, 1.4, 1.25, 1.08],
		//   },
		//   {
		//     name: "Max Speed",
		//     data: [3.11, 2.72, 1.88, 1.81, 1.83, 1.24],
		//   },
		// ],

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

			noData: {
				text: "No Tickets Available",
				align: "center",
				verticalAlign: "middle",
				offsetX: 0,
				offsetY: 0,
				style: {
					color: "#000",
					fontSize: "20px",
				},
			},

			fill: {
				opacity: 1,
			},
		},
	}),

	created() {
		this.getOperatorCellular();
		// console.log(this.categories, "categories props");
	},

	methods: {
		getOperatorCellular() {
			this.$store.dispatch(GET_OPSEL);
		},
	},
};
</script>

<style></style>
