import moment from "moment";
import RadialProgressBar from "vue-radial-progress";
import VueApexCharts from "vue-apexcharts";
import TabTicket from "../../../../components/TicketingManagement/Cell/TabTicket.vue";
import TabProgress from "../../../../components/TicketingManagement/Cell/TabProgress.vue";
import TabDetails from "../../../../components/TicketingManagement/Cell/TabDetails.vue";
import JwtService from "../../../../services/jwt.services";

import Telkomsel from "../../../../assets/image/telkomsel-br_01.svg";
import Indosat from "../../../../assets/image/isat.svg";
import XL from "../../../../assets/image/xl.svg";
import Tri from "../../../../assets/image/3.svg";
import Smartfren from "../../../../assets/image/logo.svg";
import STI from "../../../../assets/image/sti1.svg";
import {
	GET_START_DATE,
	GET_END_DATE,
} from "../../../../store/modules/qoe.module";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";
import ticketingSummaryDialog from "../../../../components/TicketingManagement/dialog/TicketingSummaryDialog.vue";

import { mixinsTicketingManagement } from "../../../../components/TicketingManagement/mixins/mixinsTicketingManagement";

export default {
	components: {
		RadialProgressBar,
		apexchart: VueApexCharts,
		NavigationCellAndFo,
		ticketingSummaryDialog,
	},
	mixins: [mixinsTicketingManagement],
	data: () => ({
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
		copyNotification: false,
		dateCurrent: "",
		dateThreeMonths: "",
		pmt_url: process.env.VUE_APP_API_URL,
		dialog_confirmation_close: false,
		dialog_confirmation_report: false,
		selected_ticket: null,
		active_item: "Operator Cellular",
		loading_overlay: false,
		dialog_detail: false,
		data_download: [],
		selected_detail_card: {
			name: "",
			data: [],
			montel: [],
			qoe: [],
			qos: [],
		},
		active: false,
		tab: null,
		modal_items: [
			{
				tab: "ticket",
				content: TabTicket,
			},
			{
				tab: "progress",
				content: TabProgress,
			},
			{
				tab: "details",
				content: TabDetails,
			},
		],
		completedSteps1: 80,
		completedSteps2: 50,
		completedSteps3: 20,
		completedSteps4: 90,
		totalSteps: 100,
		series: [44, 55, 41, 17, 15],
		chartOptions: {
			chart: {
				width: 380,
				type: "donut",
				dropShadow: {
					enabled: true,
					color: "#111",
					top: -1,
					left: 3,
					blur: 3,
					opacity: 0.2,
				},
			},
			stroke: {
				width: 0,
				colors: ["#3C99BA"],
			},
			plotOptions: {
				pie: {
					donut: {
						labels: {
							show: true,
							total: {
								showAlways: true,
								show: true,
							},
						},
					},
				},
			},
			fill: {
				opacity: 0,
			},

			tooltip: {
				enabled: false,
			},
			labels: ["Open ", "On Progress ", "Closed "],
			legend: {
				enabled: false,
			},
			dataLabels: {
				formatter: function () {
					return "";
				},
			},
			states: {
				hover: {
					filter: "none",
				},
			},
			colors: ["#F2C94C", "#27AE60", "#56CCF2"],

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
		dialogNew: {
			ticketDialog: false,
		},
		dialog: false,
		dialogDelete: false,
		singleSelect: false,
		selected: [],
		selected_data: null,
		headers: [
			{
				text: "No.Ticket",
				align: "start",
				sortable: false,
				value: "ticket_number",
			},
			{ text: "Date", value: "open_at", sortable: false },
			{ text: "Subject", value: "subject", sortable: false },
			{ text: "Source", value: "app.name", sortable: false },
			{
				text: "Scope",
				value: "source_data[0].app_table.name",
				sortable: false,
			},
			{
				text: "Assigned to",
				value: "cell_operator.name",
				sortable: false,
			},
			{ text: "Category", value: "category", sortable: false },
			{ text: "Status", value: "ticket_status", sortable: false },
			{
				text: "Latitude",
				value: "source_data[0].user_information.full_address.latitude",
				sortable: false,
			},
			{
				text: "Longitude",
				value: "source_data[0].user_information.full_address.longitude",
				sortable: false,
			},
			{ text: "Actions", value: "actions", sortable: false },
		],
		data: [],
		date_picker_1: false,
		date_picker_2: false,
		date_picker_3: false,
		date_picker_4: false,
		selected_date: "",

		closeat: null,
		user_token: null,
		user: null,
		loading: false,
		opsel: [],
		source: [],
		selected_opsel_temp: 0,
		selected_opsel: 0,
		ticket_summary: [],
		app_id: 0,
		status: [
			{
				id: 1,
				name: "Open",
			},
			{
				id: 2,
				name: "On Progress",
			},
			{
				id: 3,
				name: "Closed",
			},
		],
		category: [
			{
				id: 1,
				name: "Service",
			},
			{
				id: 2,
				name: "Network",
			},
		],
		selected_status: 0,
		province: [],
		city: [],
		district: [],
		sub_district: [],
		selected_province: 0,
		selected_city: 0,
		selected_district: 0,
		selected_sub_district: 0,
		file: null,
		disabled_ticket: false,
		disabled_progress: true,
		pagination: {
			page: 1,
			rowsPerPage: 10,
			totalItems: 0,
			rowsPerPageItems: [10, 50, 100, 250, 500],
		},
		sourceOptions: {
			chart: {
				width: 380,
				type: "donut",
				dropShadow: {
					enabled: true,
					color: "#111",
					top: -1,
					left: 3,
					blur: 3,
					opacity: 0.2,
				},
			},
			stroke: {
				width: 0,
			},
			plotOptions: {
				pie: {
					donut: {
						labels: {
							show: true,
							total: {
								show: true,
								showAlways: true,
								label: "",
								fontSize: "16px",
								fontFamily: "Helvetica, Arial, sans-serif",
								fontWeight: 600,
								color: "#373d3f",
								formatter: function (w) {
									return w.globals.seriesTotals.reduce(
										(a, b) => {
											return a + b;
										},
										0
									);
								},
							},
							value: {
								show: true,
								fontSize: "2.5em",
								fontFamily: "Helvetica, Arial, sans-serif",
								fontWeight: 600,
								color: undefined,
								offsetY: -8,
								formatter: function (val) {
									return val;
								},
							},
						},
					},
				},
			},
			labels: ["Open ", "On Progress ", "Closed "],
			legend: {
				show: true,
				position: "bottom",
				fontSize: "15px",
				fontFamily: "Helvetica, Arial, sans-serif",
				fontWeight: 400,
			},
			dataLabels: {
				enabled: true,
				formatter: function (val, opts) {
					return opts.w.globals.seriesTotals[opts.seriesIndex];
				},
			},
			states: {
				hover: {
					filter: "none",
				},
			},
			colors: ["#F2C94C", "#27AE60", "#56CCF2"],
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
		items: [
			{
				name: "PT Telekomunikasi Seluler",
				data: [50, 100, 200],
			},
			{
				name: "PT Indosat Ooredoo	",
				data: [30, 150, 320],
			},
			{
				name: "PT XL Axiata	",
				data: [20, 10, 170],
			},
			{
				name: "PT Hutchison 3 Indonesia	",
				data: [50, 10, 90],
			},
			{
				name: "PT Smartfren Telecom	",
				data: [60, 260, 100],
			},
			{
				name: "PT Sampoerna Telekomunikasi Indonesia",
				data: [70, 130, 120],
			},
		],
		dataPerOperator: [
			{
				name: "PT Telekomunikasi Seluler",
				logo: Telkomsel,
				data: [4, 2, 2],
				montel: [1, 1, 1],
				qoe: [1, 1, 2],
				qos: [1, 1, 1],
			},
			{
				name: "PT Indosat Ooredoo",
				logo: Indosat,
				data: [5, 2, 3],
				montel: [1, 1, 1],
				qoe: [1, 1, 2],
				qos: [1, 1, 1],
			},
			{
				name: "PT XL Axiata",
				logo: XL,
				data: [8, 4, 2],
				montel: [1, 1, 1],
				qoe: [1, 1, 2],
				qos: [1, 1, 1],
			},
			{
				name: "PT Hutchison 3 Indonesia",
				logo: Tri,
				data: [10, 3, 3],
				montel: [1, 1, 1],
				qoe: [1, 1, 2],
				qos: [1, 1, 1],
			},
			{
				name: "PT Smartfren Telecom",
				logo: Smartfren,
				data: [8, 2, 2],
				montel: [1, 1, 1],
				qoe: [1, 1, 2],
				qos: [1, 1, 1],
			},
			{
				name: "PT Sampoerna Telekomunikasi Indonesia",
				logo: STI,
				data: [6, 3, 3],
				montel: [1, 1, 1],
				qoe: [1, 1, 2],
				qos: [1, 1, 1],
			},
		],
		total_ticket: 0,
		total_open: 0,
		total_in_progress: 0,
		total_closed: 0,
		ticket_search: "",
		operatorType: 1,
	}),

	filters: {
		moment: function (date) {
			return moment(date).format("YYYY-MM-DD HH:mm:ss");
		},
	},

	computed: {
		dateValue: {
			//convert html standard datetime value into local time
			get() {
				return {
					startDate: moment(this.date.startDate)
						.locale("id-ID")
						.format("YYYY-MM-DD"),
					endDate: moment(this.date.endDate)
						.locale("id-ID")
						.format("YYYY-MM-DD"),
				};
			},
		},
		summaryCard() {
			return this.$store.getters.ticketSummaryCardCell;
		},
		openAt: function () {
			return moment(this.selected_data.open_at).format("YYYY-MM-DD");
		},
		closeAt: function () {
			return moment(this.closeat).format("YYYY-MM-DD");
		},
		start_date: function () {
			return this.$store.getters.start_date;
		},
		end_date: function () {
			return this.$store.getters.end_date;
		},
	},
	methods: {
		addActive() {
			this.active = !this.active;
			// console.log(this.active);
		},
		copyLatlong(item) {
			// console.log(item, "item");
			this.copyNotification = true;
			// console.log(this.copyNotification, "copyNotification");
			const lat =
				item.source_data[0].user_information.full_address.latitude;
			const long =
				item.source_data[0].user_information.full_address.longitude;
			const latlong = long + ", " + lat;
			navigator.clipboard.writeText(latlong);
		},
		removeActive() {
			// console.log(e);
			this.active = false;
			// console.log(this.active);
		},

		initialize() {
			this.getTicket();
			this.getApplication();
			this.getOperator();
			this.getTicketStatus();
		},

		async getSummaryByOperators() {
			const data = {
				start_date: this.start_date,
				end_date: this.end_date,
				cell_operator_type: 1,
			};

			fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/id/ticket/summary/operators`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					const arr = [];
					// SELF INVOKE ASYNC FUNC
					(async () => {
						for (let data of result.data) {
							let finalArray = data.data.map(
								({ count }) => count
							);
							arr.push(finalArray);

							for (let opsel of this.opsel) {
								if (data.name == opsel.name) {
									let montelArray = [];
									let qosArray = [];
									let qoeArray = [];
									// GET DATA SUMMARY QOE
									await this.getQOESummary(opsel).then(
										(result) => {
											qoeArray = result;
										}
									);

									// GET DATA SUMMARY MONTEL
									await this.getMontelSummary(opsel).then(
										(result) => {
											montelArray = result;
										}
									);

									// GET DATA SUMMARY QOS
									await this.getQOSSummary(opsel).then(
										(result) => {
											qosArray = result;
										}
									);

									// PUSH DATA
									this.ticket_summary.push({
										data: finalArray,
										logo: opsel.logo,
										name: opsel.name,
										qoe: qoeArray,
										montel: montelArray,
										qos: qosArray,
									});
								}
							}
						}
					})();
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getTicketStatus() {
			const payload = {
				start_date: this.start_date,
				end_date: this.end_date,
				cell_operator_id: 0,
				app_id: 0,
				cell_operator_type: 1,
			};
			this.$store.dispatch("getSummaryTicketCell", payload);
		},

		async getQOESummary(opsel) {
			const data = {
				start_date: this.start_date,
				end_date: this.end_date,
				cell_operator_id: opsel.id,
				app_id: 2,
			};

			return fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/id/ticket/summary/ticket-status`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					let qoeArray = result.data.map(({ count }) => count);
					return Promise.resolve(qoeArray);
				})
				.catch((err) => {
					console.log(err);
				});
		},

		async getQOSSummary(opsel) {
			const data = {
				start_date: "",
				end_date: "",
				cell_operator_id: opsel.id,
				app_id: 3,
			};

			return fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/id/ticket/summary/ticket-status`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					let qosArray = result.data.map(({ count }) => count);
					return Promise.resolve(qosArray);
				})
				.catch((err) => {
					console.log(err);
				});
		},

		async getMontelSummary(opsel) {
			const data = {
				start_date: this.start_date,
				end_date: this.end_date,
				cell_operator_id: opsel.id,
				app_id: 4,
			};

			return fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/id/ticket/summary/ticket-status`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					let montelArray = result.data.map(({ count }) => count);
					return Promise.resolve(montelArray);
				})
				.catch((err) => {
					console.log(err);
				});
		},

		resetFilter() {
			this.date.default = true;
			this.pagination.rowsPerPage = 10;
			this.pagination.page = 1;
			this.selected_opsel_temp = 0;
			this.selected_opsel = 0;
			this.app_id = 0;
			this.selected_status = 0;
			this.date.startDate = moment()
				.subtract(3, "months")
				.format("YYYY-MM-DD");
			this.date.endDate = this.dateCurrent;

			this.getTicket();
		},

		getTicket() {
			this.loading = true;
			this.selected_opsel = this.selected_opsel_temp;
			const data = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "desc",
				start_date: this.start_date,
				end_date: this.end_date,
				cell_operator_id: this.selected_opsel,
				app_id: this.app_id,
				ticket_status_id: this.selected_status,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.ticket_search,
			};
			// console.log(data, "data payload");
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result, "get ticket");
					this.loading_overlay = false;
					if (result.error == true) {
						this.loading = false;
						this.data = [];
						this.$swal({
							text: result.message,
							showConfirmButton: true,
							confirmButtonColor: "#134889",
							timer: 3000,
							icon: "error",
						});
					}
					this.data = result.data.data;
					this.data_download = [];
					result.data.data.forEach((item) => {
						this.data_download.push({
							ticket_number: item.ticket_number
								? item.ticket_number
								: "-",
							date: item.open_at ? item.open_at : "-",
							subject: item.subject ? item.subject : "-",
							source: item.app.name ? item.app.name : "-",
							scope: item.source_data[0].app_table.name
								? item.source_data[0].app_table.name
								: "-",
							assigned_to: item.cell_operator.name
								? item.cell_operator.name
								: "-",
							category: item.category ? item.category : "-",
							status: item.ticket_status.name
								? item.ticket_status.name
								: "-",
							cell_operator_name: item.source_data[0]
								.cell_operator.name
								? item.source_data[0].cell_operator.name
								: "-",
							connection_type: item.source_data[0].connection_type
								? item.source_data[0].connection_type
								: "-",
							download_speed: item.source_data[0].download_speed
								? item.source_data[0].download_speed
								: "-",
							upload_speed: item.source_data[0].upload_speed
								? item.source_data[0].upload_speed
								: "-",
							latency: item.source_data[0].latency
								? item.source_data[0].latency
								: "-",
							jitter: item.source_data[0].jitter
								? item.source_data[0].jitter
								: "-",
							loss: item.source_data[0].loss
								? item.source_data[0].loss
								: "-",
							province:
								item.province && item.province.name != null
									? item.province.name
									: "-",
							city:
								item.city && item.city.name != null
									? item.city.name
									: "-",
							district:
								item.district && item.district.name != null
									? item.district.name
									: "-",
							subdistrict:
								item.district && item.sub_district.name != null
									? item.sub_district.name
									: "-",
							timestamp: item.source_data[0].test_at
								? item.source_data[0].test_at
								: "-",
							source_montel: item.source_data[0].source
								? item.source_data[0].source
								: "-",
							account: item.source_data[0].account
								? item.source_data[0].account
								: "-",
							followers: item.source_data[0].followers
								? item.source_data[0].followers
								: "-",
							content: item.source_data[0].content
								? item.source_data[0].content
								: "-",
							url: item.source_data[0].url
								? item.source_data[0].url
								: "-",
						});
					});
					// this.selected_opsel = 0;
					// this.selected_opsel_temp = 0;
					// this.selected_status = 0;
					// this.app_id = 0;
					this.pagination.page = result.data.pagination.current_page;
					this.pagination.totalItems =
						result.data.pagination.total_page;

					this.loading = false;
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getTicketByRow() {
			this.loading = true;
			this.selected_opsel = this.selected_opsel_temp;
			const data = {
				limit: this.pagination.rowsPerPage,
				page: 1,
				sort: "desc",
				start_date: this.dateValue.startDate,
				end_date: this.dateValue.endDate,
				cell_operator_id: this.selected_opsel,
				app_id: this.app_id,
				ticket_status_id: this.selected_status,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.ticket_search,
			};
			// console.log(data, "data payload");
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result, "get ticket");
					this.loading_overlay = false;
					if (result.error == true) {
						this.loading = false;
						this.data = [];
						this.$swal({
							text: result.message,
							showConfirmButton: true,
							confirmButtonColor: "#134889",
							timer: 3000,
							icon: "error",
						});
					}
					this.data = result.data.data;
					this.data_download = [];
					result.data.data.forEach((item) => {
						this.data_download.push({
							ticket_number: item.ticket_number
								? item.ticket_number
								: "-",
							date: item.open_at ? item.open_at : "-",
							subject: item.subject ? item.subject : "-",
							source: item.app.name ? item.app.name : "-",
							scope: item.source_data[0].app_table.name
								? item.source_data[0].app_table.name
								: "-",
							assigned_to: item.cell_operator.name
								? item.cell_operator.name
								: "-",
							category: item.category ? item.category : "-",
							status: item.ticket_status.name
								? item.ticket_status.name
								: "-",
							cell_operator_name: item.source_data[0]
								.cell_operator.name
								? item.source_data[0].cell_operator.name
								: "-",
							connection_type: item.source_data[0].connection_type
								? item.source_data[0].connection_type
								: "-",
							download_speed: item.source_data[0].download_speed
								? item.source_data[0].download_speed
								: "-",
							upload_speed: item.source_data[0].upload_speed
								? item.source_data[0].upload_speed
								: "-",
							latency: item.source_data[0].latency
								? item.source_data[0].latency
								: "-",
							jitter: item.source_data[0].jitter
								? item.source_data[0].jitter
								: "-",
							loss: item.source_data[0].loss
								? item.source_data[0].loss
								: "-",
							province:
								item.province && item.province.name != null
									? item.province.name
									: "-",
							city:
								item.city && item.city.name != null
									? item.city.name
									: "-",
							district:
								item.district && item.district.name != null
									? item.district.name
									: "-",
							subdistrict:
								item.district && item.sub_district.name != null
									? item.sub_district.name
									: "-",
							timestamp: item.source_data[0].test_at
								? item.source_data[0].test_at
								: "-",
							source_montel: item.source_data[0].source
								? item.source_data[0].source
								: "-",
							account: item.source_data[0].account
								? item.source_data[0].account
								: "-",
							followers: item.source_data[0].followers
								? item.source_data[0].followers
								: "-",
							content: item.source_data[0].content
								? item.source_data[0].content
								: "-",
							url: item.source_data[0].url
								? item.source_data[0].url
								: "-",
						});
					});
					// this.selected_opsel = 0;
					// this.selected_opsel_temp = 0;
					// this.selected_status = 0;
					// this.app_id = 0;
					this.pagination.page = 1;
					this.pagination.totalItems =
						result.data.pagination.total_page;

					this.loading = false;
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getApplication() {
			this.loading = true;
			const data = {
				limit: 100,
				page: 1,
				sort: "asc",
				start_date: "",
				end_date: "",
				search: "",
			};
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/application`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					if (result.error == false) {
						this.source = result.data.data;
						this.loading = false;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getOperator() {
			this.loading = true;
			const data = {
				limit: -1,
				page: 1,
				status: "true",
				sort: "asc",
				type: 1,
			};
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/cell-operator`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					if (result.error == false) {
						this.opsel = result.data.data;
						this.loading = false;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		viewDetail(item) {
			// console.log("viewDetail", item);
			this.dialog = true;
			this.selected_data = item;
			if (item.close_at != null) {
				this.closeat = new Date(item.close_at)
					.toISOString()
					.substr(0, 10);
			} else {
				this.closeat = new Date(
					Date.now() - new Date().getTimezoneOffset() * 60000
				)
					.toISOString()
					.substr(0, 10);
			}

			// console.log(item);
		},

		closeTicket(value) {
			this.loading_overlay = true;
			let closeAt = moment().format("YYYY-MM-DD HH:mm:ss");
			let formData = new FormData();

			formData.append("id", value.id);
			formData.append("cell_operator_id", value.cell_operator_id);
			formData.append("province_id", value.province_id);
			formData.append("city_id", value.city_id);
			formData.append("district_id", value.district_id);
			formData.append("sub_district_id", value.sub_district_id);
			formData.append("ticket_status_id", 3);
			formData.append("category", value.category);
			formData.append("description", value.province_id);
			formData.append("subject", value.subject);
			formData.append("ticket_number", value.ticket_number);
			formData.append("close_at", closeAt);
			formData.append("attachment", value.attachment);

			fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket/update`, {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Bearer ` + this.user_token,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					this.loading_overlay = false;
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
						this.dialog_confirmation_close = false;
						this.selected_ticket = null;
						this.initialize();
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		sendReportTicket(value) {
			this.loading_overlay = true;

			var ids = [];
			if (value.length == undefined) {
				ids.push(value.id);
			} else {
				for (const iterator of value) {
					ids.push(iterator.id);
				}
			}

			let data = {
				ids: JSON.stringify(ids),
			};

			fetch(
				process.env.VUE_APP_API_URL +
					`api/v2/${this.user.language}/ticket/send-ticket-report`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ` + this.user_token,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					this.loading_overlay = false;
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
						this.dialog_confirmation_report = false;
						this.selected_ticket = null;
						this.initialize();
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		inputDate(val) {
			if (val == "table") {
				this.date.defaultTable = false;
			} else {
				this.date.default = false;
			}
		},
		submitFilter() {
			if (this.date.defaultTable == true) {
				this.$swal({
					title: this.$t("ui.message.date_range"),
					icon: "info",
					confirmButtonColor: "#134889",
					showConfirmButton: true,
					timer: 3000,
				});
			} else {
				this.$store.dispatch(GET_START_DATE, this.date.startDate);
				this.$store.dispatch(GET_END_DATE, this.date.endDate);
				this.getTicket();
			}
		},
		submitFilterDate() {
			if (this.date.default == true) {
				this.$swal({
					title: this.$t("ui.message.date_range"),
					confirmButtonColor: "#134889",
					icon: "info",
					showConfirmButton: true,
					timer: 3000,
				});
			} else {
				this.$store.dispatch(GET_START_DATE, this.date.startDate);
				this.$store.dispatch(GET_END_DATE, this.date.endDate);
				this.data = [];
				this.ticket_summary = [];
				this.getSummaryByOperators();
				this.initialize();
			}
		},

		resetFilterDate() {
			this.date.default = true;

			this.$store.dispatch(GET_START_DATE, "");
			this.$store.dispatch(GET_END_DATE, "");
			this.data = [];
			this.ticket_summary = [];
			this.getSummaryByOperators();
			this.initialize();
		},

		closeModal() {
			this.dialog = false;
			this.data = [];
			this.selected_data = null;
			this.tab = null;
			this.initialize();
		},

		showOperatorDetail(item) {
			// console.log(item);
			this.dialog_detail = true;
			this.selected_detail_card = item;
		},
		getCurrentDate() {
			const today = new Date();
			const dd = String(today.getDate()).padStart(2, "0");
			const mm = String(today.getMonth() + 1).padStart(2, "0");
			const yyyy = today.getFullYear();
			this.date.endDate = yyyy + "-" + mm + "-" + dd;
			this.dateCurrent = yyyy + "-" + mm + "-" + dd;
		},
		getThreeMontsAgoDate() {
			const today = new Date();
			const dd = String(today.getDate()).padStart(2, "0");
			const mm = String(today.getMonth() + -2);
			const yyyy = today.getFullYear();
			this.date.startDate = yyyy + "-" + mm + "-" + dd;
			this.dateThreeMonths = yyyy + "-" + mm + "-" + dd;
		},
		ticketSummaryDialog() {
			// console.log("clicked", this.dialog.ticketDialog);
			this.dialogNew.ticketDialog = true;
		},
	},

	created() {
		this.user_token = JwtService.getToken();

		// date_1 = three months ago
		this.date.startDate = moment()
			.subtract(3, "months")
			.format("YYYY-MM-DD");

		this.getCurrentDate();
		// this.getThreeMontsAgoDate();
	},

	mounted() {
		this.user = JwtService.getUser();
		this.$store.dispatch(GET_START_DATE, "");
		this.$store.dispatch(GET_END_DATE, "");
		this.initialize();
		setTimeout(() => {
			this.getSummaryByOperators();
		}, 100);
	},
};
