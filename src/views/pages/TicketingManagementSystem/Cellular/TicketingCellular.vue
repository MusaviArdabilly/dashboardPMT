<template>
  <div class="ticketing">
    <v-row>
      <router-link to="/">
        <v-icon size="40" class="mt-8" color="black">mdi-chevron-left</v-icon>
      </router-link>

      <v-col>
        <h1 class="my-4">
          {{ $t("general.menu.ticketing_management_system") }}
        </h1>
      </v-col>
    </v-row>
    <div class="pmt-flex is-row at-between">
      <NavigationCellAndFo
        :link="{
          cellular: '/dashboard/ticketing-management',
          fo: '/dashboard/ticketing-management-fo',
        }"
        is-page="Operator Cellular"
      />
      <v-btn
        class="black--text"
        elevation="10"
        color="#C9C9C9"
        outlined
        text
        @click="ticketSummaryDialog"
        >{{ $t("ui.button_summary_ticket") }}</v-btn
      >
    </div>
    <ticketing-summary-dialog
      :activator.sync="dialogNew.ticketDialog"
    ></ticketing-summary-dialog>
    <!-- Summary Cards -->
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-red" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">
                {{ $t("ui.summary_card.ticket_total") }}
              </h4>
              <span class="summary-count">{{ summaryCard.total_ticket }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-orange" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">
                {{ $t("ui.summary_card.ticket_open") }}
              </h4>
              <span class="summary-count">{{ summaryCard.open_ticket }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-green" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">
                {{ $t("ui.summary_card.ticket_progress") }}
              </h4>
              <span class="summary-count">{{
                summaryCard.progress_ticket
              }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-blue" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">
                {{ $t("ui.summary_card.ticket_closed") }}
              </h4>
              <span class="summary-count">{{ summaryCard.close_ticket }}</span>
            </div>
          </v-card>
        </v-col>
      </div>
    </div>

    <!-- card ticket category -->
    <div class="ticket-category pmt-flex wrap is-row at-end mt-10">
      <v-col cols="2" xl="2">
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
                date.default != true ? dateValue.startDate : date.defaultText
              "
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
            v-model="date.startDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" xl="2">
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
                date.default != true ? dateValue.endDate : date.defaultText
              "
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
            v-model="date.endDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" xl="1">
        <v-btn
          elevation="0"
          width="7rem"
          class="text-capitalize white--text mb-6 mr-2"
          color="#1976D2"
          @click="submitFilterDate"
          block
          >{{ $t("ui.button_submit") }}</v-btn
        >
      </v-col>
      <v-col cols="2" xl="1">
        <v-btn
          elevation="0"
          width="7rem"
          class="text-capitalize mb-6"
          @click="resetFilterDate"
          block
          >{{ $t("ui.button_reset") }}</v-btn
        >
      </v-col>
    </div>

    <v-divider class="mt-5 mb-10"></v-divider>

    <!-- Operator -->
    <div class="font-weight-bold" style="font-size: 20px">
      {{ $t("general.menu.operator_cellular") }}
    </div>
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
              {{ $t("ui.button_details") }}
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
      {{ $t("ui.menu_title.ticketing_management_table") }}
    </div>
    <v-card class="pa-5">
      <div class="pmt-flex wrap is-row">
        <v-col cols="3" lg="2" xl="2">
          <v-select
            prepend-inner-icon="mdi-folder-outline"
            outlined
            v-model="app_id"
            :items="source"
            item-text="name"
            item-value="id"
            dense
            placeholder="Source"
            :disabled="whileDownload"
          ></v-select>
        </v-col>
        <v-col cols="3" lg="2" xl="2">
          <v-select
            prepend-inner-icon="mdi-radio-tower"
            outlined
            v-model="selected_opsel_temp"
            :items="opsel"
            item-text="name"
            item-value="id"
            dense
            placeholder="Assigned to"
            :disabled="whileDownload"
          ></v-select>
        </v-col>
        <v-col cols="3" lg="2" xl="2">
          <v-select
            prepend-inner-icon="mdi-information-outline"
            outlined
            v-model="selected_status"
            :items="status"
            item-text="name"
            item-value="id"
            dense
            placeholder="Status"
            :disabled="whileDownload"
          ></v-select>
        </v-col>
        <v-col cols="3" lg="2" xl="2">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            outlined
            dense
            placeholder="Search"
            v-model="ticket_search"
            :disabled="whileDownload"
          ></v-text-field>
        </v-col>
        <v-col cols="3" lg="2" xl="1">
          <v-menu
            v-model="date_picker_3"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="
                  date.defaultTable != true
                    ? dateValue.startDate
                    : date.defaultText
                "
                class="mr-2"
                outlined
                dense
                prepend-inner-icon="mdi-calendar"
                placeholder="Start Date"
                readonly
                :hint="$t('ui.field.start_date')"
                persistent-hint
                v-bind="attrs"
                v-on="on"
                :disabled="whileDownload"
              ></v-text-field>
            </template>
            <v-date-picker
              @input="inputDate('table')"
              v-model="date.startDate"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3" lg="2" xl="1">
          <v-menu
            v-model="date_picker_4"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="
                  date.defaultTable != true
                    ? dateValue.endDate
                    : date.defaultText
                "
                outlined
                dense
                class="ml-2"
                :hint="$t('ui.field.end_date')"
                persistent-hint
                prepend-inner-icon="mdi-calendar"
                placeholder="End Date"
                readonly
                v-bind="attrs"
                v-on="on"
                :disabled="whileDownload"
              ></v-text-field>
            </template>
            <v-date-picker
              @input="inputDate('table')"
              v-model="date.endDate"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3" lg="2" xl="1">
          <v-btn
            @click="submitFilter"
            block
            elevation="0"
            class="text-capitalize white--text"
            color="#1976D2"
            rounded
            :disabled="whileDownload"
            >{{ $t("ui.button_submit") }}</v-btn
          >
        </v-col>
        <v-col cols="3" lg="2" xl="1">
          <v-btn
            elevation="0"
            block
            class="text-capitalize white--text ml-5"
            color="red"
            rounded
            @click="resetFilter"
            :disabled="whileDownload"
            >Reset</v-btn
          >
        </v-col>
        <v-col cols="3" lg="3" xl="3" v-if="isViewer != true">
          <download-excel
            class="btn btn-default mr-5"
            :fetch="fetchDownload"
            :fields="printOutHeader"
            worksheet="My Worksheet"
            name="ticket-management.xls"
            :before-generate="startDownload"
            :before-finish="finishDownload"
          >
            <v-btn
              :disabled="whileDownload"
              :loading="whileDownload"
              block
              style="color: #5e5873"
              color="white"
            >
              <v-icon>mdi-file-download-outline</v-icon>
              <div class="text-capitalize">
                {{ $t("ui.button_download") }}
              </div>
            </v-btn>
          </download-excel>
        </v-col>
        <v-col cols="3" lg="3" xl="3">
          <v-btn
            block
            style="color: #5e5873"
            color="white"
            :disabled="selected.length == 0"
            @click="
              selected_ticket = selected;
              dialog_confirmation_report = true;
            "
          >
            <div class="mr-2 text-capitalize">
              {{ $t("ui.button_send_report_ticket") }}
            </div>
            <v-icon>mdi-email-send-outline</v-icon>
          </v-btn>
        </v-col>
      </div>
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        :single-select="singleSelect"
        v-model="selected"
        item-key="id"
        show-select
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
          <td>
            <v-menu nudge-left="150" nudge-top="20">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on"
                  >mdi mdi-dots-horizontal</v-icon
                >
              </template>
              <div
                class="py-3 px-3 d-flex justify-center flex-column align-center"
                style="background-color: white"
              >
                <!-- BUTTON VIEW DETAIL -->
                <v-btn
                  class="text-capitalize button-action"
                  text
                  @click="viewDetail(item)"
                >
                  {{ $t("ui.button_view") }}
                </v-btn>

                <!-- BUTTON CLOSE TICKET -->
                <v-btn
                  v-if="item.ticket_status.name != 'Closed'"
                  class="text-capitalize button-action"
                  text
                  @click="
                    selected_ticket = item;
                    dialog_confirmation_close = true;
                  "
                >
                  {{ $t("ui.button_close") }}
                </v-btn>

                <!-- BUTTON SEND TICKET REPORT -->
                <v-btn
                  class="text-capitalize button-action"
                  text
                  @click="
                    selected_ticket = item;
                    dialog_confirmation_report = true;
                  "
                >
                  {{ $t("ui.button_send_report") }}
                </v-btn>

                <!-- BUTTON COPY LATLONG -->
                <v-btn
                  class="text-capitalize button-action"
                  text
                  @click="copyLatlong(item)"
                >
                  {{ $t("ui.button_copy_latlong") }}
                </v-btn>
              </div>
            </v-menu>
          </td>

          <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
        </template>
        <template v-slot:no-data>
          <img
            height="300px"
            src="../../../../assets/image/empty.svg"
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
              @change="getTicketByRow"
              :disabled="whileDownload"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="initialize"
          :disabled="whileDownload"
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
    <v-snackbar
      v-model="copyNotification"
      timeout="2000"
      color="primary"
      text
      top
      outlined
      style="top: 50px"
      ><span class="d-flex justify-center" style="width: 100%"
        >Long Lat copied !</span
      >
    </v-snackbar>
  </div>
</template>

<script src="./TicketingCellular.js"></script>

<style scoped>
.nav-card,
.e-round-corner {
  border-radius: 20px;
}

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
