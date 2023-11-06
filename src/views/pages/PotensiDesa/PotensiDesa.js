import { mixinsPotensiDesaDownload } from "./downloadpotensidesa.mixins.js";
import moment from "moment";
export default {
	mixins: [mixinsPotensiDesaDownload],
	data() {
		return {
			itemDataFetch: [],
			dialogDownloadPotensiDesa: false,
			dropdown: {
				closeOnClick: true,
			},
			pagination: {
				page: 1,
				rowsPerPage: 10,
				totalItems: 1,
				rowsPerPageItems: [10, 50, 100, 250, 500],
				sort: "desc",
			},
			filter: {
				province: 0,
				searchProvince: "",
				city: 0,
				searchCity: "",
				selectCity: true,
				district: 0,
				searchDistrict: "",
				selectDistrict: true,
				subDistrict: 0,
				searchSubDistrict: "",
				selectSubDistrict: true,
				filterCombined: [],
			},
		};
	},
	watch: {
		dialogDownloadPotensiDesa(value) {
			if (!value) {
				this.filterDownload.province = 0;
				this.filterDownload.city = 0;
				this.filterDownload.district = 0;
				this.filterDownload.subDistrict = 0;
				this.filterDownload.searchProvice = "";
				this.filterDownload.searchCity = "All City";
				this.filterDownload.searchDistrict = "All District";
				this.filterDownload.searchSubDistrict = "All Sub District";
				this.filterDownload.selectCity = true;
				this.filterDownload.selectDistrict = true;
				this.filterDownload.selectSubDistrict = true;
				this.dynamicfield.splice(1);
				this.dynamicfield[0].code_category = "";
				this.dynamicfield[0].subcategory = [];
				this.dynamicfield[0].selectReadonly = false;
				this.disableAddField = true;
				this.disabledRemoveField = true;
				this.submitToDownload = true;
			}
		},
	},
	filters: {
		moment(value) {
			return moment(value).format("DD-MM-YYYY - hh:mm");
		},
	},
	computed: {
		headers() {
			return this.$store.getters.headersPotensiDesa;
		},
		dataItems() {
			return this.$store.getters.getDataDesa.data;
		},
		dataLastUpdated() {
			return this.$store.getters.getDataDesa.updated_at;
		},
		dataItemsDummy() {
			// return this.$store.getters.getDataDesa.map((items, index) => ({
			//   ...items,
			//   number: index + 1,
			// }));
			// return this.$store.getters.getDataDesa.data;
			return this.$store.getters.getDataDesaDummy.map((items, index) => ({
				...items,
				number: index + 1,
			}));
		},
		itemProvince() {
			return this.$store.getters.item_province;
		},
		itemCity() {
			return this.$store.getters.item_city;
		},
		itemDistrict() {
			return this.$store.getters.item_district;
		},
		itemSubDistrict() {
			return this.$store.getters.item_sub_district;
		},
		paginationType() {
			const paginationType = {
				page: this.pagination.page,
				rowsPerPage: this.pagination.rowsPerPage,
				totalItems:
					this.$store.getters.getDataDesa.pagination.total_pages,
				sort: this.pagination.sort,
			};
			this.pagination.totalItems =
				this.$store.getters.getDataDesa.pagination.total_pages;

			return paginationType;
		},
		loadingTable() {
			return this.$store.getters.loadingTable;
		},
		loadingField() {
			return this.$store.getters.loading;
		},
		loadingData() {
			return this.$store.getters.loadingData;
		},
		setTablePotensiDesaParams() {
			return this.$store.getters.tablePotensiDesa;
		},
	},
	methods: {
		capitalize(word) {
			return word
				.toLowerCase()
				.replace(/\w/, (firstLetter) => firstLetter.toUpperCase());
		},
		initialize() {
			this.$store.commit("loadingData", true);

			// fetch data : Provinsi
			this.$store.dispatch("getProvince");

			// fetch data : Kabupaten/Kota
			// this.$store.dispatch("getCity");

			// fetch data : Kecamatan/Distrik
			// this.$store.dispatch("getDistrict");

			// fetch data : Kelurahan/Desa
			// this.$store.dispatch("getSubDistrict");

			//fetch data : Category
			this.$store.dispatch(
				"fetchPotensiDesaCategoryNonTable",
				this.setTableCategoryParams
			);
		},
		locationFilter() {
			const location = [];

			if (this.filter.province != 0) {
				location.push(["province_id", this.filter.province]);
			}
			if (this.filter.city != 0) {
				location.push(["city_id", this.filter.city]);
			}
			if (this.filter.district != 0) {
				location.push(["district_id", this.filter.district]);
			}
			if (this.filter.subDistrict != 0) {
				location.push(["sub_district_id", this.filter.subDistrict]);
			}
			const locationInString = JSON.stringify(location);
			// const location = `[["province_id",${this.filter.province}],["city_id", ${this.filter.city}],["district_id", ${this.filter.district}],["sub_district_id", ${this.filter.subDistrict}]]`;
			this.filter.filterCombined = `${locationInString}`;
			this.pagination.page = 1;
			this.setTable();
		},
		initializePotensiDesa(payload) {
			return this.$store.dispatch("fetchPotensiDesa", payload);
		},
		getCity() {
			if (!this.dialogDownloadPotensiDesa) {
				this.filter.selectCity = false;
				this.$store.dispatch("getCity", this.filter.province);
			} else {
				if (this.filterDownload.province != 0) {
					this.submitToDownload = false;
				} else {
					this.submitToDownload = true;
				}
				this.filterDownload.selectCity = false;
				this.$store.dispatch("getCity", this.filterDownload.province);
			}
		},
		getDistrict() {
			if (!this.dialogDownloadPotensiDesa) {
				this.filter.selectDistrict = false;
				this.$store.dispatch("getDistrict", this.filter.city);
			} else {
				this.filterDownload.selectDistrict = false;
				this.$store.dispatch("getDistrict", this.filterDownload.city);
			}
		},
		getSubDistrict() {
			if (!this.dialogDownloadPotensiDesa) {
				this.filter.selectSubDistrict = false;
				this.$store.dispatch("getSubDistrict", this.filter.district);
			} else {
				this.filterDownload.selectSubDistrict = false;
				this.$store.dispatch(
					"getSubDistrict",
					this.filterDownload.district
				);
			}
		},
		reset() {
			this.$store.commit("loadingTable", true);
			this.filter.province = 0;
			this.filter.city = 0;
			this.filter.district = 0;
			this.filter.subDistrict = 0;
			this.filter.searchProvice = "";
			this.filter.searchCity = "All City";
			this.filter.searchDistrict = "All District";
			this.filter.searchSubDistrict = "All Sub District";
			this.filter.selectCity = true;
			this.filter.selectDistrict = true;
			this.filter.selectSubDistrict = true;
			this.pagination.page = 1;
			this.pagination.rowsPerPage = 10;
			this.initializePotensiDesa(this.setTablePotensiDesaParams);
		},
		setTable() {
			const payload = {
				limit: this.paginationType.rowsPerPage,
				page: this.paginationType.page,
				sort: this.pagination.sort,
				filters: this.filter.filterCombined,
			};

			this.$store.commit("loadingTable", true);
			this.initializePotensiDesa(payload);
		},
		resetData() {
			this.pagination.page = 1;
			this.pagination.rowsPerPage = 10;
			this.$store.commit("loadingTable", true);
			this.initializePotensiDesa(this.setTablePotensiDesaParams);
		},
		setTableLimit() {
			const payload = {
				limit: this.paginationType.rowsPerPage,
				page: this.page,
				sort: this.pagination.sort,
				filters: this.filter.filterCombined,
			};
			this.pagination.page = 1;
			this.pagination.totalItems = 1;
			this.$store.commit("loadingTable", true);
			this.initializePotensiDesa(payload);
		},
		deleteItem(val) {
			this.$swal({
				title: "Do you want to delete this?",
				icon: "question",
				showCloseButton: true,
				showConfirmButton: true,
				showDenyButton: true,
				confirmButtonColor: "#134889",
				confirmButtonText: "Yes",
				denyButtonColor: "#cfcfcf",
				denyButtonText: `Cancel`,
			}).then((result) => {
				if (result.isConfirmed) {
					this.$store
						.dispatch("deletePotensiDesa", val)
						.then((result) => {
							if (result.error != true) {
								const payload = {
									limit: this.paginationType.rowsPerPage,
									page: this.paginationType.page,
									sort: this.pagination.sort,
									filters: this.filter.filterCombined,
								};
								// console.log(payload);
								this.$store.commit("loadingTable", true);
								this.$store.dispatch(
									"fetchPotensiDesa",
									payload
								);
								this.$swal({
									title: "Success deleted",
									icon: "success",
									showConfirmButton: true,
									confirmButtonColor: "#134889",
									timer: 3000,
								});
							} else {
								this.$swal({
									title: "Failure",
									text: result.message,
									icon: "error",
									showConfirmButton: true,
									confirmButtonColor: "#134889",
									timer: 3000,
								});
							}
						})
						.catch((error) => {
							console.log(error);
						});
				} else if (result.isDenied) {
					console.log(`Delete canceled`);
				}
			});
		},
		toDetails(item) {
			console.log(item);
			this.$router.push("potensi-desa/details/" + item.sub_district_id);
		},
		toCreate() {
			this.$router.push("potensi-desa/create");
		},
		toEdit(item) {
			this.$router.push("potensi-desa/edit/" + item);
			console.log(item);
		},
	},
	created() {
		// console.log(this.$store.getters.tablePotensiDesa);
		this.initializePotensiDesa(this.setTablePotensiDesaParams);
		this.initialize();
	},
	mounted() {
		// console.log(
		//   (this.userData.role == "operator" || this.userData.role == "executive") ==
		//     true
		// );
		// this.dialogDownloadPotensiDesa = true;
		// console.log(this.$store.getters);
	},
};
