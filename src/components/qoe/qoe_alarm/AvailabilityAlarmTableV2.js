import JwtService from "../../../services/jwt.services";

import moment from "moment";
import { GET_ALARM } from "../../../store/modules/qoe.module";
import { GET_OPSEL } from "../../../store/modules/opsel.module";
export default {
	data: () => ({
		dialog: false,
		menu: false,
		app_name: "",
		date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
			.toISOString()
			.substr(0, 10),
		list_category: [
			{
				id: 1,
				name: "Service",
			},
			{
				id: 2,
				name: "Network",
			},
		],
		province: [],
		city: [],
		district: [],
		copyNotification: false,
		sub_district: [],
		selected_province: 0,
		selected_city: 0,
		selected_district: 0,
		selected_sub_district: 0,
		selected_cell_operator: 0,
		category: "",
		subject: "",
		description: "",
		attachment: null,
		selected_data: {
			province_id: 0,
			city_id: 0,
			cell_operator_id: 0,
		},
		form_create: {},
		singleSelect: true,
		selected: [],
		headers: [
			{ text: "USERNAME", value: "username", sortable: false },
			{
				text: "IMEI",
				value: "imei",
				sortable: false,
			},
			{
				text: "CELL OPERATOR",
				value: "cell_operator.name",
				sortable: false,
			},
			{ text: "STATUS", value: "is_resolved", sortable: false },
			{ text: "OFFLINE TIME", value: "created_at", sortable: false },
			{ text: "ONLINE TIME", value: "updated_at", sortable: false },
			{
				text: "PROVINCE",
				value: "user_information.full_address.provinsi",
				sortable: false,
			},
			{
				text: "CITY",
				value: "user_information.full_address.kota_kabupaten",
				sortable: false,
			},
			{
				text: "DISTRICT",
				value: "user_information.full_address.kecamatan",
				sortable: false,
			},
			{
				text: "SUB DISTRICT",
				value: "user_information.full_address.kelurahan",
				sortable: false,
			},
			{
				text: "LATITUDE",
				value: "user_information.full_address.latitude",
				sortable: false,
			},
			{
				text: "LONGITUDE",
				value: "user_information.full_address.longitude",
				sortable: false,
			},
			{ text: "", value: "actions", sortable: false },
		],
		pagination: {
			page: 1,
			rowsPerPage: 10,
			totalItems: 0,
			rowsPerPageItems: [10, 50, 100, 250, 500],
		},
		search: "",
		sort: "desc",
		loading_overlay: false,
		loading: false,
		status: [
			{
				id: "",
				name: "All Status",
			},
			{
				id: "Open",
				name: "Open",
			},
			{
				id: "Resolved",
				name: "Resolved",
			},
		],
		selected_status: "",
		selected_opsel_temp: 0,
		selected_opsel: 0,
	}),

	filters: {
		moment: function (date) {
			return moment(date).format("DD/MM/YYYY - hh:mm:ss");
		},
	},

	computed: {
		start_date: function () {
			return this.$store.getters.start_date;
		},

		end_date: function () {
			return this.$store.getters.end_date;
		},

		alarm: function () {
			return this.$store.getters.alarm;
		},

		item_opsel: function () {
			return this.$store.getters.item_opsel;
		},

		opsel: function () {
			return this.$store.getters.getOpsel;
		},
	},

	mounted() {
		this.user = JwtService.getUser();
		this.user_token = JwtService.getToken();
		this.initialize();
	},

	methods: {
		initialize() {
			this.getOperatorCellular();
			this.getProvince();
			this.getAlarm();
		},
		copyLatlong(item) {
			// console.log(item.user_information.full_address.latitude);
			const lat = item.user_information.full_address.latitude;
			const long = item.user_information.full_address.longitude;
			const latlong = long + ", " + lat;
			navigator.clipboard.writeText(latlong);
			this.copyNotification = true;
		},
		getAlarm() {
			this.loading = true;
			if (this.search.length != 0 && this.search.length < 3) {
				return;
			}

			if (this.selected_tech == "All Technology") {
				this.connection_type = "";
			} else {
				this.connection_type = this.selected_tech;
			}

			this.selected_opsel = this.selected_opsel_temp;
			this.selected = [];

			const data = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: this.sort,
				start_date: "",
				end_date: "",
				cell_operator_id: this.selected_opsel,
				status: this.selected_status,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};

			this.$store.dispatch(GET_ALARM, data).then((result) => {
				if (result.error) {
					this.pagination.page = 1;
					this.pagination.totalItems = 0;
					this.loading = false;
					return;
				}
				this.loading = false;
				this.pagination.page = result.data.pagination.current_page;
				this.pagination.totalItems = result.data.pagination.total_page;
			});
		},
		getAlarmByTableRow() {
			this.loading = true;
			if (this.search.length != 0 && this.search.length < 3) {
				return;
			}

			if (this.selected_tech == "All Technology") {
				this.connection_type = "";
			} else {
				this.connection_type = this.selected_tech;
			}

			this.selected_opsel = this.selected_opsel_temp;
			this.selected = [];

			const data = {
				limit: this.pagination.rowsPerPage,
				page: 1,
				sort: this.sort,
				start_date: "",
				end_date: "",
				cell_operator_id: this.selected_opsel,
				status: this.selected_status,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};

			this.$store.dispatch(GET_ALARM, data).then((result) => {
				if (result.error) {
					this.pagination.page = 1;
					this.pagination.totalItems = 0;
					this.lading = false;
					return;
				}
				this.loading = false;
				this.pagination.page = 1;
				this.pagination.totalItems = result.data.pagination.total_page;
			});
		},
		getProvince() {
			const data = {
				limit: 100,
				page: 1,
				sort: "asc",
				start_date: "",
				end_date: "",
				search: "",
			};
			fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/${this.user.language}/location/province`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => {
					if (response.status == 401) {
						this.logout();
						return;
					}
					return response.json();
				})
				.then((result) => {
					// console.log(result);
					if (result.error == false) {
						this.province = result.data.data;
						if (this.selected_province != 0) {
							this.getCity();
						}
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getCity() {
			const data = {
				limit: 100,
				page: 1,
				sort: "asc",
				start_date: "",
				end_date: "",
				search: "",
				province_id: this.selected_province,
			};
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => {
					if (response.status == 401) {
						this.logout();
						return;
					}
					return response.json();
				})
				.then((result) => {
					// console.log(result);
					if (result.error == false) {
						this.city = result.data.data;

						if (this.selected_city != 0) {
							this.getDistrict();
						}
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getDistrict() {
			const data = {
				limit: 100,
				page: 1,
				sort: "asc",
				start_date: "",
				end_date: "",
				search: "",
				city_id: this.selected_city,
			};
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => {
					if (response.status == 401) {
						this.logout();
						return;
					}
					return response.json();
				})
				.then((result) => {
					// console.log(result);
					if (result.error == false) {
						this.district = result.data.data;
						if (this.selected_district != 0) {
							this.getSubDistrict();
						}
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getSubDistrict() {
			const data = {
				limit: 100,
				page: 1,
				sort: "asc",
				start_date: "",
				end_date: "",
				search: "",
				district_id: this.selected_district,
			};
			fetch(
				process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => {
					if (response.status == 401) {
						this.logout();
						return;
					}
					return response.json();
				})
				.then((result) => {
					// console.log(result);
					if (result.error == false) {
						this.sub_district = result.data.data;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		logout() {
			localStorage.removeItem("user");
			this.$router.push({ name: "Login" });
		},

		getOperatorCellular() {
			this.$store.dispatch(GET_OPSEL);
		},

		setupCreateTicket() {
			this.dialog = true;
			this.app_name = this.selected[0].app.name;
			this.selected_cell_operator = this.selected[0].cell_operator_id;
		},

		createTicket() {
			let data = new FormData();

			// MAPPING DATA FOR CREATE
			this.form_create = {
				app_id: this.selected[0].app_id,
				cell_operator_id: this.selected_opsel,
				province_id: this.selected_province,
				city_id: this.selected_city,
				district_id: this.selected_district,
				sub_district_id: this.selected_sub_district,
				ticket_status_id: 1, //open
				source_name: this.selected[0].app.key,
				category: this.category,
				subject: this.subject,
				description: this.description,
				open_at: this.date + " 00:00:00",
				attachment: this.attachment,
				source_data: JSON.stringify(this.selected),
			};

			for (let key in this.form_create) {
				if (Object.hasOwnProperty.call(this.form_create, key)) {
					data.append(key, this.form_create[key]);
				}
			}

			fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/${this.user.language}/ticket/create`,
				{
					method: "POST",
					body: data,
					headers: {
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => {
					if (response.status == 401) {
						this.logout();
						return;
					}
					return response.json();
				})
				.then((result) => {
					if (result.error == true) {
						this.$swal({
							text: result.message,
							timer: 1000,
							showConfirmButton: false,
							icon: "error",
						});
					} else {
						this.dialog = false;
						this.$swal({
							text: result.message,
							timer: 1000,
							showConfirmButton: false,
							icon: "success",
						});
						this.getAlarm();
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		row_resolved(item) {
			if (item.is_resolved == false) {
				return "red--text";
			}
		},

		applyFilter() {
			const data = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: this.sort,
				start_date: "",
				end_date: "",
				cell_operator_id: this.selected_opsel_temp,
				status: this.selected_status,
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};

			this.$store.dispatch(GET_ALARM, data).then((result) => {
				if (result.error) {
					this.pagination.page = 1;
					this.pagination.totalItems = 0;
					return;
				}
				// console.log("ALARM", result);
				this.pagination.page = result.data.pagination.current_page;
				this.pagination.totalItems = result.data.pagination.total_page;
			});
		},

		resetFilter() {
			this.alarm = [];
			this.selected_opsel_temp = 0;
			this.selected_status = "All Status";
			this.initialize();
		},

		resetPaginate() {
			this.pagination.page = 1;
		},
	},
};
