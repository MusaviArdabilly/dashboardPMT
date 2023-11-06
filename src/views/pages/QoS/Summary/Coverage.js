import NavbarBigScreen from "../../../../components/SummaryDashboard/NavbarBigScreen.vue";
// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../../services/jwt.services";
import moment from "moment";
import {
	GET_PROVINCE,
	GET_CITY,
	GET_DISTRICT,
	GET_SUB_DISTRICT,
} from "../../../../store/modules/location.module";
import {
	GET_START_DATE,
	GET_END_DATE,
	GET_AVG_SPEED_TEST,
	GET_AVG_WEB_TEST,
	GET_AVG_VIDEO_TEST,
	GET_AVG_RATING,
} from "../../../../store/modules/qoe.module";
import Telkomsel from "../../../../assets/image/tsel.svg";
import Indosat from "../../../../assets/image/indosat.svg";
import XL from "../../../../assets/image/xl.svg";
import Tri from "../../../../assets/image/3.svg";
import Smartfren from "../../../../assets/image/smartfren.svg";
import STI from "../../../../assets/image/sti.svg";
import TestResult from "../components/TestResult/TestResult.vue";
import BadSpot from "../components/BadSpot/BadSpot.vue";
import QoE_Cellular from "../components/QoE_Cellular/QoE_Cellular.vue";
import QoE_FO from "../components/QoE_FO/QoE_FO.vue";

export default {
	components: { TestResult, BadSpot, NavbarBigScreen, QoE_Cellular, QoE_FO },

	data: () => ({
		loading: false,
		pmt_url: process.env.VUE_APP_API_URL,
		table: "SpeedTable",
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
				defaultText: "All Time",
			},
		},
		date_picker_1: false,
		date_picker_2: false,
		date_picker_start_qoe: false,
		date_picker_end_qoe: false,
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
		start_date_qoe: "",
		end_date_qoe: "",
		activeQoE: "cellular",
	}),

	computed: {
		filterComputed: {
			//convert html standard datetime value into local time
			get() {
				return {
					preview: {
						startDate: moment(this.filter.date.startDate)
							.locale("id-ID")
							.format("YYYY-MM-DD"),
						endDate: moment(this.filter.date.endDate)
							.locale("id-ID")
							.format("YYYY-MM-DD"),
					},
				};
			},
		},

		startDateQoe: function () {
			return moment(this.date_start_qoe).format("YYYY-MM-DD");
		},
		endDateQoe: function () {
			return moment(this.date_end_qoe).format("YYYY-MM-DD");
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

		start_date_qoe: function () {
			return this.$store.getters.start_date;
		},

		end_date_qoe: function () {
			return this.$store.getters.end_date;
		},

		avg_speed_test: function () {
			return this.$store.getters.avg_speed_test;
		},

		avg_video_test: function () {
			return this.$store.getters.avg_video_test;
		},

		avg_web_test: function () {
			return this.$store.getters.avg_web_test;
		},

		province_selected: function () {
			return this.$store.getters.selected_province;
		},

		avg_rating: function () {
			return this.$store.getters.avg_rating;
		},
	},

	mounted() {
		this.user = JwtService.getUser();
		this.initialize();
	},
	methods: {
		initialize() {
			this.loading = true;
			// this.getQoS();
			this.getProvince();
			this.getAvgRating();
			this.getAvgSpeed();
			this.getAvgWeb();
			this.getAvgVideo();
		},
		turnOffLoading() {
			this.loading = false;
		},
		getQoS() {
			let start_date = "";
			let end_date = "";
			if (this.start_date == "") {
				// start_date = this.startDateQoe + " 00:00:00";
			} else {
				start_date = this.start_date;
			}
			if (this.end_date == "") {
				// end_date = this.endDateQoe + " 23:59:00";
			} else {
				end_date = this.end_date;
			}
			const data = {
				limit: -1,
				page: 1,
				sort: "DESC",
				start_date: start_date,
				end_date: end_date,
				cell_operator_id: 0,
				province_id: this.selected_province,
				city_id: this.selected_city,
				district_id: this.selected_district,
				sub_district_id: 0,
				poi: "",
				event: "",
			};

			// console.log(data);

			fetch(process.env.VUE_APP_API_URL + `api/v1/id/qos`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user.token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					this.loading = false;
					// console.log(result);
					if (result.data == null) {
						this.qos_test = [];
						// console.log(this.qos_test);
					} else {
						this.qos_test = result.data;
					}
				})
				.catch((err) => {
					console.log(err);
				});
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
		},

		inputDate() {
			this.filter.date.default = false;
			this.start_date = this.filter.date.startDate;
			this.end_date = this.filter.date.endDate;
			this.$store.dispatch(GET_START_DATE, this.filter.date.startDate);
			this.$store.dispatch(GET_END_DATE, this.filter.date.endDate);
		},

		inputDateQoe() {
			this.start_date_qoe = this.date_start_qoe;
			this.end_date_qoe = this.date_start_qoe;
			this.$store.dispatch(GET_START_DATE, this.date_start_qoe);
			this.$store.dispatch(GET_END_DATE, this.date_start_qoe);
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
				this.loading = true;
				this.start_date = this.filter.date.startDate;
				this.end_date = this.filter.date.endDate;
				this.componentKey += 1;
				this.$store.dispatch(
					GET_START_DATE,
					this.filter.date.startDate
				);
				this.$store.dispatch(GET_END_DATE, this.filter.date.endDate);
				this.initialize();
			}
		},

		applyFilter() {
			// if (this.filter.date.default == true) {
			//   this.$swal({
			//     title: this.$t("ui.message.date_range"),
			//     icon: "info",
			//     confirmButtonColor: "#134889",
			//     showConfirmButton: true,
			//     timer: 3000,
			//   });
			// } else {
			this.componentKey += 1;
			this.initialize();
			// }
		},

		resetFilter() {
			this.filter.date.default = true;
			this.componentKey += 1;
			this.selected_province = 0;
			this.selected_city = 0;
			this.selected_district = 0;
			this.start_date = "";
			this.end_date = "";
			this.$store.dispatch(GET_START_DATE, "");
			this.$store.dispatch(GET_END_DATE, "");
			this.initialize();
		},

		fileUpload() {
			this.$refs.fileInput.click();
		},

		addFile() {
			this.selected_file = [...this.$refs.fileInput.files];
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
							timer: 1000,
							showConfirmButton: false,
							icon: "error",
						});
					} else {
						this.$swal({
							text: result.message,
							timer: 1000,
							showConfirmButton: false,
							icon: "success",
						});
						this.show_upload = false;
						this.selected_file = [];
						this.sheet_name = null;
						this.isDisabled = true;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getAvgRating() {
			const data = {
				start_date: this.start_date_qoe,
				end_date: this.end_date_qoe,
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
				start_date: this.start_date_qoe,
				end_date: this.end_date_qoe,
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
				start_date: this.start_date_qoe,
				end_date: this.end_date_qoe,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
			};
			// console.log(data, "payload");
			this.$store.dispatch(GET_AVG_WEB_TEST, data);
		},

		getAvgVideo() {
			const data = {
				start_date: this.start_date_qoe,
				end_date: this.end_date_qoe,
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

		applyFilterQoe() {
			const data = {
				start_date: this.start_date_qoe,
				end_date: this.end_date_qoe,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: this.selected_province,
				city_id: this.selected_city,
				district_id: this.selected_district,
				sub_district_id: this.selected_sub_district,
			};

			this.$store.dispatch(GET_AVG_SPEED_TEST, data);

			this.$store.dispatch(GET_AVG_WEB_TEST, data);

			this.$store.dispatch(GET_AVG_VIDEO_TEST, data);

			this.$store.dispatch(GET_AVG_RATING, data);
		},

		resetFilterQoe() {
			this.selected_province = 0;
			this.selected_city = 0;
			this.selected_district = 0;
			this.selected_sub_district = 0;

			const data = {
				start_date: this.start_date_qoe,
				end_date: this.end_date_qoe,
				test_type: "",
				status: "active",
				network_type: 1,
				connection_type: "",
				province_id: this.selected_province,
				city_id: this.selected_city,
				district_id: this.selected_district,
				sub_district_id: this.selected_sub_district,
			};

			this.$store.dispatch(GET_AVG_SPEED_TEST, data);

			this.$store.dispatch(GET_AVG_WEB_TEST, data);

			this.$store.dispatch(GET_AVG_VIDEO_TEST, data);

			this.$store.dispatch(GET_AVG_RATING, data);
		},
	},
};
