<template>
  <div>
    <v-row>
      <router-link to="/">
        <v-icon size="40" class="mt-8" color="black">mdi-chevron-left</v-icon>
      </router-link>

      <v-col>
        <h1 class="my-4">
          {{ $t("general.menu.ticketing_management_system") }} FO
        </h1>
      </v-col>
    </v-row>
    <div class="pmt-flex is-row at-between">
      <NavigationCellAndFo
        :link="{
          cellular: '/dashboard/ticketing-management',
          fo: '/dashboard/ticketing-management-fo',
        }"
        is-page="Fixed Broadband"
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
      :activator.sync="dialog.ticketDialog"
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
              <span class="summary-count">{{ ticketCards.total_ticket }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-orange" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">
                {{ $t("ui.summary_card.ticket_open") }}
              </h4>
              <span class="summary-count">{{ ticketCards.open_ticket }}</span>
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
                ticketCards.progress_ticket
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
              <span class="summary-count">{{ ticketCards.close_ticket }}</span>
            </div>
          </v-card>
        </v-col>
      </div>
    </div>

    <!-- Button Navigation and Table Setting -->
    <v-row class="mt-1 ml-3 d-flex justify-space-between">
      <v-row class="mt-3">
        <v-col lg="4">
          <v-select
            v-model="selectOrder"
            :items="items.orderAverage"
            item-text="name"
            item-value="value"
            dense
            placeholder="Select Ticket Average"
            outlined
          ></v-select>
        </v-col>
        <v-col lg="4">
          <v-autocomplete
            v-model="selectOperator"
            :items="itemOperator"
            item-text="name"
            item-value="id"
            dense
            hide-no-data
            hide-details
            placeholder="Operator"
            outlined
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="mb-2 mr-5">
        <v-col lg="6" class="d-flex">
          <v-menu
            v-model="date_picker_1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="
                  date.default != true ? dateFilter.startDate : date.defaultText
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
              ></v-text-field>
            </template>
            <v-date-picker
              @input="inputDate"
              v-model="date.startDate"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="date_picker_2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="
                  date.default != true ? dateFilter.endDate : date.defaultText
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
              ></v-text-field>
            </template>
            <v-date-picker
              @input="inputDate"
              v-model="date.endDate"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col lg="3">
          <v-btn
            elevation="0"
            class="text-capitalize white--text mr-2"
            width="100%"
            color="#1976D2"
            @click="getSummaryTableData"
            >{{ $t("ui.button_apply") }}</v-btn
          >
        </v-col>
        <v-col lg="3">
          <v-btn
            width="100%"
            elevation="0"
            class="text-capitalize mb-6"
            @click="resetFilter"
            >Reset</v-btn
          >
        </v-col>
      </v-row>
    </v-row>

    <TableSummary
      :pagination="pagination"
      :itemTable="itemTable"
      :headers="headers"
      :loadingTable="loadingTable"
      :paginationType="paginationType"
      :setTable="setTable"
      :setTableLimit="setTableLimit"
    ></TableSummary>
    <TableTicket></TableTicket>
  </div>
</template>
<style scoped>
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
</style>
<script src="./TicketingFO"></script>
