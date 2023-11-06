<template>
	<v-card class="px-5 py-2">
		<v-data-table
			:headers="headers"
			:items="device"
			:loading="loading"
			hide-default-footer
			disable-pagination
			class="elevation-0 pa-3 pb-5"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-row>
						<v-col lg="6" class="d-flex mb-5">
							<div class="font-weight-bold mt-2 mr-5">
								Availability Device
							</div>
						</v-col>
					</v-row>
				</v-toolbar>
			</template>
			<template v-slot:item.status="{ item }">
				<v-chip
					v-if="item.status == 'Online'"
					class="ma-2"
					color="green"
					text-color="white"
				>
					Online
				</v-chip>
				<v-chip v-else class="ma-2" color="red" text-color="white">
					Offline
				</v-chip>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-btn
					outlined
					elevation="0"
					class="mr-5 text-capitalize"
					color="black"
					@click="copyLatlong(item)"
				>
					{{ $t("ui.button_copy_latlong") }}</v-btn
				>
			</template>
			<template v-slot:no-data>
				<div class="pa-10">
					<img
						height="300px"
						src="../../../assets/image/empty.svg"
						alt="no data"
					/>
					<div>No Data</div>
					<v-btn color="primary" @click="getDevice"> Reset </v-btn>
				</div>
			</template>
		</v-data-table>
		<v-container class="max-width">
			<v-row justify="end" align="center">
				<v-col cols="2">
					<v-select
						:items="pagination.rowsPerPageItems"
						class="item-per-page"
						v-model="pagination.rowsPerPage"
						@change="getDeviceByRow"
					></v-select>
				</v-col>
			</v-row>
			<v-pagination
				v-model="pagination.page"
				class="my-4"
				:total-visible="7"
				:length="pagination.totalItems"
				@input="getDevice"
			></v-pagination>
		</v-container>
		<v-overlay :z-index="999" :value="loading_overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<v-snackbar
			v-model="copyNotification"
			timeout="2000"
			color="primary"
			text
			top
			style="top: 50px"
			outlined
			><span class="text-h6 d-flex justify-center" style="width: 100%"
				>Long Lat copied !</span
			></v-snackbar
		>
	</v-card>
</template>

<script>
import { GET_DEVICE } from "../../../store/modules/qoe.module";

export default {
	data: () => ({
		singleSelect: false,
		selected: [],
		selected_data: {},
		loading: false,
		copyNotification: false,
		headers: [
			{ text: "USERNAME", value: "username", sortable: false },
			{
				text: "IMEI",
				value: `imei`,
				sortable: false,
			},
			{
				text: "CELL OPERATOR",
				value: "cell_operator.name",
				sortable: false,
			},
			{ text: "STATUS", value: "status", sortable: false },
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
	}),

	computed: {
		// loading: function () {
		//   return this.$store.getters.loading;
		// },

		start_date: function () {
			return this.$store.getters.start_date;
		},

		end_date: function () {
			return this.$store.getters.end_date;
		},

		device: function () {
			return this.$store.getters.device;
		},
	},

	created() {
		this.getDevice();
	},

	methods: {
		copyLatlong(item) {
			// console.log(item.user_information.full_address.latitude);
			const lat = item.user_information.full_address.latitude;
			const long = item.user_information.full_address.longitude;
			const latlong = long + ", " + lat;
			navigator.clipboard.writeText(latlong);
			this.copyNotification = true;
		},
		getDevice() {
			this.loading = true;
			if (this.search.length != 0 && this.search.length < 3) {
				return;
			}
			const data = {
				limit: this.pagination.rowsPerPage,
				page: this.pagination.page,
				sort: this.sort,
				start_date: "",
				end_date: "",
				cell_operator_id: 0,
				status: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};

			this.$store.dispatch(GET_DEVICE, data).then((result) => {
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
		getDeviceByRow() {
			this.loading = true;
			if (this.search.length != 0 && this.search.length < 3) {
				return;
			}
			const data = {
				limit: this.pagination.rowsPerPage,
				page: 1,
				sort: this.sort,
				start_date: "",
				end_date: "",
				cell_operator_id: 0,
				status: "",
				province_id: 0,
				city_id: 0,
				district_id: 0,
				sub_district_id: 0,
				search: this.search,
			};
			this.$store.dispatch(GET_DEVICE, data).then((result) => {
				if (result.error) {
					this.pagination.page = 1;
					this.pagination.totalItems = 0;
					this.loading = false;
					return;
				}
				this.loading = false;
				this.pagination.page = 1;
				this.pagination.totalItems = result.data.pagination.total_page;
			});
		},
	},
};
</script>

<style scoped>
.icon-btn {
	height: 60px;
}
.item-per-page {
	width: 150px;
}

.item-per-page::before {
	content: "Item";
	margin-top: 0.5em;
	margin-right: 1em;
}
</style>
