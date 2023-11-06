<template>
  <section class="single-page p-0">
    <v-overlay :value="loadingData">
      <v-progress-circular
        class="loader"
        :size="50"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
    </v-overlay>
    <div class="title mt-5 ml-5">
      <h4>{{ $t("general.menu.alarm_dashboard") }}</h4>
    </div>
    <NavigationCellAndFo
      :link="{
        cellular: '/dashboard/alarm-dashboard',
        fo: '/dashboard/fo/alarm-dashboard',
      }"
      is-page="Fixed Broadband"
    />
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="9" xl="9">
          <div class="pmt-flex no-wrap is-row">
            <v-col
              v-for="item in alarmCard"
              :cols="item.cardSize"
              :xl="item.cardSize"
            >
              <v-card :class="'pmt-card summary color-' + item.cardColor">
                <div class="summary-wrap">
                  <h4 class="summary-title">
                    {{ item.name }}
                  </h4>
                  <span class="summary-count">{{ item.count }}</span>
                </div>
              </v-card>
            </v-col>
          </div>
        </v-col>
      </div>
    </div>
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="6" md="8" xl="6">
          <div class="pmt-flex wrap is-row">
            <v-col cols="3" md="4" xl="3">
              <v-select
                v-model="filter.severity.value"
                :items="items.severity"
                item-text="name"
                item-value="value"
                dense
                placeholder="Select severity level"
                outlined
                rounded
                :disabled="input.isDisabled"
                @input="setTableLimit"
              ></v-select>
            </v-col>
            <v-col cols="3" md="4" xl="3">
              <v-select
                v-model="filter.alarms.value"
                :items="items.alarms"
                item-text="name"
                item-value="value"
                dense
                placeholder="Select average alarm"
                outlined
                rounded
                :disabled="input.isDisabled"
                @input="setTableLimit"
              ></v-select>
            </v-col>
            <v-col cols="3" md="4" xl="3">
              <v-autocomplete
                v-model="filter.operator.value"
                :items="itemOperator"
                :search-input.sync="filter.operator.search"
                item-text="name"
                item-value="id"
                dense
                hide-no-data
                hide-details
                placeholder="Operator"
                outlined
                rounded
                :disabled="input.isDisabled"
                @input="setTableLimit"
              ></v-autocomplete>
            </v-col>
            <v-col cols="3" md="4" xl="3" v-if="isViewer != true">
              <download-excel
                class="btn btn-default"
                :fetch="alarmDownload"
                :fields="printOutHeader"
                worksheet="My Worksheet"
                name="alarm_dashboard.xls"
                :before-generate="startDownload"
                :before-finish="finishDownload"
              >
                <v-btn
                  :disabled="whileDownload"
                  block
                  elevation="1"
                  color="white"
                >
                  <div class="mr-2 text-capitalize">
                    {{ $t("ui.button_download") }}
                  </div>
                  <v-icon>mdi-file-download-outline</v-icon>
                </v-btn>
              </download-excel>
            </v-col>
          </div>
        </v-col>
        <v-col cols="6" md="4" xl="6">
          <h3 class="font-weight-bold text-right">
            Total Alarm : {{ totalAlarm }}
          </h3>
        </v-col>
      </div>
    </div>
    <v-card class="ml-2 mr-2" elevation="0" outlined>
      <v-data-table
        class="pl-3 pr-3 pmt-table"
        :headers="headers"
        :items="itemTable"
        hide-default-footer
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
      >
        <template v-slot:top>
          <v-overlay :absolute="true" :value="loadingTable">
            <v-progress-circular
              class="loader"
              :size="50"
              color="primary"
              indeterminate
            >
            </v-progress-circular>
          </v-overlay>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <div class="pmt-flex is-row wrap">
            <div is="v-col" cols="2">
              <div
                is="v-avatar"
                :color="avatarBackground(item.name)"
                v-if="item.logo == ''"
                size="40"
              >
                <span class="white--text">{{ stringInitial(item.name) }}</span>
              </div>
              <div is="v-avatar" v-else size="40">
                <img
                  :src="item.logo_url + item.logo"
                  :alt="item.name + '-logo'"
                />
              </div>
            </div>
            <span class="pt-5 font-weight-bold">{{ item.name }}</span>
          </div>
        </template>
        <template v-slot:[`item.operator_id`]="{ item, index }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="font-weight-black text-capitalize"
                color="#169CD6"
                plain
                text
                v-bind="attrs"
                v-on="on"
                @click="
                  alarmListDialog({
                    id: item.operator_id,
                    name: item.name,
                    logo: item.logo,
                    logo_url: item.logo_url,
                  })
                "
                >{{ $t("ui.button_details") }}</v-btn
              >
            </template>
            <span>{{ $t("ui.tooltip_details") }}</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn @click="resetData">Reset </v-btn>
          </div>
        </template>
        <template v-slot:footer>
          <v-col cols="12" class="max-width">
            <div class="pmt-flex is-row wrap at-between">
              <v-col cols="6">
                <div class="pmt-flex is-row wrap at-start">
                  <v-col cols="8">
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
              <v-col cols="6">
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
      <alarm-operator-dialog
        :activator.sync="dialog.alarmDialog"
        :dialog-data="dialog.dataOperator"
      ></alarm-operator-dialog>
    </v-card>
  </section>
</template>

<script src="./AlarmDashboardFO.js"></script>
