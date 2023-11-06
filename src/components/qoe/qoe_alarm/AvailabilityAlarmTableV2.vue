<template>
	<v-card class="px-5 py-2">
		<div class="font-weight-bold mt-2 mr-5">Alarm Availability Device</div>
		<v-row class="mt-5">
			<v-col cols="2">
				<v-select
					v-model="selected_opsel_temp"
					:items="item_opsel"
					item-text="name"
					item-value="id"
					solo
					dense
					placeholder="Network Operator"
					@change="resetPaginate"
				></v-select>
			</v-col>
			<v-col lg="2">
				<v-select
					v-model="selected_status"
					:items="status"
					item-text="name"
					item-value="id"
					solo
					dense
					@change="resetPaginate"
				></v-select>
			</v-col>
			<v-col lg="2">
				<v-btn
					elevation="0"
					class="mr-5 text-capitalize"
					color="primary"
					rounded
					@click="getAlarm"
					>{{ $t("ui.button_apply") }}</v-btn
				>
				<v-btn
					elevation="0"
					class="text-capitalize"
					rounded
					color=""
					@click="resetFilter"
					>Reset</v-btn
				>
			</v-col>
			<v-spacer></v-spacer>
			<v-col cols="2">
				<v-btn
					width="100%"
					style="color: #5e5873"
					color="white"
					@click="setupCreateTicket()"
					:disabled="selected.length == 0"
				>
					<div class="mr-2 text-capitalize">
						{{ $t("ui.button_create_ticket") }}
					</div>
					<v-icon>mdi-email-send-outline</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-data-table
			:headers="headers"
			:items="alarm"
			:loading="loading"
			:single-select="singleSelect"
			hide-default-footer
			disable-pagination
			class="elevation-0 pa-3 pb-5"
			item-key="id"
			v-model="selected"
			show-select
		>
			<template
				v-slot:item.data-table-select="{
					on,
					props,
					item,
					isSelected,
					select,
				}"
			>
				<v-simple-checkbox
					:value="isSelected"
					:readonly="item.ticket_flag"
					:disabled="item.ticket_flag"
					v-bind="props"
					v-on="on"
					@input="select($event)"
				></v-simple-checkbox>
			</template>
			<template v-slot:item.is_resolved="{ item }">
				<v-chip
					v-if="item.is_resolved"
					class="ma-2"
					color="green"
					text-color="white"
				>
					Resolved
				</v-chip>
				<v-chip v-else class="ma-2" color="red" text-color="white">
					Open
				</v-chip>
			</template>
			<template v-slot:item.created_at="{ item }">
				<div>{{ item.created_at | moment }}</div>
			</template>
			<template v-slot:item.updated_at="{ item }">
				<div v-if="item.is_resolved">
					{{ item.updated_at | moment }}
				</div>
				<div v-else>-</div>
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
				<div class="pa-5">
					<img
						height="300px"
						src="../../../assets/image/empty.svg"
						alt="no data"
					/>
					<div>No Data</div>
					<v-btn color="primary" @click="getAlarm"> Reset </v-btn>
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
						@change="getAlarmByTableRow"
					></v-select>
				</v-col>
			</v-row>
			<v-pagination
				v-model="pagination.page"
				class="my-4"
				:total-visible="7"
				:length="pagination.totalItems"
				@input="getAlarm"
			></v-pagination>
		</v-container>
		<v-overlay :z-index="999" :value="loading_overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>

		<!-- DIALOG CREATE TICKET -->
		<v-dialog width="80%" v-model="dialog">
			<v-card class="pa-5">
				<div class="font-weight-bold">
					{{ $t("ui.button_create_ticket") }}
				</div>
				<v-row class="mt-10">
					<v-col lg="1" class="font-weight-bold"> Source </v-col>
					<v-col lg="5" class="filter-text"> {{ app_name }} </v-col>
					<v-col lg="1" class="font-weight-bold">Status</v-col>
					<v-col lg="5" class="filter-text">Open</v-col>
					<v-col lg="1" class="font-weight-bold">Reported Case</v-col>
					<v-col lg="5" class="filter-text">{{
						selected.length
					}}</v-col>
					<v-col lg="1" class="font-weight-bold mt-2"
						>Assign to</v-col
					>
					<v-col lg="5" class="filter-text">
						<v-select
							v-model="selected_cell_operator"
							:value="selected_data.cell_operator_id"
							:items="opsel"
							item-value="id"
							item-text="name"
							dense
							outlined
							placeholder="Assign To"
						></v-select>
					</v-col>
					<v-col lg="1" class="font-weight-bold mt-2">Date</v-col>
					<v-col lg="5" class="filter-text">
						<v-text-field
							v-model="date"
							dense
							prepend-inner-icon="mdi-calendar"
							readonly
							outlined
							v-bind="attrs"
							v-on="on"
							disabled
						></v-text-field>
					</v-col>
					<v-col lg="1" class="font-weight-bold mt-2">Category</v-col>
					<v-col lg="5" class="filter-text">
						<v-select
							v-model="category"
							:items="list_category"
							item-value="name"
							item-text="name"
							dense
							outlined
							placeholder="Category"
						></v-select>
					</v-col>

					<v-col lg="1" class="font-weight-bold mt-2">Subject</v-col>
					<v-col lg="5" class="filter-text">
						<v-text-field
							v-model="subject"
							dense
							outlined
							placeholder=""
						></v-text-field>
					</v-col>
					<v-col lg="1" class="font-weight-bold mt-2"
						>Attachment</v-col
					>
					<v-col lg="5" class="filter-text">
						<v-file-input
							show-size
							dense
							outlined
							v-model="attachment"
							placeholder="Upload file"
						></v-file-input>
					</v-col>
					<v-col lg="1" class="font-weight-bold mt-2"
						>Description</v-col
					>
					<v-col lg="5" class="filter-text">
						<v-textarea
							v-model="description"
							dense
							outlined
						></v-textarea>
					</v-col>
					<v-col lg="6" class="font-weight-bold mt-2"> </v-col>
					<v-col lg="12" class="d-flex justify-end">
						<v-btn
							elevation="0"
							class="mr-5 white--text text-capitalize"
							color="#3C7FBE"
							@click="createTicket"
							>Buat Ticket</v-btn
						>
						<v-btn
							outlined
							class="text-capitalize"
							elevation="0"
							@click="dialog = false"
							>Cancel</v-btn
						>
					</v-col>
				</v-row>
			</v-card>
		</v-dialog>
		<v-snackbar
			v-model="copyNotification"
			timeout="2000"
			color="primary"
			text
			top
			outlined
			style="top: 50px"
			><span class="text-h6 d-flex justify-center" style="width: 100%"
				>Long Lat copied !</span
			></v-snackbar
		>
	</v-card>
</template>

<script src="./AvailabilityAlarmTableV2.js"></script>

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
