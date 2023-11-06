import JwtService from "../../../../services/jwt.services";
import CardProfilDesa from "../details-page/cards/CardProfilDesa.vue";
import moment from "moment";

export default {
	components: {
		CardProfilDesa,
	},
	data() {
		return {
			overlay: false,
			valueData: [],
			isEdit: true,
			user_token: null,
			updated_at: "",
			fieldLoading: true,
			updated_by: "",
			selectedSubdistrict: "",
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
			log: {
				updated: [],
				created: [],
				url: "",
			},
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
			fieldData: [],
			panel: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
				18, 19, 20,
			],
		};
	},
	computed: {
		disallowEdit() {
			if (
				(this.userData.role == "operator" ||
					this.userData.role == "executive") == true
			) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		cancelEdit() {
			this.$swal({
				title: "Apakah anda yakin membatalkan perubahan data?",
				icon: "info",
				showDenyButton: true,
				denyButtonColor: "#cfcfcf",
				denyButtonText: "Tidak",
				confirmButtonColor: "#134889",
				confirmButtonText: "Ya",
			}).then((result) => {
				if (result.isConfirmed) {
					this.$swal({
						title: "Batal merubah data",
						icon: "success",
						timer: 800,
						confirmButtonColor: "#134889",
						confirmButtonText: "Ya",
					}).then(() => this.$router.push("/dashboard/potensi-desa"));
				}
			});
		},
		editData() {
			this.isEdit = false;
			this.overlay = true;
			setTimeout(() => {
				this.overlay = false;
			}, 700);
		},
		getFieldData() {
			this.overlay = true;
			this.fieldLoading = true;
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/fields`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					this.fieldData = result.data;
					this.getDataByID(this.$route.params.id);
					console.log(result.data, "field");
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getDataByID(id) {
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					this.overlay = false;
					console.log("data by id", result.data);

					if (result.error == false) {
						this.filter.object_id = result.data.object_id;
						this.filter.province = result.data.province.id;
						this.filter.city = result.data.city.id;
						this.filter.district = result.data.district.id;
						this.filter.subDistrict = result.data.sub_district.id;
						this.selectedSubdistrict = result.data.sub_district.id;
						this.log.url = `${result.data.province.name} - ${result.data.city.name} - ${result.data.district.name} - ${result.data.sub_district.name}`;

						result.data.data.forEach((item) => {
							this.valueData[item.id] = item.value;
						});
						this.panel = [
							0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
							15, 16, 17, 18, 19, 20,
						];

						this.initialize(
							this.filter.province,
							this.filter.city,
							this.filter.district
						);

						this.updated_at = result.data.updated_at;
						this.updated_by = result.data.updated_by;

						const payloadCheckCreate = {
							limit: 1,
							page: 1,
							sort: "asc",
							search: `${result.data.province.name} - ${result.data.city.name} - ${result.data.district.name} - ${result.data.sub_district.name}`,
						};
						const payloadCheckUpdate = {
							limit: 5,
							page: 1,
							sort: "desc",
							search: `${result.data.province.name} - ${result.data.city.name} - ${result.data.district.name} - ${result.data.sub_district.name}`,
						};
						this.fetchLogHistory("created", payloadCheckCreate);
						this.fetchLogHistory("updated", payloadCheckUpdate);

						this.fieldLoading = false;
					}
				})

				.catch((err) => {
					console.log(err);
				});
		},
		fetchLogHistory(type, payload) {
			fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/${this.user.language}/log-activity`,
				{
					method: "POST",
					body: JSON.stringify(payload),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.user_token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					if (type == "created") {
						this.log.created = result.data.data;
					} else if (type == "updated") {
						this.log.updated = result.data.data;
					} else {
						console.log("You write wrong rules", type);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		saveData() {
			const refFormData = this.$refs.formData;
			// console.log("save");
			this.overlay = true;
			this.formData = [];
			for (let item of refFormData) {
				for (let data of item.$children[1].$children) {
					let dataFormat = {
						id: "",
						category_id: "",
						value: "",
					};
					dataFormat.category_id = Number(item.$children[0].$el.id);
					// console.log(data);
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

			const fetchData = {
				object_id: this.$route.params.id,
				province_id: this.filter.province,
				city_id: this.filter.city,
				district_id: this.filter.district,
				sub_district_id: Number(this.$route.params.id),
				data: this.formData,
			};
			const object_id = this.$route.params.id;
			// console.log(fetchData, "femittchdata");
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/${object_id}`, {
				method: "PUT",
				body: JSON.stringify(fetchData),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.user_token}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					this.overlay = false;
					if (result.error == false) {
						this.$swal({
							title: "Data Desa berhasil diperbaharui",
							icon: "success",

							confirmButtonColor: "#134889",
							allowOutsideClick: false,
							confirmButtonText: "Ok",
						}).then((result) => {
							if (result.isConfirmed) {
								location.reload();
								this.overlay = true;
							}
						});
					} else if (result.error == true) {
						this.$swal({
							title: result.message,
							icon: "warning",
							timer: 2500,
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		initialize(province, city, district) {
			// fetch data : Provinsi
			this.$store.dispatch("getProvince");

			// fetch data : Kabupaten/Kota
			this.$store.dispatch("getCity", province);

			// fetch data : Kecamatan/Distrik
			this.$store.dispatch("getDistrict", city);

			// fetch data : Kelurahan/Desa
			this.$store.dispatch("getSubDistrict", district);
		},
		checkRoute() {
			if (this.$route.name == "potensi-desa-details") {
				this.isEdit = true;
			} else if (this.$route.name == "potensi-desa-edit") {
				this.isEdit = false;
			}
		},
	},
	filters: {
		moment: function (date) {
			return moment(date).format("dd, d MMM YYYY hh:mm:ss");
		},
	},
	created() {
		this.checkRoute();
		this.user = JwtService.getUser();
		this.user_token = JwtService.getToken();
	},
	mounted() {
		this.getFieldData();
		console.log(this.$route.params.id);
	},
};
