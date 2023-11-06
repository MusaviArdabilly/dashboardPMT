import moment from "moment";
import { GET_OPSEL } from "../../../../../store/modules/opsel.module";
import JwtServices from "../../../../../services/jwt.services";

export default {
	props: ["province", "city", "district", "date_1", "date_2"],
	data: () => ({
		dialog: false,
		dialogQuality: false,
		selected_item: null,
		technology: [
			{
				name: "All Technology",
				id: 0,
			},
			{
				name: "2G",
				id: 1,
			},
			{
				name: "3G",
				id: 2,
			},
			{
				name: "4G",
				id: 3,
			},
			{
				name: "5G",
				id: 4,
			},
		],
		singleSelect: false,
		selected: [],
		headers: [
			{
				text: "Tanggal Pengetesan",
				align: "start",
				sortable: false,
				value: "test_date",
			},
			{ text: "Provinsi", value: "province.name", sortable: false },
			{ text: "Kota/Kab.", value: "city.name", sortable: false },
			{ text: "Kecamatan", value: "district", sortable: false },
			{ text: "POI", value: "poi", sortable: false },
			{ text: "Location", value: "location", sortable: false },
			{ text: "Event", value: "event", sortable: false },
			{ text: "Operator", value: "cell_operator.name", sortable: false },
			{ text: "Test Type", value: "test_type", sortable: false },
			{
				text: "Test Result Data",
				value: "test_result_data",
				sortable: false,
			},
		],

		selected_tech: "All Technology",
		selected_opsel_temp: 0,
		qos_test: [],
		loading: false,
		pagination: {
			page: 1,
			rowsPerPage: 10,
			totalItems: 0,
			rowsPerPageItems: [10, 50, 100, 250, 500],
		},
		json_fields: {
			ISP: "cell_operator.name",
			"CONNECTION TYPE": "connection_type",
			"SIGNAL STERNGTH": "signal_strength",
			URL: "url",
			THROUGHPUT: "throughput",
			"LOADING TIME": "loading_time",
			PROVINCE: "province.name",
			CITY: "city.name",
			DISTRICT: "district.name",
			"SUB DISTRICT": "sub_district.name",
			TIMESTAMP: "test_at",
			NAME: "user_information.name",
			EMAIL: "user_information.email",
			DEVICE: "user_information.device",
			LATITUDE: "user_information.full_address.latitude",
			LONGITUDE: "user_information.full_address.longitude",
			"IP ADDRESS": "user_information.ip",
		},
		json_meta: [
			[
				{
					key: "charset",
					value: "utf-8",
				},
			],
		],
	}),

	filters: {
		moment: function (date) {
			// console.log(date);
			return moment(date).format("DD MMMM YYYY HH:mm:ss");
		},
	},

	computed: {
		item_opsel: function () {
			return this.$store.getters.item_opsel;
		},
	},

	methods: {
		initialize() {
			const payload = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "DESC",
				start_date: this.date_1,
				end_date: this.date_2,
				cell_operator_id: this.selected_opsel_temp,
				province_id: this.province,
				city_id: this.city,
				district_id: this.district,
				sub_district_id: 0,
				poi: "",
				event: "",
			};
			this.getQoS(payload);
		},

		getQoS(payload) {
			this.loading = true;

			fetch(process.env.VUE_APP_API_URL + `api/v1/id/qos/`, {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JwtServices.getToken()}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					this.$emit("turnOffLoading");
					if (result.data == null) {
						this.loading = false;
						this.qos_test = [];
						// console.log(this.qos_test);
					} else {
						this.loading = false;
						this.qos_test = result.data;
						this.pagination.page =
							result.data.pagination.current_page;
						this.pagination.totalItems =
							result.data.pagination.total_page;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getOpsel() {
			this.$store.dispatch(GET_OPSEL);
		},

		viewModal(item) {
			this.dialog = true;
			this.selected_item = item;
			// console.log(this.selected_item);
		},

		viewModalQuality() {
			this.dialogQuality = true;
		},

		setTableLimit() {
			this.pagination.page = 1;
			const payload = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "DESC",
				start_date: this.date_1,
				end_date: this.date_2,
				cell_operator_id: this.selected_opsel_temp,
				province_id: this.province,
				city_id: this.city,
				district_id: this.disctrict,
				sub_district_id: 0,
				poi: "",
				event: "",
			};
			this.getQoS(payload);
		},
		setTable() {
			const payload = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "DESC",
				start_date: this.date_1,
				end_date: this.date_2,
				cell_operator_id: this.selected_opsel_temp,
				province_id: this.province,
				city_id: this.city,
				district_id: this.disctrict,
				sub_district_id: 0,
				poi: "",
				event: "",
			};
			this.getQoS(payload);
		},
		filterOperator() {
			this.pagination.page = 1;
			const payload = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "DESC",
				start_date: this.date_1,
				end_date: this.date_2,
				cell_operator_id: this.selected_opsel_temp,
				province_id: this.province,
				city_id: this.city,
				district_id: this.disctrict,
				sub_district_id: 0,
				poi: "",
				event: "",
			};
			this.getQoS(payload);
		},
		reset() {
			this.pagination.page = 1;
			this.pagination.rowsPerPage = 10;
			this.selected_opsel_temp = 0;
			const payload = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: "DESC",
				start_date: this.date_1,
				end_date: this.date_2,
				cell_operator_id: this.selected_opsel_temp,
				province_id: this.province,
				city_id: this.city,
				district_id: this.disctrict,
				sub_district_id: 0,
				poi: "",
				event: "",
			};
			this.getQoS(payload);
		},
		downloadFile(file) {
			// console.log(file);
			//pmt-api.kominfo.go.id/upload/qos/excel/20220124-XLS-6RPK5L.xlsx
			fetch(`${process.env.VUE_APP_API_URL}upload/qos/excel/${file}.xlsx`)
				.then((response) => response.blob())
				.then((blob) => {
					var url = window.URL.createObjectURL(blob);
					var a = document.createElement("a");
					a.href = url;
					a.download = `${file}.xlsx`;
					document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
					a.click();
					a.remove(); //afterwards we remove the element again
				});
		},
	},

	created() {
		this.initialize();
		this.getOpsel();
	},
};
