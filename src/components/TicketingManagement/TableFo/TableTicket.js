import moment from "moment";
import TabTicket from "../Fo/TabTicket.vue";
import TabProgress from "../Fo/TabProgress.vue";
import TabDetails from "../Fo/TabDetails.vue";
import JwtService from "../../../services/jwt.services";
import { mixinsTicketingManagement } from "../mixins/mixinsTicketingManagement";
export default {
	mixins: [mixinsTicketingManagement],
	data() {
		return {
			copyNotification: false,
			date_picker_1: false,
			date_picker_2: false,
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
			dateCurrent: "",
			dateThreeMonths: "",
			source: [],
			data: [],
			loadingTable: false,
			dialog: false,
			app_id: 0,
			loading: false,
			loading_overlay: false,
			selected: [],
			dialog_confirmation_close: false,
			dialog_confirmation_report: false,
			selected_ticket: null,
			selected_data: null,
			selectOperator: 0,
			selectStatus: 0,
			search: "",
			singleSelect: false,
			tab: null,
			data_download: [],
			pagination: {
				page: 1,
				rowsPerPage: 10,
				totalItems: 0,
				rowsPerPageItems: [10, 50, 100, 250, 500],
				loadedPagination: true,
			},
			json_fields: {
				"NO TICKET": "ticket_number",
				DATE: "date",
				SUBJECT: "subject",
				SOURCE: "source",
				SCOPE: "scope",
				"ASSIGNED TO": "assigned_to",
				CATEGORY: "category",
				STATUS: "status",
				ISP: "cell_operator_name",
				"Connection Type": "connection_type",
				"Download Speed": "download_speed",
				"Upload Speed": "upload_speed",
				Latency: "latency",
				Loss: "loss",
				Jitter: "jitter",
				Province: "province",
				City: "city",
				District: "district",
				Subdistrict: "subdistrict",
				Timestamp: "timestamp",
				Source: "source_montel",
				Account: "account",
				Followers: "followers",
				Content: "content",
				URL: "url",
			},
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
			user_token: null,
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
			operatorType: 2,
		};
	},
	filters: {
		moment: function (date) {
			return moment(date).format("YYYY-MM-DD HH:mm:ss");
		},
	},
	computed: {
		dateDisplay: {
			//convert html standard datetime value into local time
			get() {
				return {
					startDate: moment(this.date.startDate)
						.locale("id-ID")
						.format("DD-MM-YYYY"),
					endDate: moment(this.date.endDate)
						.locale("id-ID")
						.format("DD-MM-YYYY"),
					threemonthago: moment()
						.subtract(2, "month")
						.format("YYYY-MM-DD"),
				};
			},
		},
		itemOperator() {
			return this.$store.getters.item_opselFo;
		},
	},
	methods: {
		initialize() {
			setTimeout(() => {
				const data = {
					limit: 10,
					page: 1,
					sort: "desc",
					cell_operator_type: 2,
					start_date: "",
					end_date: "",
					cell_operator_id: 0,
					app_id: 0,
					ticket_status_id: 0,
					province_id: 0,
					city_id: 0,
					district_id: 0,
					sub_district_id: 0,
					search: "",
				};
				// console.log(data, "payload");
				this.fetchGetTicket(data);
				this.getApplication();
			}, 100);
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
		getTicket() {
			this.loading = true;
			const data = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "desc",
				cell_operator_type: 2,
				start_date: this.date.startDate,
				end_date: this.date.endDate,
				cell_operator_id: this.selectOperator,
				app_id: this.app_id,
				ticket_status_id: this.selectStatus,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};
			// console.log(data, "payload");
			this.fetchGetTicket(data);
		},
		fetchGetTicket(payload) {
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket`, {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					this.loading_overlay = false;
					this.loading = false;
					// console.log(result.data, "result");
					if (result.error == true) {
						this.data = [];
						this.data_download = [];
					} else {
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
								connection_type: item.source_data[0]
									.connection_type
									? item.source_data[0].connection_type
									: "-",
								download_speed: item.source_data[0]
									.download_speed
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
									item.district &&
									item.sub_district.name != null
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
						// console.log(this.data, "data");

						this.pagination.page =
							result.data.pagination.current_page;
						if (result.data.pagination.total_page != undefined) {
							this.pagination.totalItems =
								result.data.pagination.total_page;
						}
						this.loading = false;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getTicketByRow() {
			this.loading = true;

			const data = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "desc",
				cell_operator_type: 2,
				start_date: this.date.startDate,
				end_date: this.date.endDate,
				cell_operator_id: this.selectOperator,
				app_id: this.app_id,
				ticket_status_id: this.selectStatus,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};
			// console.log(data, "payload");
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
					// console.log(result.data, "result");
					this.loading_overlay = false;
					if (result.error == true) {
						this.data = [];
						this.data_download = [];
						this.loading = false;
					} else {
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
								connection_type: item.source_data[0]
									.connection_type
									? item.source_data[0].connection_type
									: "-",
								download_speed: item.source_data[0]
									.download_speed
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
									item.district &&
									item.sub_district.name != null
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
						// console.log(this.data, "data");

						this.pagination.page = 1;
						this.pagination.totalItems =
							result.data.pagination.total_page;

						this.loading = false;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getApplication() {
			// this.loading = true;
			const data = {
				limit: 100,
				page: 1,
				sort: "desc",
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
		resetFilter() {
			this.pagination.rowsPerPage = 10;
			this.pagination.page = 1;
			this.selectOperator = 0;
			this.app_id = 0;
			this.search = "";
			this.selectStatus = 0;
			this.loading = true;
			this.data_download = [];
			this.initialize();
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
		closeModal() {
			this.loading = true;
			this.loading = true;
			this.dialog = false;
			this.data = [];
			this.selected_data = null;
			this.tab = null;
			this.initialize();
		},
		sendReportTicket(value) {
			// console.log(value);
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
					`api/v2/id/ticket/send-ticket-report`,
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
		inputDate(val) {
			if (val == "table") {
				this.date.defaultTable = false;
			} else {
				this.date.default = false;
			}
		},
	},
	created() {
		this.user_token = JwtService.getToken();
		this.getCurrentDate();
		this.date.startDate = moment()
			.subtract(2, "month")
			.format("YYYY-MM-DD");
	},
	mounted() {
		this.initialize();
	},
};
