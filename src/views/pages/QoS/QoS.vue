<template>
	<div class="qoe">
		<!-- <NavBar /> -->
		<div class="font-weight-bold mt-5" style="font-size: 24px">
			{{ $t("general.menu.coverage_throughput_performance") }}
		</div>
		<v-row class="mt-5">
			<v-col cols="2">
				<v-btn
					width="100%"
					class="text-capitalize white--text"
					color="#FFBA3B"
					height="50"
					rounded
					@click="show_upload = true"
				>
					<v-icon class="mr-2">mdi-tray-arrow-up</v-icon>
					{{ $t("ui.button_upload") }} {{ $t("ui.text_piece.file") }}
				</v-btn>
			</v-col>
			<v-col cols="2">
				<v-btn
					@click="changeComponent('Test Result')"
					elevation="0"
					rounded
					:class="[
						`text-capitalize`,
						active_item == 'Test Result' ? `active-btn` : ``,
					]"
					height="50"
					width="100%"
				>
					{{ $t("ui.button_test_result") }}
				</v-btn>
			</v-col>
			<v-col cols="2">
				<v-btn
					@click="changeComponent('Bad Spot')"
					elevation="0"
					:class="[
						`text-capitalize`,
						active_item == 'Bad Spot' ? `active-btn` : ``,
					]"
					rounded
					height="50"
					width="100%"
				>
					{{ $t("ui.button_test_result") }}
					Matrix
				</v-btn>
			</v-col>
			<v-spacer></v-spacer>
			<v-col lg="3" class="d-flex">
				<v-menu
					v-model="date_picker_1"
					:close-on-content-click="false"
					transition="scale-transition"
					offset-y
					min-width="auto"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							class="mr-5"
							v-model="
								filter.date.default != true
									? filterComputed.preview.startDate
									: filter.date.defaultText
							"
							solo
							dense
							prepend-inner-icon="mdi-calendar"
							placeholder="Start Date"
							:hint="$t('ui.field.start_date')"
							persistent-hint
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker
						v-model="filter.date.startDate"
						@input="filterDate"
					></v-date-picker>
				</v-menu>
				<v-menu
					class="ml-5"
					v-model="date_picker_2"
					:close-on-content-click="false"
					transition="scale-transition"
					offset-y
					min-width="auto"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="
								filter.date.default != true
									? filterComputed.preview.endDate
									: filter.date.defaultText
							"
							solo
							dense
							prepend-inner-icon="mdi-calendar"
							placeholder="End Date"
							:hint="$t('ui.field.end_date')"
							persistent-hint
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker
						v-model="filter.date.endDate"
						@input="filterDate"
					></v-date-picker>
				</v-menu>
			</v-col>
			<v-col lg="1">
				<v-btn
					elevation="0"
					class="text-capitalize white--text"
					color="#1976D2"
					@click="submitFilter"
					>{{ $t("ui.button_submit") }}</v-btn
				>
			</v-col>
		</v-row>
		<v-row class="mt-5">
			<v-col lg="2">
				<v-autocomplete
					@input="selectCity"
					v-model="selected_province"
					:items="item_province"
					:search-input.sync="searchProvince"
					item-text="name"
					item-value="id"
					flat
					hide-no-data
					hide-details
					dense
					:label="$t('ui.field.province')"
					outlined
				></v-autocomplete>
			</v-col>
			<v-col lg="2">
				<v-autocomplete
					@input="selectDistrict"
					v-model="selected_city"
					:items="item_city"
					:search-input.sync="searchCity"
					item-text="name"
					item-value="id"
					flat
					hide-no-data
					hide-details
					dense
					:label="$t('ui.field.city')"
					outlined
				></v-autocomplete>
			</v-col>
			<v-col lg="2">
				<v-autocomplete
					@input="selectSubDistrict"
					v-model="selected_district"
					:items="item_district"
					:search-input.sync="searchDistrict"
					item-text="name"
					item-value="id"
					flat
					hide-no-data
					hide-details
					dense
					:label="$t('ui.field.district')"
					outlined
				></v-autocomplete>
			</v-col>
			<!-- <v-col lg="2">
        <v-autocomplete
          v-model="selected_sub_district"
          :items="item_sub_district"
          :search-input.sync="searchSubDistrict"
           
          item-text="name"
          item-value="id"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.sub_district')"
          outlined
        ></v-autocomplete>
      </v-col> -->

			<v-col lg="2">
				<v-btn
					elevation="0"
					class="mr-5 text-capitalize"
					color="primary"
					rounded
					@click="applyFilter"
					>{{ $t("ui.button_apply") }}</v-btn
				>
				<v-btn
					@click="resetFilter"
					elevation="0"
					class="text-capitalize"
					rounded
					color=""
					>Reset</v-btn
				>
			</v-col>

			<!-- <v-col lg="2">
        <v-btn
          width="100%"
          @click="printScreen"
          height="100%"
          style="color: #5e5873"
          color="white"
        >
          <div class="mr-2 text-capitalize">Export Data</div>
          <v-icon>mdi-file-download-outline</v-icon>
        </v-btn>
      </v-col> -->
		</v-row>
		<component
			:is="qos"
			:province="selected_province"
			:city="selected_city"
			:district="selected_district"
			:date_1="start_date"
			:date_2="end_date"
			:key="componentKey"
			@turnOffLoading="turnOffLoading"
		/>

		<!-- QOE -->
		<div class="mt-5" v-if="active_item == `Test Result`">
			<div class="font-weight-bold mt-5" style="font-size: 24px">
				{{ $t("general.menu.qoe") }}
			</div>
			<div>
				<v-btn
					@click="changeComponentQoE('cellular')"
					:class="[
						`text-capitalize text-capitalize pl-6 pr-6 mr-5 mt-5`,
						activeQoE == 'cellular'
							? 'active-link white--text'
							: '',
					]"
					rounded
					:outlined="activeQoE == 'cellular' ? false : true"
					>{{ $t("general.menu.operator_cellular") }}</v-btn
				>
				<v-btn
					@click="changeComponentQoE('fo')"
					active-class="active-link"
					:class="[
						`text-capitalize text-capitalize pl-6 pr-6 mt-5`,
						activeQoE == 'fo' ? 'active-link white--text' : ``,
					]"
					rounded
					:outlined="activeQoE == 'fo' ? false : true"
					>{{ $t("general.menu.fixed_broadband") }}</v-btn
				>
			</div>

			<!-- Component QoE Choice -->
			<component :is="qoe" />
		</div>
		<v-dialog v-model="show_upload" width="700" persistent>
			<v-card class="pa-5">
				<v-row>
					<v-col lg="11" class="font-weight-bold"
						>Upload File QoS</v-col
					>
					<v-col lg="1">
						<v-btn icon @click="show_upload = false">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<div class="grey--text mt-5 mb-5">
					Supported file .xlsx & .xls
				</div>
				<v-row
					@dragover="dragover"
					@dragleave="dragleave"
					@drop="drop"
					class="pa-5 ma-1 upload-dashed"
				>
					<v-col v-if="show_loading" lg="12" class="text-center">
						<v-progress-circular
							indeterminate
							:size="70"
							color="primary"
						></v-progress-circular>
					</v-col>
					<v-col v-else lg="12" class="text-center">
						<img
							src="../../../assets/image/upload-cloud-2-line.svg"
							alt="upload"
						/>
						<input
							ref="fileInput"
							type="file"
							class="d-none"
							accept=".xlsx, .xls"
							@change="addFile"
						/>

						<div
							v-if="selected_file.length == 0"
							class="mt-2 d-flex justify-center"
						>
							Drag & drop file
							<div @click="fileUpload" class="ml-1 up-file">
								or click here to select file
							</div>
						</div>

						<div
							v-else
							v-for="file in selected_file"
							:key="file.index"
						>
							{{ file.name }}
							<v-icon
								@click="remove(selected_file.indexOf(file))"
							>
								mdi-trash-can-outline
							</v-icon>
						</div>
					</v-col>
				</v-row>
				<v-row>
					<v-col lg="12">
						<v-text-field
							v-model="sheet_name"
							outlined
							dense
							hide-details
							placeholder="Input sheet name"
							@input="addSheetName"
						></v-text-field>
					</v-col>
					<v-col lg="12">
						<v-btn
							:disabled="isDisabled"
							class="text-capitalize white--text"
							:color="isDisabled ? `#E9E9E9` : `primary`"
							elevation="0"
							width="100%"
							@click="submitQoS"
						>
							<v-progress-circular
								v-if="sumbit_loading"
								indeterminate
								color="white"
							></v-progress-circular>
							<div v-else>Submit</div>
						</v-btn>
					</v-col>
				</v-row>
			</v-card>
		</v-dialog>
		<v-overlay v-model="loading">
			<v-progress-circular
				color="primary"
				indeterminate
			></v-progress-circular>
		</v-overlay>
	</div>
</template>

<script src="./QoS.js"></script>

<style scoped>
.active-link {
	box-shadow: unset !important;
	background: #134889 !important;
}
.qoe {
	height: 100%;
}

.upload-dashed {
	border: 0.5px dashed rgba(0, 0, 0, 0.5);
	box-sizing: border-box;
	border-radius: 8px;
}

.v-input--selection-controls {
	margin-top: 0px;
	padding-top: 0px;
}

.v-progress-linear--rounded {
	border-top-left-radius: 0px !important;
	border-bottom-left-radius: 0px !important;
	border-top-right-radius: 20px !important;
	border-bottom-right-radius: 20px !important;
}

.v-sheet.v-card {
	border-radius: 10px;
}

.active-card {
	border: 1px solid #169cd6;
	box-shadow: rgba(3, 150, 248, 0.24) 0px 3px 8px !important;
	color: #169cd6 !important;
}

.active-btn {
	background-image: linear-gradient(
		109.6deg,
		rgba(45, 116, 213, 1) 11.2%,
		rgba(121, 137, 212, 1) 91.2%
	);
	color: white !important;
}

.up-file {
	cursor: pointer;
	text-decoration: underline;
	color: #002bba;
}
</style>
