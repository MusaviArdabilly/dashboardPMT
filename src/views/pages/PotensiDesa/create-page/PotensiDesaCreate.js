import JwtService from "../../../../services/jwt.services";
import CardProfilDesa from "../create-page/cards/CardProfilDesa.vue";

export default {
	components: {
		CardProfilDesa,
	},
	data() {
		return {
			user_token: null,
			overlay: true,
			fieldList: [],
			panel: [],
			nextPanel: 0,
			panelLength: 0,
			panelDisabled: true,
			panelHandle: [],
			formData: [],
			noRules: [
				() => {
					return;
				},
			],
			integerRules: [
				(value) => {
					if (value) {
						return (
							Number.isInteger(Number(value)) ||
							this.$t("form-validation.integer")
						);
					}
					if (!value) {
						return;
					}
				},
			],
			decimalRules: [
				(value) => {
					const decimal = /^[0-9._ ]*$/;
					if (value) {
						return (
							decimal.test(value) ||
							this.$t("form-validation.decimal")
						);
					}
					if (!value) {
						return;
					}
				},
			],
			filter: {
				object_id: "",
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
			},
		};
	},

	methods: {
		refreshPage() {
			window.location.reload();
		},
		cancelCreateData() {
			this.$swal({
				title: "Apakah anda yakin membatalkan penambahan data?",
				icon: "info",
				showDenyButton: true,
				denyButtonColor: "#cfcfcf",
				denyButtonText: "Tidak",
				confirmButtonColor: "#134889",
				confirmButtonText: "Ya",
			}).then((result) => {
				if (result.isConfirmed) {
					this.$swal({
						title: "Batal menambahkan data",
						icon: "success",
						timer: 800,
						confirmButtonColor: "#134889",
						confirmButtonText: "Ya",
					}).then(() => this.$router.push("/dashboard/potensi-desa"));
				}
			});
		},
		submitData() {
			// console.log("WHY");
			const refFormData = this.$refs.formData;
			this.formData = [];

			for (let item of refFormData) {
				for (let data of item.$children[1].$children) {
					let dataFormat = {
						id: "",
						category_id: "",
						value: "",
					};
					dataFormat.category_id = Number(item.$children[0].$el.id);

					if (data.$refs.input && data.$refs.input !== undefined) {
						dataFormat.id = Number(data.$refs.input.id);
					}

					if (data.$refs.input !== undefined) {
						dataFormat.value = data.$refs.input.value;
						if (data.selectedItems) {
							if (data.selectedItems.length > 0) {
								dataFormat.value =
									data.$el.__vue__.selectedItems[0];
							} else {
								dataFormat.value = "";
							}
						}
					}

					this.formData.push(dataFormat);
				}
			}

			// remove empty id
			// this.formData = this.formData.filter((item) => {
			// 	return item.id !== "";
			// });

			const fetchData = {
				object_id: this.filter.subDistrict.toString(),
				province_id: this.filter.province,
				city_id: this.filter.city,
				district_id: this.filter.district,
				sub_district_id: this.filter.subDistrict,
				data: this.formData,
			};

			console.log("fetch", fetchData);

			fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/create`, {
				method: "POST",
				body: JSON.stringify(fetchData),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					console.log("respo submit", result);
					this.overlay = false;
					if (result.error == false) {
						this.$swal({
							title: "Berhasil menambahkan data",
							icon: "success",
							timer: 2500,
							confirmButtonColor: "#134889",
							confirmButtonText: "Ok",
						});
					} else if (result.error == true) {
						this.$swal({
							title: result.message,
							icon: "error",
							timer: 2500,
							confirmButtonColor: "#134889",
							confirmButtonText: "Ok",
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getFieldList() {
			this.overlay = true;
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/fields`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					console.log("getfield", result);
					this.fieldList = result.data;
					this.overlay = false;
					this.panelLength = result.data.length;
				})
				.catch((err) => {
					console.log(err);
				});
		},
		initialize() {
			this.$store.dispatch("getProvince");
			this.getFieldList();
		},
	},
	created() {
		this.user_token = JwtService.getToken();
	},
	mounted() {
		// console.log(this.$route.params);
		this.initialize();
	},
};
