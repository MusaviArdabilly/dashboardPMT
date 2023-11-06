export default {
	props: ["filter"],
	data() {
		return {
			panelParent: [0],
			rules: [(value) => !!value || this.$t("form-validation.required")],
			loadingSubDistrict: false,
		};
	},
	computed: {
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
		loading() {
			return this.$store.getters.loading;
		},
	},
	methods: {
		getCity() {
			this.filter.selectCity = false;
			this.$store.dispatch("getCity", this.filter.province);
		},
		getDistrict() {
			this.filter.selectDistrict = false;
			this.$store.dispatch("getSubDistrict", 0);
			this.$store.dispatch("getDistrict", this.filter.city);
		},
		getSubDistrict() {
			this.filter.selectSubDistrict = false;
			this.$store.dispatch("getSubDistrict", this.filter.district);
		},
		checkIfExist() {
			if (this.filter.subDistrict == null) {
				return;
			}
			if (this.filter.subDistrict == "") {
				return;
			}
			this.loadingSubDistrict = true;
			fetch(
				process.env.VUE_APP_API_URL +
					`api/v1/id/sdp/exist?sub_district_id=${this.filter.subDistrict}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.$parent.user_token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((result) => {
					if (result.data != true) {
						this.$swal({
							title: result.message,
							icon: "success",
							showConfirmButton: true,
							allowOutsideClick: false,
							confirmButtonColor: "#134889",
							confirmButtonText: "Ok",
						}).then((response) => {
							if (response.isConfirmed) {
								this.loadingSubDistrict = false;
								this.$parent.panelDisabled = false;
								let lastIndex = this.$parent.nextPanel;
								for (
									let index = 0;
									index < this.$parent.panelLength;
									index++
								) {
									this.$parent.panel.push(lastIndex++);
								}
							}
						});
					} else {
						this.$swal({
							title: result.message,
							icon: "error",
							showConfirmButton: true,
							allowOutsideClick: false,
							confirmButtonColor: "#134889",
							confirmButtonText: "Ok",
						}).then((response) => {
							if (response.isConfirmed) {
								this.$parent.panel = [];
								this.loadingSubDistrict = false;
								this.filter.subDistrict = 0;
								this.$parent.panelDisabled = true;
							}
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		clearSubdistrict() {
			this.filter.subDistrict = "";
			this.loadingSubDistrict = false;
		},
		reset() {
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
			this.$parent.panel = [];
			this.$parent.panelDisabled = true;
		},
		filters: {
			toString: function (value) {
				value.toString();
			},
		},
	},
};
