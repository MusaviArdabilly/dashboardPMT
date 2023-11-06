// import AnalysisMaps from "../../components/dashboard/AnalysisMaps.vue";
import JwtServices from "../../../services/jwt.services";
import NavbarBigScreen from "../../../layouts/NavbarFull/NavbarBigScreen.vue";
import {
	GET_ANALYSIS_CITY,
	GET_ANALYSIS_DISTRICT,
	SET_ACTIVE_FILTER,
	GET_ANALYSIS_PROVINCE,
} from "../../../store/modules/analysis.module";

import {
	GET_PROVINCE,
	GET_CITY,
	GET_DISTRICT,
	GET_SUB_DISTRICT,
} from "../../../store/modules/location.module";
import { GET_OPSEL } from "../../../store/modules/opsel.module";
import { RESET_FILTER } from "../../../store/modules/qoe.module";

export default {
	components: { NavbarBigScreen },
	computed: {
		item_province: function () {
			return this.$store.getters.item_province;
		},
		defaultDate: {
			get: function () {
				return this.selectedQuarter + " " + this.selectedYear;
			},
			set: function (value) {
				var year = value.split(" ");
				this.selectedQuarter = year[0];
				this.selectedYear = year[1];
			},
		},
		item_city: function () {
			return this.$store.getters.item_city;
		},

		item_district: function () {
			return this.$store.getters.item_district;
		},

		item_opsel: function () {
			return this.$store.getters.item_opsel;
		},
	},

	data: () => ({
		pmt_url: process.env.VUE_APP_API_URL,
		date: new Date().toISOString().substr(0, 7),
		selected_opsel_temp: 0,
		menu: false,
		menu2: false,
		height: "700px",
		yearItems: [],
		selected_filter: "",
		selected_province: 0,
		selected_city: 0,
		selected_district: 0,
		searchProvince: "",
		dateDialog: false,
		currentDate: "",
		searchCity: "",
		selectedQuarter: 0,
		selectedYear: 0,
		searchDistrict: "",
		quarterItems: ["Q1", "Q2", "Q3", "Q4"],
		selectedSignalStrength: "4G",
		signalStrength: ["2G", "3G", "4G"],
		selectedSpeedTest: "4G",
		speedTest: ["3G", "4G"],
		parameter: [
			{
				id: 0,
				name: "Parameter",
			},
			{
				id: 1,
				name: "POI",
			},
			{
				id: 2,
				name: "Event",
			},
		],
		selected_tech: 0,
		selected_param: 0,
		opsel_selected: {},
		technology_selected: "",
		province: "",
		city: "",
		district: "",
		show_data: false,
		selected_data: "",
		filter_selected: true,
		cov_qoe_ss: {},
		cov_qoe_dl: {},
		skeleton: true,
		message: "",
	}),

	methods: {
		clearCachedItems() {
			this.$refs.autocomplete.cachedItems = [];
		},

		getProvince() {
			this.$store.dispatch(GET_PROVINCE);
		},

		getOperatorCellular() {
			this.$store.dispatch(GET_OPSEL);
		},

		selectCity(value) {
			for (let data of this.item_province) {
				if (value == data.id) {
					this.province = data.name;
				}
			}
			this.selected_filter = "province";
			if (this.selected_province == this.province_selected) {
				this.$store.dispatch(GET_CITY, this.selected_province);
			} else {
				this.selected_city = 0;
				this.selected_district = 0;
				this.selected_sub_district = 0;
				this.$store.dispatch(GET_CITY, this.selected_province);
			}
		},

		selectDistrict(value) {
			for (let data of this.item_city) {
				if (value == data.id) {
					this.city = data.name;
				}
			}
			this.selected_filter = "city";
			this.$store.dispatch(GET_DISTRICT, this.selected_city);
		},

		selectSubDistrict(value) {
			for (let data of this.item_district) {
				if (value == data.id) {
					this.district = data.name;
				}
			}
			this.selected_filter = "district";
			this.$store.dispatch(GET_SUB_DISTRICT, this.selected_district);
		},

		addOpselAnaylysis(value) {
			for (let data of this.item_opsel) {
				if (value == data.id) {
					this.opsel_selected = data;
				}
			}
		},

		applyFilter() {
			this.show_data = true;
			this.filter_selected = false;
			let province = null;
			let city = null;
			this.skeleton = true;

			switch (this.selected_filter) {
				case "province":
					this.$store.commit(SET_ACTIVE_FILTER, this.selected_filter);
					for (let data of this.item_province) {
						if (this.selected_province == data.id) {
							province = data;
							this.$store.dispatch(
								GET_ANALYSIS_PROVINCE,
								province.name
							);
						}
					}
					break;
				case "city":
					for (let data of this.item_city) {
						if (this.selected_city == data.id) {
							city = data;
							this.$store.dispatch(
								GET_ANALYSIS_PROVINCE,
								city.name
							);
						}
					}
					this.$store.commit(SET_ACTIVE_FILTER, this.selected_filter);
					this.$store.dispatch(GET_ANALYSIS_CITY, city.name);
					break;
				case "district":
					this.$store.commit(SET_ACTIVE_FILTER, this.selected_filter);
					this.$store.dispatch(
						GET_ANALYSIS_DISTRICT,
						this.selected_district
					);
					break;
			}

			this.getCovQoESS();
			this.getCovQoESpeedTest();
		},

		resetFilter() {
			this.show_data = false;
			this.filter_selected = true;
			this.selected_opsel_temp = 0;
			this.selected_tech = 0;
			this.selected_province = 0;
			this.selected_city = 0;
			this.message = "";
			this.selected_district = 0;
			this.$store.commit(RESET_FILTER);
			this.$store.dispatch(GET_PROVINCE);
			this.defaultDate = this.currentDate;
		},

		selectedTech(value) {
			// console.log(value);
			for (let item of this.technology) {
				if (value == item.id) {
					this.technology_selected = item.name;
				}
			}
		},
		getYearList() {
			const year = new Date().getFullYear();
			const yearMinOne = year - 1;
			const yearPlusOne = year + 1;
			this.selectedYear = year;
			this.yearItems = [yearMinOne, year, yearPlusOne];

			const quarter = Math.floor((new Date().getMonth() + 3) / 3);
			this.selectedQuarter = "Q" + quarter;

			this.currentDate = "Q" + quarter + " " + year;
		},

		getCovQoESS() {
			const data = {
				start_date: "",
				end_date: "",
				cell_operator_id: this.selected_opsel_temp,
				connection_type: this.selectedSignalStrength,
				province_id: this.selected_province,
				city_id: this.selected_city,
				district_id: this.selected_district,
				sub_district_id: 0,
				q_time: this.selectedQuarter + " " + this.selectedYear,
			};

			fetch(
				process.env.VUE_APP_API_URL + `api/v2/id/analysis/cov-qoe-ss`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${JwtServices.getToken()}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					if (result.data == null) {
						this.filter_selected = true;
					}
					this.cov_qoe_ss = result.data.analysis;
					this.skeleton = false;
					// console.log(this.cov_qoe_ss);
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getCovQoESpeedTest() {
			const data = {
				start_date: "",
				end_date: "",
				cell_operator_id: this.selected_opsel_temp,
				connection_type: this.selectedSpeedTest,
				province_id: this.selected_province,
				city_id: this.selected_city,
				district_id: this.selected_district,
				sub_district_id: 0,
				q_time: this.selectedQuarter + " " + this.selectedYear,
			};

			fetch(
				process.env.VUE_APP_API_URL + `api/v2/id/analysis/cov-qoe-dl`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${JwtServices.getToken()}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					if (result.data == null) {
						this.filter_selected = true;
						this.message = result.message;
					}
					this.cov_qoe_dl = result.data.analysis;
					this.skeleton = false;
					// console.log(this.cov_qoe_ss);
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
	mounted() {
		this.getYearList();
	},
	created() {
		this.getProvince();
		this.getOperatorCellular();
		this.getQOESS();
	},
};
