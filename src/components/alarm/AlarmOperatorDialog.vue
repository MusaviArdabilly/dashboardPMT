<template>
  <v-dialog v-model="dialogAction" persistent>
    <v-card class="pmt-card">
      <div is="v-card-title" class="pt-2 pr-6 pb-1 pl-6">
        <span class="font-weight-bold ml-3">Detail :</span>
        <v-col cols="8" xl="10">
          <div class="pmt-flex is-row wrap">
            <div is="v-col" cols="1" xl="1">
              <div
                is="v-avatar"
                :color="avatarBackground(dialogData.name)"
                v-if="dialogData.logo == ''"
                size="40"
              >
                <span class="white--text">{{
                  stringInitial(dialogData.name)
                }}</span>
              </div>
              <div is="v-avatar" v-else size="40">
                <img
                  :src="dialogData.logo_url + dialogData.logo"
                  :alt="dialogData.name + '-logo'"
                />
              </div>
            </div>
            <h5 class="pt-4 font-weight-bold">
              {{ dialogData.name }}
            </h5>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-icon @click="dialogAction = false">mdi-close</v-icon>
      </div>
      <v-row class="px-10 mb-5">
        <div class="font-weight-bold mt-4 ml-2 mr-3" style="color: #867e7e">
          Download Data:
        </div>
        <v-col lg="10" class="d-flex justify-start">
          <download-excel
            class="btn btn-default mr-5"
            :data="dataDownloadAll"
            :fields="json_fields"
            worksheet="My Worksheet"
            name="data-alarm.xls"
          >
            <v-btn width="14rem" style="color: #5e5873" color="white">
              <div class="text-capitalize">All Time</div>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </download-excel>
          <download-excel
            class="btn btn-default mr-5"
            :data="dataDownloadThreeMonths"
            :fields="json_fields"
            worksheet="My Worksheet"
            name="data-alarm.xls"
          >
            <v-btn width="14rem" style="color: #5e5873" color="white">
              <div class="text-capitalize">Last 3 Months</div>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </download-excel>
          <download-excel
            class="btn btn-default mr-5"
            :data="dataDownloadLastMonth"
            :fields="json_fields"
            worksheet="My Worksheet"
            name="data-alarm.xls"
          >
            <v-btn width="14rem" style="color: #5e5873" color="white">
              <div class="text-capitalize">Last Month</div>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </download-excel>
          <download-excel
            class="btn btn-default mr-5"
            :data="dataDownloadLastWeek"
            :fields="json_fields"
            default-value="-"
            worksheet="My Worksheet"
            name="data-alarm.xls"
          >
            <v-btn width="14rem" style="color: #5e5873" color="white">
              <div class="text-capitalize">Last 7 Days</div>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </download-excel>
        </v-col>
      </v-row>
      <v-card-text class="pl-2 pr-2">
        <v-data-table
          class="pmt-table fixed-table overflow-y-auto overflow-x-auto"
          :headers="headers"
          :items="itemTable"
          hide-default-footer
          :options="pagination"
          :items-per-page="pagination.rowsPerPage"
        >
          <template v-slot:top>
            <v-overlay :absolute="false" :value="loadingTable">
              <v-progress-circular
                class="loader"
                :size="50"
                color="primary"
                indeterminate
              >
              </v-progress-circular>
            </v-overlay>
          </template>
          <template v-slot:[`item.affected_node`]="{ item }">
            <div v-for="items in item.affected_node">
              <span v-if="item.affected_node.length === 0"> - </span>
              <span v-else> {{ items.id }} - {{ items.coordinate }}° </span>
            </div>
          </template>
          <template v-slot:[`item.affected_segment`]="{ item }">
            <div v-for="items in item.affected_segment">
              <span v-if="item.affected_segment.length === 0"> - </span>
              <span v-else>
                {{ items.id }} - {{ items.coordinate_ne }}° :
                {{ items.coordinate_fe }}°</span
              >
            </div>
          </template>
          <template v-slot:[`item.severity`]="{ item }">
            <v-chip class="pmt-chip color-gray-light" v-if="item.severity === 5"
              >Not Yet Identified</v-chip
            >
            <v-chip
              class="pmt-chip color-red-light"
              v-else-if="item.severity === 1"
              >Critical</v-chip
            >
            <v-chip
              class="pmt-chip color-orange-light"
              v-else-if="item.severity === 2"
              >Major</v-chip
            >
            <v-chip
              class="pmt-chip color-yellow-light"
              v-else-if="item.severity === 3"
              >Medium</v-chip
            >
            <v-chip
              class="pmt-chip color-green-light"
              v-else-if="item.severity === 4"
              >Minor</v-chip
            >
          </template>
          <template v-slot:[`item.target_to_resolved`]="{ item }">
            {{ item.target_to_resolved }} Hour
          </template>
          <template v-slot:[`item.start_time`]="{ item }">
            {{ timeFormat(item.start_time) }}
          </template>
          <template v-slot:[`item.end_time`]="{ item }">
            <span v-if="item.end_time != 0">
              {{ timeFormat(item.end_time) }}
            </span>
            <span v-else> - </span>
          </template>
          <template v-slot:[`item.id`]="{ item }">
            <div class="pt-5 mb-5 text-right">
              <v-btn
                class="text-capitalize font-weight-bold"
                :href="`${directToMap}?node=${item.affected_node_id.toString()}&segement=${item.affected_segment_id.toString()}`"
                text
                color="#134889"
                >{{ $t("ui.button_see_map") }}</v-btn
              >
            </div>
          </template>
          <template v-slot:no-data>
            <div class="pa-5">
              <img
                height="300px"
                src="../../assets/image/empty.svg"
                alt="no data"
              />
              <div>No Data</div>
            </div>
          </template>
          <template v-slot:footer>
            <v-col cols="12" class="max-width">
              <div class="pmt-flex is-row wrap">
                <v-col cols="6">
                  <div class="pmt-flex is-row wrap at-start">
                    <v-col cols="8" xl="8">
                      <v-select
                        :items="pagination.rowsPerPageItems"
                        class="entries-per-page"
                        dense
                        outlined
                        v-model="pagination.rowsPerPage"
                        @input="setTableLimit"
                      ></v-select>
                    </v-col>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="pmt-flex is-row wrap at-end">
                    <v-pagination
                      v-model="pagination.page"
                      class="my-4"
                      :total-visible="7"
                      :length="paginationType.totalItems"
                      @input="setTable"
                    ></v-pagination>
                  </div>
                </v-col>
              </div>
            </v-col>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script src="./AlarmOperatorDialog.js"></script>
