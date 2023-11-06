import moment from "moment";
export default {
	data() {
		return {
			sortBy: "name",
			delete_id: null,
			formSubmit: {
				name: "",
				description: "",
				unit: "",
				category_id: { id: "", name: "" },
				data_type: "",
				option: [],
				is_on_table: null,
				is_show_on_pop_up: null,
			},
			weightItems: [
				{ text: "Besar", value: "besar" },
				{ text: "Menengah", value: "menengah" },
				{ text: "Kecil", value: "kecil" },
			],
			select_data_type: { name: "string" },
			is_type_was_select: false,
			search: "",
			weihgtData: [],
			selectedCategory: null,
			firstLoad: true,
			sortDesc: false,
			is_calculated: null,
			is_used_by_calculation: null,
			itemsNeedFormula: [
				{ text: "Yes", value: true },
				{ text: "No", value: false },
			],
			itemsNeedCalculation: [
				{ text: "Yes", value: true },
				{ text: "No", value: false },
			],
			user_token: null,
			pagination: {
				page: 1,
				rowsPerPage: 10,
				totalItems: 0,
				rowsPerPageItems: [10, 50, 100, 250, 500],
				sort: "desc",
			},
			dynamicField: [{ value: "" }, { weight: "" }],
		};
	},
	watch: {
		"formSubmit.data_type": {
			handler(value) {
				if (value === "select") {
					this.is_type_was_select = true;
				} else {
					this.dynamicField = [{ value: "" }];
					this.is_type_was_select = false;
				}
			},
			deep: true,
		},
		"formUpdate.data_type.name": {
			handler(value) {
				if (value === "select") {
					this.is_type_was_select = true;
				} else {
					this.dynamicField = [{ value: "" }];
					this.is_type_was_select = false;
				}
			},
			deep: true,
		},
		isEditDialog(value) {
			if (!value) {
				this.dynamicField = [{ value: "" }];
				this.is_type_was_select = false;
			}
		},
		isAddDialog(value) {
			if (!value) {
				this.dynamicField = [{ value: "" }];
				this.is_type_was_select = false;
			}
		},
	},
	computed: {
		isAddDialog() {
			return this.$store.getters.isAddDialog;
		},
		isEditDialog() {
			return this.$store.getters.isEditDialog;
		},
		isLoading() {
			return this.$store.getters.isLoading;
		},
		headers() {
			return this.$store.getters.headersSubCategory;
		},
		setTableSubCategoryParams() {
			return this.$store.getters.tableSubCategory;
		},
		dataSubCategory() {
			return this.$store.getters.getDataSubcategoryDesa.data;
		},
		select_category_items: {
			get() {
				return this.$store.getters.getPotensiDesaCategory.data;
			},
		},
		paginationType: {
			get() {
				const paginationType = {
					page: this.pagination.page,
					rowsPerPage: this.pagination.rowsPerPage,
					totalItems:
						this.$store.getters.getDataSubcategoryDesa.pagination
							.total_page,
					sort: this.pagination.sort,
				};
				this.pagination.totalItems =
					this.$store.getters.getDataSubcategoryDesa.pagination.total_page;
				return paginationType;
			},
		},
		formUpdate() {
			return this.$store.getters.getDataSubcategoryDesaById;
		},
		weightSubmit() {
			const weights = [];
			this.dynamicField.forEach((item) => {
				weights.push(item.weight.toString());
			});
			return weights.toString();
		},
		select_data_type_items() {
			return this.$store.getters.getDataSubCategoryDataType;
		},
		mergerValueOptions() {
			const valueOption = [];
			this.dynamicField.forEach(({ value }) => {
				valueOption.push(value.toString());
			});
			return valueOption.toString();
		},
		loading() {
			return this.$store.getters.loaders;
		},
		loadingTable() {
			return this.$store.getters.loadingTable;
		},
		isLoadingContent() {
			return this.$store.getters.loadingContent;
		},
		error() {
			return this.$store.getters.response;
		},
		errorCommit() {
			return this.$store.getters.responseCommit;
		},
		errorMessage() {
			return this.$store.getters.errorMessageSubcategory;
		},
	},
	methods: {
		openAddDialog() {
			this.$store.commit("setAddDialog", true);
		},
		closeAddDialog() {
			this.$store.commit("setAddDialog", false);
			this.formSubmit = {
				name: "",
				description: "",
				unit: "",
				category_id: { id: "", name: "" },
				data_type: { name: "" },
				is_on_table: null,
			};
		},
		closeEditDialog() {
			this.$store.commit("setEditDialog", false);
		},
		getDataByFilter() {
			if (this.search.length < 3 && this.search.length != 0) {
				return;
			}

			if (this.search != "") {
				this.pagination.page = 1;
			}
			this.$store.commit("setLoading", true);
			let payload = {
				limit: this.paginationType.rowsPerPage,
				page: this.paginationType.page,
				sort: this.pagination.sort,
				search: this.search,
				category_id: this.selectedCategory,
				is_calculated: this.is_calculated,
				is_used_by_calculation: this.is_used_by_calculation,
			};
			// console.log(payload, "pld getby");
			this.getDataSubcategory(payload);
		},
		async initialize() {
			this.$store.commit("loadingTable", true);
			this.$store.commit("setLoading", true);
			this.pagination.page = 1;
			this.pagination.rowsPerPage = 10;
			this.search = "";

			//page load request subcategory
			await this.getDataSubcategory(this.setTableSubCategoryParams);

			// request subcategory data type
			const requestDataType = {
				name: "sd_potential_data_type",
			};
			this.getDataType(requestDataType);

			//request category and commit
			const requestCategory = {
				limit: -1,
				page: 1,
				sort: "asc",
				search: "",
			};
			this.getDataCategory(requestCategory);
		},
		handleSort(val) {
			this.pagination.sort = val;
			this.setSubCategoryTable();
		},
		getDataCategory(value) {
			this.$store.dispatch("fetchPotensiDesaCategory", value);
		},
		getDataSubcategory(value) {
			this.$store.dispatch("fetchPotensiDesaSubcategory", value);
		},
		getDataSubcategoryByLimit() {
			const data = {
				limit: this.pagination.rowsPerPage,
				page: 1,
				sort: "asc",
				search: this.search,
			};
			this.pagination.page = 1;
			this.$store.commit("loadingTable", true);
			this.getDataSubcategory(data);
		},
		async getDataSubcategoryById(item) {
			this.$store.commit("setEditDialog", true);
			this.$store.commit("fetchSubCategoryById", item);
			// console.log(this.formUpdate);
		},
		getDataType(value) {
			this.$store.dispatch("fetchPotensiDesaSubcategoryDataType", value);
		},
		submitAddData() {
			const payload = {
				name: this.formSubmit.name,
				description: this.formSubmit.description,
				category_id: this.formSubmit.category_id,
				unit: this.formSubmit.unit,
				is_on_table: this.formSubmit.is_on_table,
				is_show_on_pop_up: this.formSubmit.is_show_on_pop_up,
				data_type: this.formSubmit.data_type,
			};
			if (this.formSubmit.data_type == "select") {
				payload.option = this.mergerValueOptions;
				payload.weight = this.weightSubmit;
			}

			// console.log("payload add", payload);
			this.$store
				.dispatch("createPotensiDesaSubCategory", payload)
				.then(() => {
					this.$swal({
						title: "Berhasil Create",
						icon: "success",
						showConfirmButton: true,
						confirmButtonColor: "#134889",
						timer: 3000,
					})
						.then(() => {
							this.formSubmit = {
								name: "",
								description: "",
								unit: "",
								category_id: { id: "", name: "" },
								data_type: { name: "" },
								is_on_table: null,
							};
						})
						.then(() => this.initialize());
				})
				.catch((message) => {
					this.$swal({
						title: message,
						icon: "warning",
						allowOutsideClick: false,
						showConfirmButton: true,
						confirmButtonColor: "#134889",
						timer: 3000,
					}).then((result) => {
						if (result.isConfirmed) {
							this.$store.commit("setLoading", false);
						}
					});
				});
		},
		submitUpdateData() {
			const valueOption = [];
			const weightOption = [];
			this.formUpdate.dynamicField.forEach(({ value, weight }) => {
				valueOption.push(value.toString());
				weightOption.push(weight.toString());
			});

			const payload = {
				id: this.formUpdate.id,
				data: {
					name: this.formUpdate.name,
					description: this.formUpdate.description,
					category_id: this.formUpdate.category_id.id,
					unit: this.formUpdate.unit,
					is_on_table: this.formUpdate.is_on_table,
					is_calculated: this.formUpdate.is_calculated,
					is_used_by_calculation:
						this.formUpdate.is_used_by_calculation,
					is_show_on_pop_up: this.formUpdate.is_show_on_pop_up,
					data_type: this.formUpdate.data_type.name,
				},
			};
			if (this.formUpdate.data_type.name == "select") {
				payload.data.option = valueOption.toString();
				payload.data.weight = weightOption.toString();
			}
			console.log("dataupdate subc", payload);

			this.$store
				.dispatch("updatePotensiDesaSubCategory", payload)
				.then(() => {
					this.$swal({
						title: "Berhasil Update",
						icon: "success",
						showConfirmButton: true,
						confirmButtonColor: "#134889",
						timer: 3000,
					}).then(() => this.initialize());
				})
				.catch((message) => {
					this.$swal({
						title: message,
						icon: "warning",
						allowOutsideClick: false,
						showConfirmButton: true,
						confirmButtonColor: "#134889",
						timer: 3000,
					}).then((result) => {
						if (result.isConfirmed) {
							this.$store.commit("setLoading", false);
						}
					});
				});
		},
		deleteData(item) {
			// console.log(item);
			this.$swal({
				title: "Do you want to save the changes?",
				showDenyButton: true,
				confirmButtonText: "Delete",
				confirmButtonColor: "#134889",
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					this.$store
						.dispatch("deletePotensiDesaSubCategory", item.id)
						.then(() => {
							this.$swal
								.fire({
									title: "Success deleted",
									icon: "success",
									showConfirmButton: true,
									confirmButtonColor: "#134889",
									timer: 3000,
								})
								.then(() => this.setSubCategoryTable());
						})
						.catch((message) => {
							this.$swal
								.fire({
									title: message,
									icon: "error",
									showConfirmButton: true,
									confirmButtonColor: "#134889",
									timer: 3000,
								})
								.then(() =>
									this.$store.commit("loadingTable", false)
								);
						});
				} else if (result.isDenied) {
					this.$swal({
						title: "Batal Menghapus",
						icon: "info",
						confirmButtonText: "Ya",
						confirmButtonColor: "#134889",
					});
				}
			});
		},
		setSubCategoryTable(sort) {
			const request = {
				limit: this.paginationType.rowsPerPage,
				page: this.paginationType.page,
				sort: sort,
				search: this.search,
			};

			this.$store.commit("loadingTable", true);
			this.$store.commit("setLoading", true);
			this.getDataSubcategory(request);
		},
		resetData() {
			this.pagination.rowsPerPage = 10;
			this.pagination.page = 1;
			this.search = "";

			this.getDataSubcategory(this.setTableSubCategoryParams);
		},
		addField(submitType) {
			if (submitType != "update") {
				this.dynamicField.push({ value: "" });
			} else {
				this.formUpdate.dynamicField.push({
					value: "",
					isDisabled: false,
					oldValue: "",
				});
			}
		},
		removeField(submitType, value) {
			if (submitType != "update") {
				this.dynamicField.splice(value, 1);
			} else {
				if (value.text != "") {
					this.$store.commit("loadingContent", true);
					this.$swal({
						title: "Anda yakin ingin menghapus opsi ini, data tidak dapat dikembalikan ?",
						showDenyButton: true,
						confirmButtonText: "Ya",
						confirmButtonColor: "#134889",
						denyButtonText: `Tidak`,
					}).then((resultConfirm) => {
						if (resultConfirm.isConfirmed) {
							this.$store
								.dispatch(
									"checkOptionsPotensiDesaSubCategory",
									{
										id: value.id,
										option: `${value.text}`,
									}
								)
								.then((success) => {
									// console.log("result", success);
									this.$swal
										.fire({
											title: success,
											icon: "success",
											showConfirmButton: true,
											confirmButtonColor: "#134889",
											timer: 3000,
										})
										.then(() =>
											this.formUpdate.dynamicField.splice(
												value.index,
												1
											)
										);
								})
								.catch((err) => {
									this.$swal
										.fire({
											title: err,
											icon: "error",
											showConfirmButton: true,
											confirmButtonColor: "#134889",
											timer: 3000,
										})
										.then(() =>
											this.$store.commit(
												"loadingContent",
												false
											)
										);
								});
						} else {
							this.$swal({
								title: "Batal",
								icon: "info",
								showConfirmButton: false,
								confirmButtonText: "Ya",
								confirmButtonColor: "#134889",
								timer: 3000,
							}).then(() =>
								this.$store.commit("loadingContent", false)
							);
						}
					});
				} else {
					this.formUpdate.dynamicField.splice(value.index, 1);
				}
			}
		},
		optionUpdate(value) {
			const valueOption = [];
			this.formUpdate.dynamicField.forEach(({ value }) => {
				if (value != "") {
					valueOption.push(value.toString());
				}
			});
			const data = {
				id: value.id,
				data: {
					old_option: value.old_value,
					new_option: value.new_value,
					option: valueOption.toString(),
				},
			};
			this.$store.commit("loadingContent", true);
			this.$swal({
				title: "Do you want to save the changes? It will replace the old values ?",
				showDenyButton: true,
				confirmButtonText: "Yes",
				confirmButtonColor: "#134889",
				denyButtonText: `No`,
				allowEnterKey: false,
			}).then((result) => {
				if (result.isConfirmed) {
					this.$store
						.dispatch("updateOptionPotensiDesaSubCategory", data)
						.then((success) => {
							this.$swal
								.fire({
									title: success.message,
									icon: "success",
									showConfirmButton: true,
									confirmButtonColor: "#134889",
									timer: 3000,
								})
								.then(() =>
									this.$store.commit("fetchSubCategoryById", {
										id: success.id,
									})
								);
						})
						.catch((message) => {
							this.$swal
								.fire({
									title: message,
									icon: "error",
									showConfirmButton: true,
									confirmButtonColor: "#134889",
									timer: 3000,
								})
								.then(() =>
									this.$store.commit("loadingContent", false)
								);
						});
				} else if (result.isDenied) {
					this.$swal({
						title: "Canceled",
						icon: "info",
						showConfirmButton: false,
						confirmButtonText: "Ya",
						confirmButtonColor: "#134889",
						timer: 3000,
					}).then(() => this.$store.commit("loadingContent", false));
				}
			});
		},
	},
	filters: {
		moment: function (date) {
			return moment(date).format("DD-MM-YYYY - hh:mm:ss");
		},
	},
	created() {
		this.initialize();
	},
	mounted() {},
};
