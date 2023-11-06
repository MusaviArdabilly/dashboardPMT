// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../services/jwt.services";
import moment from "moment";
import {
	GET_PROVINCE,
	GET_CITY,
	GET_DISTRICT,
	GET_SUB_DISTRICT,
} from "../../../store/modules/location.module";
import {
	GET_START_DATE,
	GET_END_DATE,
	GET_AVG_SPEED_TEST,
	GET_AVG_WEB_TEST,
	GET_AVG_VIDEO_TEST,
	GET_AVG_RATING,
} from "../../../store/modules/qoe.module";
import Telkomsel from "../../../assets/image/tsel.svg";
import Indosat from "../../../assets/image/indosat.svg";
import XL from "../../../assets/image/xl.svg";
import Tri from "../../../assets/image/3.svg";
import Smartfren from "../../../assets/image/smartfren.svg";
import STI from "../../../assets/image/sti.svg";
import TestResult from "./components/TestResult/TestResult.vue";
import BadSpot from "./components/BadSpot/BadSpot.vue";
import QoE_Cellular from "./components/QoE_Cellular/QoE_Cellular.vue";
import QoE_FO from "./components/QoE_FO/QoE_FO.vue";

export default {
	components: { TestResult, BadSpot, QoE_Cellular, QoE_FO },

	data: () => ({
		pmt_url: process.env.VUE_APP_API_URL,
		table: "SpeedTable",
		loading: false,
		show_upload: false,
		sheet_name: null,
		isDisabled: true,
		active_item: "Test Result",
		card_active: false,
		componentKey: 0,
		qoe: QoE_Cellular,
		qos: TestResult,
		user: null,
		filter: {
			date: {
				startDate: new Date(
					Date.now() - new Date().getTimezoneOffset() * 60000
				)
					.toISOString()
					.substr(0, 10),
				endDate: new Date(
					Date.now() - new Date().getTimezoneOffset() * 60000
				)
					.toISOString()
					.substr(0, 10),
				default: true,
				defaultTable: true,
				defaultText: "All Time",
			},
		},
		date_picker_1: false,
		date_picker_2: false,
		items: [
			{
				logo: Telkomsel,
				name: "TSEL",
				progress: "87%",
				value: 87,
				color: "#74B8F6",
			},
			{
				logo: Indosat,
				name: "ISAT",
				progress: "75%",
				value: 75,
				color: "#74B8F6",
			},
			{
				logo: XL,
				name: "XL",
				progress: "70%",
				value: 70,
				color: "#74B8F6",
			},
			{
				logo: Tri,
				name: "H3I",
				progress: "63%",
				value: 63,
				color: "#27557E",
			},
			{
				logo: Smartfren,
				name: "FREN",
				progress: "50%",
				value: 50,
				color: "#27557E",
			},
			{
				logo: STI,
				name: "STI",
				progress: "45%",
				value: 45,
				color: "#27557E",
			},
		],
		activeQoE: "cellular",
		province: [],
		city: [],
		district: [],
		sub_district: [],
		selected_province: 0,
		selected_city: 0,
		selected_district: 0,
		selected_sub_district: 0,
		searchProvince: "",
		searchCity: "",
		searchDistrict: "",
		searchSubDistrict: "",
		selected_file: [],
		qos_test: null,
		start_date: "",
		end_date: "",
		show_loading: false,
		sumbit_loading: false,
	}),

	computed: {
		filterComputed: {
			//convert html standard datetime value into local time
			get() {
				return {
					preview: {
						startDate: moment(this.filter.date.startDate)
							.locale("id-ID")
							.format("DD-MM-YYYY"),
						endDate: moment(this.filter.date.endDate)
							.locale("id-ID")
							.format("DD-MM-YYYY"),
					},
				};
			},
		},

		item_province: function () {
			return this.$store.getters.item_province;
		},

		item_city: function () {
			return this.$store.getters.item_city;
		},

		item_district: function () {
			return this.$store.getters.item_district;
		},

		item_sub_district: function () {
			return this.$store.getters.item_sub_district;
		},

		start_date: function () {
			return this.$store.getters.start_date;
		},

		end_date: function () {
			return this.$store.getters.end_date;
		},

		province_selected: function () {
			return this.$store.getters.selected_province;
		},
	},
	methods: {
		initialize() {
			// this.getQoS();
			this.loading = true;
			this.getProvince();
		},

		changeComponent(value) {
			// console.log(value);
			if (value == "Bad Spot") {
				this.active_item = "Bad Spot";
				this.qos = BadSpot;
			} else {
				this.active_item = "Test Result";
				this.qos = TestResult;
			}
		},

		changeComponentQoE(value) {
			// console.log(value);
			if (value == "fo") {
				this.qoe = QoE_FO;
				this.activeQoE = "fo";
			} else if (value == "cellular") {
				this.qoe = QoE_Cellular;
				this.activeQoE = "cellular";
			}
		},

		getProvince() {
			this.$store.dispatch(GET_PROVINCE);
			// console.log("GET QOS");
		},
		selectCity() {
			if (this.selected_province == this.province_selected) {
				this.$store.dispatch(GET_CITY, this.selected_province);
			} else {
				this.selected_city = 0;
				this.selected_district = 0;
				this.selected_sub_district = 0;
				this.$store.dispatch(GET_CITY, this.selected_province);
			}
		},

		selectDistrict() {
			this.$store.dispatch(GET_DISTRICT, this.selected_city);
		},

		selectSubDistrict() {
			this.$store.dispatch(GET_SUB_DISTRICT, this.selected_district);
		},
		turnOffLoading() {
			this.loading = false;
		},
		submitFilter() {
			if (this.filter.date.default == true) {
				this.$swal({
					title: this.$t("ui.message.date_range"),
					icon: "info",
					confirmButtonColor: "#134889",
					showConfirmButton: true,
					timer: 3000,
				});
			} else {
				// console.log(this.date_1, this.date_2);
				this.start_date = this.filter.date.startDate;
				this.end_date = this.filter.date.endDate;
				this.componentKey += 1;
				this.initialize();
				// this.getQoS();
			}
		},

		applyFilter() {
			if (this.filter.date.default == true) {
				// this.$swal({
				//   title: this.$t("ui.message.date_range"),
				//   icon: "info",
				//   confirmButtonColor: "#134889",
				//   showConfirmButton: true,
				//   timer: 3000,
				// });
				this.start_date = "";
				this.end_date = "";

				this.componentKey += 1;
				// this.getQoS();
				this.initialize();
			} else {
				// console.log(
				// 	this.selected_province,
				// 	this.selected_city,
				// 	this.selected_district
				// );

				this.start_date = this.filter.date.startDate;
				this.end_date = this.filter.date.endDate;

				this.componentKey += 1;
				// this.getQoS();
				this.initialize();
			}
		},

		resetFilter() {
			this.filter.date.default = true;
			this.selected_province = 0;
			this.selected_city = 0;
			this.selected_district = 0;
			this.selected_sub_district = 0;
			this.start_date = "";
			this.end_date = "";
			this.componentKey += 1;
			this.initialize();
		},

		fileUpload() {
			this.$refs.fileInput.click();
		},

		addFile() {
			this.selected_file = [...this.$refs.fileInput.files];
			this.show_loading = true;

			setTimeout(() => {
				// console.log("MASUK");
				this.show_loading = false;
			}, 3000);
		},

		addSheetName(value) {
			this.sheet_name = value;

			if (this.selected_file && this.sheet_name != null) {
				this.isDisabled = false;
			}
		},

		remove(i) {
			this.selected_file.splice(i, 1);
		},

		dragover(event) {
			event.preventDefault();
			// Add some visual fluff to show the user can drop its files
			if (!event.target.classList.contains("bg-green-300")) {
				event.target.classList.remove("bg-gray-100");
				event.target.classList.add("bg-green-300");
			}
		},
		dragleave(event) {
			// Clean up
			event.currentTarget.classList.add("bg-gray-100");
			event.currentTarget.classList.remove("bg-green-300");
		},
		drop(event) {
			event.preventDefault();
			this.$refs.fileInput.files = event.dataTransfer.files;
			this.addFile(); // Trigger the onChange event manually
			// Clean up
			event.currentTarget.classList.add("bg-gray-100");
			event.currentTarget.classList.remove("bg-green-300");
		},

		submitQoS() {
			this.sumbit_loading = true;
			let formData = new FormData();

			formData.append("sheet_name", this.sheet_name);
			formData.append("attachment", this.selected_file[0]);

			fetch(process.env.VUE_APP_API_URL + `api/v1/en/qos/upload/excel`, {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Bearer ` + this.user.token,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					if (result.error == true) {
						this.$swal({
							text: result.message,
							showConfirmButton: true,
							icon: "error",
						});
						this.sumbit_loading = false;
					} else {
						this.$swal({
							text: result.message,
							showConfirmButton: true,
							icon: "success",
						});
						this.show_upload = false;
						this.selected_file = [];
						this.sheet_name = null;
						this.isDisabled = true;
						this.sumbit_loading = false;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getAvgRating() {
			const data = {
				start_date: `${this.start_date}`,
				end_date: `${this.end_date}`,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
			};

			this.$store.dispatch(GET_AVG_RATING, data);
		},

		getAvgSpeed() {
			const data = {
				start_date: `${this.start_date}`,
				end_date: `${this.end_date}`,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
			};
			this.$store.dispatch(GET_AVG_SPEED_TEST, data);
		},

		getAvgWeb() {
			const data = {
				start_date: `${this.start_date}`,
				end_date: `${this.end_date}`,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
			};
			this.$store.dispatch(GET_AVG_WEB_TEST, data);
		},

		getAvgVideo() {
			const data = {
				start_date: `${this.start_date}`,
				end_date: `${this.end_date}`,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
			};
			this.$store.dispatch(GET_AVG_VIDEO_TEST, data);
		},
		filterDate() {
			this.filter.date.default = false;
			this.start_date = this.filter.startDate;
			this.end_date = this.filter.endDate;
			this.$store.dispatch(GET_START_DATE, this.filter.startDate);
			this.$store.dispatch(GET_END_DATE, this.filter.endDate);
		},
	},
	mounted() {
		this.user = JwtService.getUser();
		this.$store.dispatch(GET_START_DATE, "");
		this.$store.dispatch(GET_END_DATE, "");
		this.initialize();
	},
};
