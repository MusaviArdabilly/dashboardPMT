<template>
  <div class="ticketing">
    <!-- card total -->
    <div class="card-total d-flex mt-5">
      <!-- card total tickets-->
      <v-card width="550" class="pa-5 total-ticket">
        <div class="d-flex">
          <div style="font-size: 14px">Total tickets</div>
          <v-spacer></v-spacer>
        </div>
        <div class="d-flex justify-center align-center mt-5">
          <div style="font-size: 24px" class="font-weight-bold">
            {{ total_ticket }}
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-icon color="white">mdi-alert-outline</v-icon>
          </div>
        </div>
      </v-card>

      <v-spacer></v-spacer>

      <!-- card total tickets in progress-->
      <v-card width="550" class="pa-5 total-in-progress">
        <div class="d-flex">
          <div style="font-size: 14px">Total tickets In Progress</div>
          <v-spacer></v-spacer>
        </div>
        <div class="d-flex justify-center align-center mt-5">
          <div style="font-size: 24px" class="font-weight-bold">
            {{ total_in_progress }}
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-icon color="white">mdi-progress-clock</v-icon>
          </div>
        </div>
      </v-card>

      <v-spacer></v-spacer>

      <!-- card total complete-->
      <v-card width="550" class="pa-5 total-complete">
        <div class="d-flex">
          <div style="font-size: 14px">Total tickets Complete</div>
          <v-spacer></v-spacer>
        </div>
        <div class="d-flex justify-center align-center mt-5">
          <div style="font-size: 24px" class="font-weight-bold">
            {{ total_closed }}
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-icon color="white">mdi-check-circle-outline</v-icon>
          </div>
        </div>
      </v-card>
    </div>

    <!-- card ticket category -->
    <div class="ticket-category d-flex mt-10">
      <v-row>
        <!-- Button Operator Cell -->
        <v-col cols="2">
          <v-btn
            elevation="0"
            rounded
            :class="[
              `text-capitalize`,
              active_item == 'Operator Cellular' ? `active-btn` : ``,
            ]"
            height="50"
            width="100%"
          >
            Operator Cellular
          </v-btn>
        </v-col>
        <!-- Fixed Broadband -->
        <v-col cols="2">
          <v-btn
            elevation="0"
            rounded
            :class="[
              `text-capitalize`,
              active_item == 'Fixed Broadband' ? `active-btn` : ``,
            ]"
            height="50"
            width="100%"
            disabled
          >
            Fixed Broadband
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-row justify="end" align="center" class="mr-10">
          <v-col lg="5" class="d-flex">
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
                  v-model="startDate"
                  solo
                  dense
                  prepend-inner-icon="mdi-calendar"
                  placeholder="Start Date"
                  readonly
                  :hint="$t('ui.field.start_date')"
                  persistent-hint
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                @input="inputDate"
                v-model="date_1"
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
                  v-model="endDate"
                  solo
                  dense
                  :hint="$t('ui.field.end_date')"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar"
                  placeholder="End Date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                @input="inputDate"
                v-model="date_2"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col lg="1">
            <v-btn
              elevation="0"
              class="text-capitalize white--text mb-6"
              color="#1976D2"
              @click="submitFilterDate"
              >Submit</v-btn
            >
          </v-col>
          <v-col lg="1">
            <v-btn
              elevation="0"
              class="text-capitalize ml-6 mb-6"
              @click="resetFilterDate"
              >Reset</v-btn
            >
          </v-col>
        </v-row>
      </v-row>
    </div>

    <v-divider class="mt-5 mb-10"></v-divider>

    <!-- Operator -->
    <div class="font-weight-bold" style="font-size: 20px">Operators</div>
    <div class="mt-5">
      <v-row>
        <v-col
          cols="4"
          md="4"
          lg="4"
          v-for="item in ticket_summary"
          :key="item.index"
        >
          <v-card class="">
            <div class="d-flex pa-5 justify-center">
              <img height="40px" :src="pmt_url + item.logo" alt="logo" />
              <div :class="['ml-5 mt-3 font-weight-bold', `${item.name}`]">
                {{ item.name }}
              </div>
            </div>
            <v-divider></v-divider>
            <v-row class="mt-5" justify="center" align="center">
              <v-col lg="12">
                <apexchart
                  class="pa-10"
                  type="donut"
                  :options="sourceOptions"
                  :series="item.data"
                ></apexchart>
              </v-col>
            </v-row>
            <v-btn
              width="100%"
              class="text-center text-capitalize detail-btn"
              @click="showOperatorDetail(item)"
            >
              View Detail
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- DIALOG OPERATOR DETAIL -->
    <v-dialog
      v-model="dialog_detail"
      style="z-index: 999"
      transition="dialog-top-transition"
    >
      <v-card class="pa-5 text-center">
        <div class="d-flex">
          <v-card-title>Details</v-card-title>
          <v-spacer></v-spacer>
          <v-btn class="mt-2" icon @click="dialog_detail = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider></v-divider>
        <v-row justify="center" align="center">
          <v-col lg="3">
            <div class="mt-2">Montel</div>
            <apexchart
              class="pa-10"
              type="donut"
              :options="sourceOptions"
              :series="selected_detail_card.montel"
            ></apexchart>
          </v-col>
          <v-divider class="mt-2" vertical></v-divider>
          <v-col lg="3">
            <div class="mt-2">QoE</div>
            <apexchart
              class="pa-10"
              type="donut"
              :options="sourceOptions"
              :series="selected_detail_card.qoe"
            ></apexchart>
          </v-col>
          <v-divider class="mt-2" vertical></v-divider>
          <v-col lg="3">
            <div class="mt-2">QoS</div>
            <apexchart
              class="pa-10"
              type="donut"
              :options="sourceOptions"
              :series="selected_detail_card.qos"
            ></apexchart>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-divider class="mt-15 mb-10"></v-divider>

    <!-- Ticket Table -->
    <div class="font-weight-bold mb-5" style="font-size: 20px">
      Ticket Table
    </div>
    <v-card class="pa-5">
      <v-row>
        <!-- <v-col lg="2">
          <v-select
            prepend-inner-icon="mdi-filter-outline"
            outlined
            dense
            placeholder="Filter"
          ></v-select>
        </v-col> -->
        <v-col lg="2">
          <v-select
            prepend-inner-icon="mdi-folder-outline"
            outlined
            v-model="app_id"
            :items="source"
            item-text="name"
            item-value="id"
            dense
            placeholder="Source"
          ></v-select>
        </v-col>
        <v-col lg="2">
          <v-select
            prepend-inner-icon="mdi-radio-tower"
            outlined
            v-model="selected_opsel"
            :items="opsel"
            item-text="name"
            item-value="id"
            dense
            placeholder="Assigned to"
          ></v-select>
        </v-col>
        <v-col lg="2">
          <v-select
            prepend-inner-icon="mdi-information-outline"
            outlined
            v-model="selected_status"
            :items="status"
            item-text="name"
            item-value="id"
            dense
            placeholder="Status"
          ></v-select>
        </v-col>
        <!-- <v-col lg="2">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            outlined
            dense
            placeholder="Search"
          ></v-text-field>
        </v-col> -->
        <v-col lg="2">
          <v-btn
            @click="submitFilter"
            elevation="0"
            class="text-capitalize white--text"
            color="#1976D2"
            rounded
            >Submit</v-btn
          >
          <v-btn
            elevation="0"
            class="text-capitalize white--text ml-5"
            color="red"
            rounded
            @click="resetFilter"
            >Reset</v-btn
          >
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        disable-pagination
        hide-default-footer
        class="elevation-0"
      >
        <template v-slot:item.ticket_status="{ item }">
          <v-chip
            v-if="item.ticket_status.name == 'On Progress'"
            class="ma-2"
            color="green"
            text-color="white"
          >
            {{ item.ticket_status.name }}
          </v-chip>
          <v-chip
            v-else-if="item.ticket_status.name == 'Open'"
            class="ma-2"
            color="#F2C94B"
            text-color="white"
          >
            {{ item.ticket_status.name }}
          </v-chip>
          <v-chip v-else class="ma-2" color="primary" text-color="white">
            {{ item.ticket_status.name }}
          </v-chip>
        </template>
        <template v-slot:item.open_at="{ item }">
          <div>{{ item.open_at | moment }}</div>
        </template>
        <template v-slot:item.app.name="{ item }">
          <div>
            {{ item.app.name }}
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <!-- BUTTON VIEW DETAIL -->
          <v-btn
            outlined
            elevation="0"
            class="mr-5 text-capitalize grey--text"
            color="white"
            @click="viewDetail(item)"
            >View</v-btn
          >

          <!-- BUTTON CLOSE TICKET -->
          <v-btn
            v-if="item.ticket_status.name != 'Closed'"
            outlined
            elevation="0"
            class="mr-5 text-capitalize grey--text"
            color="white"
            @click="
              selected_ticket = item;
              dialog_confirmation_close = true;
            "
            >Close</v-btn
          >

          <!-- BUTTON SEND TICKET REPORT -->
          <v-btn
            outlined
            elevation="0"
            class="text-capitalize grey--text"
            color="white"
            @click="
              selected_ticket = item;
              dialog_confirmation_report = true;
            "
            >Send Report</v-btn
          >

          <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
        </template>
        <template v-slot:no-data>
          <img
            height="300px"
            src="../../assets/image/empty.svg"
            alt="no data"
          />
          <div>No Data</div>
        </template>
      </v-data-table>

      <v-container class="max-width">
        <v-row justify="end" align="center">
          <v-col cols="2">
            <v-select
              :items="pagination.rowsPerPageItems"
              class="item-per-page"
              v-model="pagination.rowsPerPage"
              @change="initialize"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="initialize"
        ></v-pagination>
      </v-container>
      <v-overlay z-index="1999" :value="loading_overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>

    <!-- DIALOG TICKET DETAIL -->
    <v-dialog
      v-if="selected_data != null"
      fullscreen
      v-model="dialog"
      style="z-index: 1999"
    >
      <v-card>
        <v-toolbar
          style="position: fixed; top: 0; z-index: 99"
          width="100%"
          tile
          dark
          color="primary"
        >
          <div>
            <h3>Detail Ticket</h3>
            <small class="font-weight-bold">
              No.Ticket: {{ selected_data.ticket_number }}
            </small>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template v-slot:extension>
            <v-tabs v-model="tab" background-color="primary" dark fixed-tabs>
              <v-tab v-for="item in modal_items" :key="item.tab">
                {{ item.tab }}
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-tabs-items style="padding-top: 110px" v-model="tab">
          <v-tab-item v-for="item in modal_items" :key="item.tab">
            <component
              :is="item.content"
              :selected_data="selected_data"
              :close_at="closeat"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>

    <!-- DIALOG CLOSE TICKET CONFIRMATION -->
    <v-dialog v-model="dialog_confirmation_close" max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Apakah kamu yakin? </v-card-title>

        <v-card-text>
          Jika anda sudah yakin, pilih "Selesai" untuk menyelesaikan tiket atau
          pilih "Batal" untuk membatalkan.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            text
            @click="dialog_confirmation_close = false"
          >
            Batal
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="closeTicket(selected_ticket)"
          >
            Selesai
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG SEND TICKET REPORT CONFIRMATION -->
    <v-dialog v-model="dialog_confirmation_report" max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Kirim Laporan Tiket? </v-card-title>

        <v-card-text>
          Kirim laporan tiket kepada penanggungjawab operator jaringan.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            text
            @click="dialog_confirmation_report = false"
          >
            Batal
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="sendReportTicket(selected_ticket)"
          >
            Kirim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import RadialProgressBar from "vue-radial-progress";
import VueApexCharts from "vue-apexcharts";
import TabTicket from "../../components/ticketing/TabTicket.vue";
import TabProgress from "../../components/ticketing/TabProgress.vue";
import TabDetails from "../../components/ticketing/TabDetails.vue";
import JwtService from "../../services/jwt.services";

import Telkomsel from "../../assets/image/telkomsel-br_01.svg";
import Indosat from "../../assets/image/isat.svg";
import XL from "../../assets/image/xl.svg";
import Tri from "../../assets/image/3.svg";
import Smartfren from "../../assets/image/logo.svg";
import STI from "../../assets/image/sti1.svg";
import { GET_START_DATE, GET_END_DATE } from "../../store/modules/qoe.module";

export default {
  components: { RadialProgressBar, apexchart: VueApexCharts },
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    dialog_confirmation_close: false,
    dialog_confirmation_report: false,
    selected_ticket: null,
    active_item: "Operator Cellular",
    loading_overlay: false,
    dialog_detail: false,
    selected_detail_card: {
      name: "",
      data: [],
      montel: [],
      qoe: [],
      qos: [],
    },
    active: false,
    tab: null,
    modal_items: [
      {
        tab: "ticket",
        content: TabTicket,
      },
      {
        tab: "progress",
        content: TabProgress,
      },
      {
        tab: "details",
        content: TabDetails,
      },
    ],
    completedSteps1: 80,
    completedSteps2: 50,
    completedSteps3: 20,
    completedSteps4: 90,
    totalSteps: 100,
    series: [44, 55, 41, 17, 15],
    chartOptions: {
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
        colors: ["#3C99BA"],
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
      fill: {
        opacity: 0,
      },

      tooltip: {
        enabled: false,
      },
      labels: ["Open ", "On Progress ", "Closed "],
      legend: {
        enabled: false,
      },
      dataLabels: {
        formatter: function () {
          return "";
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      colors: ["#F2C94C", "#27AE60", "#56CCF2"],

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    dialog: false,
    dialogDelete: false,
    singleSelect: false,
    selected: [],
    selected_data: null,
    headers: [
      {
        text: "No.Ticket",
        align: "start",
        sortable: false,
        value: "ticket_number",
      },
      { text: "Date", value: "open_at", sortable: false },
      { text: "Subject", value: "subject", sortable: false },
      { text: "Source", value: "app.name", sortable: false },
      {
        text: "Scope",
        value: "source_data[0].app_table.name",
        sortable: false,
      },
      { text: "Assigned to", value: "cell_operator.name", sortable: false },
      { text: "Category", value: "category", sortable: false },
      { text: "Status", value: "ticket_status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    data: [],
    date_1: "",
    date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    date_picker_3: false,
    date_picker_4: false,
    selected_date: "",

    closeat: null,
    user_token: null,
    user: null,
    loading: false,
    opsel: [],
    source: [],
    selected_opsel: 0,
    ticket_summary: [],
    app_id: 0,
    status: [
      {
        id: 1,
        name: "Open",
      },
      {
        id: 2,
        name: "On Progress",
      },
      {
        id: 3,
        name: "Closed",
      },
    ],
    category: [
      {
        id: 1,
        name: "Service",
      },
      {
        id: 2,
        name: "Network",
      },
    ],
    selected_status: 0,
    province: [],
    city: [],
    district: [],
    sub_district: [],
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
    file: null,
    disabled_ticket: false,
    disabled_progress: true,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    sourceOptions: {
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#111",
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "",
                fontSize: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
              value: {
                show: true,
                fontSize: "2.5em",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: undefined,
                offsetY: -8,
                formatter: function (val) {
                  return val;
                },
              },
            },
          },
        },
      },
      labels: ["Open ", "On Progress ", "Closed "],
      legend: {
        show: true,
        position: "bottom",
        fontSize: "15px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 400,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.globals.seriesTotals[opts.seriesIndex];
        },
      },
      states: {
        hover: {
          filter: "none",
        },
      },
      colors: ["#F2C94C", "#27AE60", "#56CCF2"],
      noData: {
        text: "No Tickets Available",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#000",
          fontSize: "20px",
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    items: [
      {
        name: "PT Telekomunikasi Seluler",
        data: [50, 100, 200],
      },
      {
        name: "PT Indosat Ooredoo	",
        data: [30, 150, 320],
      },
      {
        name: "PT XL Axiata	",
        data: [20, 10, 170],
      },
      {
        name: "PT Hutchison 3 Indonesia	",
        data: [50, 10, 90],
      },
      {
        name: "PT Smartfren Telecom	",
        data: [60, 260, 100],
      },
      {
        name: "PT Sampoerna Telekomunikasi Indonesia",
        data: [70, 130, 120],
      },
    ],
    dataPerOperator: [
      {
        name: "PT Telekomunikasi Seluler",
        logo: Telkomsel,
        data: [4, 2, 2],
        montel: [1, 1, 1],
        qoe: [1, 1, 2],
        qos: [1, 1, 1],
      },
      {
        name: "PT Indosat Ooredoo",
        logo: Indosat,
        data: [5, 2, 3],
        montel: [1, 1, 1],
        qoe: [1, 1, 2],
        qos: [1, 1, 1],
      },
      {
        name: "PT XL Axiata",
        logo: XL,
        data: [8, 4, 2],
        montel: [1, 1, 1],
        qoe: [1, 1, 2],
        qos: [1, 1, 1],
      },
      {
        name: "PT Hutchison 3 Indonesia",
        logo: Tri,
        data: [10, 3, 3],
        montel: [1, 1, 1],
        qoe: [1, 1, 2],
        qos: [1, 1, 1],
      },
      {
        name: "PT Smartfren Telecom",
        logo: Smartfren,
        data: [8, 2, 2],
        montel: [1, 1, 1],
        qoe: [1, 1, 2],
        qos: [1, 1, 1],
      },
      {
        name: "PT Sampoerna Telekomunikasi Indonesia",
        logo: STI,
        data: [6, 3, 3],
        montel: [1, 1, 1],
        qoe: [1, 1, 2],
        qos: [1, 1, 1],
      },
    ],
    total_ticket: 0,
    total_in_progress: 0,
    total_closed: 0,
  }),

  filters: {
    moment: function (date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  computed: {
    startDate: function () {
      return moment(this.date_1).format("YYYY-MM-DD");
    },
    endDate: function () {
      return moment(this.date_2).format("YYYY-MM-DD");
    },
    openAt: function () {
      return moment(this.selected_data.open_at).format("YYYY-MM-DD");
    },
    closeAt: function () {
      return moment(this.closeat).format("YYYY-MM-DD");
    },
    start_date: function () {
      return this.$store.getters.start_date;
    },
    end_date: function () {
      return this.$store.getters.end_date;
    },
  },

  mounted() {
    this.user = JwtService.getUser();
    this.getSummaryByOperators();
  },

  created() {
    this.user_token = JwtService.getToken();

    this.date_1 = new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .substr(0, 10);

    this.initialize();
  },

  methods: {
    addActive() {
      this.active = !this.active;
      console.log(this.active);
    },

    removeActive(e) {
      console.log(e);
      this.active = false;
      console.log(this.active);
    },

    submitFilter() {
      this.getTicket();
    },

    initialize() {
      this.getTicket();
      this.getApplication();
      this.getOperator();
      this.getTicketStatus();
    },

    async getSummaryByOperators() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_type: 0,
      };

      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/operators`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          const arr = [];
          // SELF INVOKE ASYNC FUNC
          (async () => {
            for (let data of result.data) {
              let finalArray = data.data.map(({ count }) => count);
              arr.push(finalArray);

              for (let opsel of this.opsel) {
                if (data.name == opsel.name) {
                  let montelArray = [];
                  let qosArray = [];
                  let qoeArray = [];
                  // GET DATA SUMMARY QOE
                  await this.getQOESummary(opsel).then((result) => {
                    qoeArray = result;
                  });

                  // GET DATA SUMMARY MONTEL
                  await this.getMontelSummary(opsel).then((result) => {
                    montelArray = result;
                  });

                  // GET DATA SUMMARY QOS
                  await this.getQOSSummary(opsel).then((result) => {
                    qosArray = result;
                  });

                  // PUSH DATA
                  this.ticket_summary.push({
                    data: finalArray,
                    logo: opsel.logo,
                    name: opsel.name,
                    qoe: qoeArray,
                    montel: montelArray,
                    qos: qosArray,
                  });
                }
              }

              // this.ticket_summary.push({
              //   data: finalArray,
              //   logo: data.logo,
              //   name: data.name,
              // });
              console.log(this.ticket_summary);
            }
          })();

          // let total = arr.map(item => item)
          // console.log(total)

          // this.total_ticket = arr.reduce((a, b) => a + b, 0);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getTicketStatus() {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: 0,
        app_id: 0,
      };

      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/ticket-status`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.total_ticket = result.data.reduce(
            (accum, item) => accum + item.count,
            0
          );
          for (let data of result.data) {
            if (data.name == "On Progress") {
              this.total_in_progress = data.count;
            }

            if (data.name == "Closed") {
              this.total_closed = data.count;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getQOESummary(opsel) {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: opsel.id,
        app_id: 2,
      };

      return fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/ticket-status`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          let qoeArray = result.data.map(({ count }) => count);
          return Promise.resolve(qoeArray);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getQOSSummary(opsel) {
      const data = {
        start_date: "",
        end_date: "",
        cell_operator_id: opsel.id,
        app_id: 3,
      };

      return fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/ticket-status`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          let qosArray = result.data.map(({ count }) => count);
          return Promise.resolve(qosArray);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getMontelSummary(opsel) {
      const data = {
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: opsel.id,
        app_id: 4,
      };

      return fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/ticket-status`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          let montelArray = result.data.map(({ count }) => count);
          return Promise.resolve(montelArray);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    resetFilter() {
      this.pagination.rowsPerPage = 10;
      this.pagination.page = 1;
      this.selected_opsel = 0;
      this.app_id = 0;
      this.selected_status = 0;

      this.getTicket();
    },

    getTicket() {
      this.loading = true;
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: "desc",
        start_date: this.start_date,
        end_date: this.end_date,
        cell_operator_id: this.selected_opsel,
        app_id: this.app_id,
        ticket_status_id: this.selected_status,
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.loading_overlay = false;
          if (result.error == true) {
            this.data = [];
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            // this.selected_opsel = 0;
            // this.selected_status = 0;
            // this.app_id = 0;
            // this.loading = false;

            // this.initialize();
          }
          this.data = result.data.data;
          this.selected_opsel = 0;
          this.selected_status = 0;
          this.app_id = 0;
          this.pagination.page = result.data.pagination.current_page;
          this.pagination.totalItems = result.data.pagination.total_page;

          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getApplication() {
      this.loading = true;
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/application`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.source = result.data.data;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getOperator() {
      this.loading = true;
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/cell-operator`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.opsel = result.data.data;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    viewDetail(item) {
      console.log("viewDetail", item);
      this.dialog = true;
      this.selected_data = item;
      if (item.close_at != null) {
        this.closeat = new Date(item.close_at).toISOString().substr(0, 10);
      } else {
        this.closeat = new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
      }

      console.log(item);
    },

    closeTicket(value) {
      this.loading_overlay = true;
      let closeAt = moment().format("YYYY-MM-DD HH:mm:ss");
      let formData = new FormData();

      formData.append("id", value.id);
      formData.append("cell_operator_id", value.cell_operator_id);
      formData.append("province_id", value.province_id);
      formData.append("city_id", value.city_id);
      formData.append("district_id", value.district_id);
      formData.append("sub_district_id", value.sub_district_id);
      formData.append("ticket_status_id", 3);
      formData.append("category", value.category);
      formData.append("description", value.province_id);
      formData.append("subject", value.subject);
      formData.append("ticket_number", value.ticket_number);
      formData.append("close_at", closeAt);
      formData.append("attachment", value.attachment);

      fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket/update`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ` + this.user_token,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.loading_overlay = false;
          if (result.error == true) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
          } else {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
            this.dialog_confirmation_close = false;
            this.selected_ticket = null;
            this.initialize();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    sendReportTicket(value) {
      this.loading_overlay = true;

      let data = {
        id: value.id,
      };

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/ticket/send-ticket-report`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + this.user_token,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.loading_overlay = false;
          if (result.error == true) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
          } else {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
            this.dialog_confirmation_report = false;
            this.selected_ticket = null;
            this.initialize();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    inputDate() {
      this.start_date = this.date_1;
      this.end_date = this.date_2;
    },

    submitFilterDate() {
      this.$store.dispatch(GET_START_DATE, this.date_1);
      this.$store.dispatch(GET_END_DATE, this.date_2);
      this.data = [];
      this.ticket_summary = [];
      this.getSummaryByOperators();
      this.initialize();
    },

    resetFilterDate() {
      this.$store.dispatch(GET_START_DATE, "");
      this.$store.dispatch(GET_END_DATE, "");
      this.data = [];
      this.ticket_summary = [];
      this.getSummaryByOperators();
      this.initialize();
    },

    closeModal() {
      this.dialog = false;
      this.data = [];
      this.selected_data = null;
      this.tab = null;
      this.initialize();
    },

    showOperatorDetail(item) {
      console.log(item);
      this.dialog_detail = true;
      this.selected_detail_card = item;
    },
  },
};
</script>

<style scoped>
/* @import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css"; */

.nav-card,
.e-round-corner {
  border-radius: 20px;
}

/* .v-dialog--fullscreen > .v-card {
  padding: 30px !important
} */

.input {
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 7px;
  border-radius: 20px;
  border: 1px solid #4a5759;
}

input:focus {
  outline: none !important;
}

.input-active {
  border: 1px solid red !important;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
}

.icon-time {
  margin-top: 5px;
}

.total-ticket,
.total-in-progress,
.total-complete {
  border-radius: 20px;
}

.total-ticket {
  background-image: linear-gradient(
    181deg,
    rgba(249, 97, 100, 1) 0.4%,
    rgba(250, 126, 129, 1) 89.6%
  );
  color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
}

.total-complete {
  background-image: radial-gradient(
    circle 465px at -15.1% -25%,
    rgba(17, 130, 193, 1) 0%,
    rgba(67, 166, 238, 1) 49%,
    rgba(126, 203, 244, 1) 90.2%
  );
  color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
}

.total-in-progress {
  background-image: linear-gradient(
    109.6deg,
    rgba(102, 203, 149, 1) 11.2%,
    rgba(39, 210, 175, 1) 98.7%
  );
  color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
}

.follow-up {
  margin-right: 7.5px;
}
.closed {
  margin-right: 34px;
}
.detail-btn {
  background-color: #6da7ff !important;
  color: white !important;
  box-shadow: 0 0 20px #eee;
  transition: 0.5s;
}

.v-divider {
  border-width: 2px;
  border-radius: 20px;
}

.item-per-page {
  width: 150px;
}

.item-per-page::before {
  content: "Item";
  margin-top: 0.5em;
  margin-right: 1em;
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

/* .v-dialog__content.v-dialog__content--active {
  z-index: 1999 !important;
} */
</style>
