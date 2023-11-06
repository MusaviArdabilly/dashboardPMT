<template>
  <section class="single-page">
    <v-overlay :value="loadingData">
      <v-progress-circular
        class="loader"
        :size="50"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
    </v-overlay>
    <NavbarBigScreen />
    <NavigationCellAndFo
      :link="{ cellular: '/summary-ticketing', fo: '/fo/summary-ticketing' }"
      is-page="Fixed Broadband"
    />
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
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="6" xl="6">
          <div class="pmt-flex wrap at-start">
            <v-col cols="3" xl="3">
              <v-select
                v-model="filter.orderAverage.value"
                :items="items.orderAverage"
                item-text="name"
                item-value="value"
                dense
                placeholder="Select ticket average"
                outlined
                rounded
                :disabled="input.isDisabled"
                @input="setTableLimit"
              ></v-select>
            </v-col>
            <v-col cols="3" xl="3">
              <v-autocomplete
                v-model="filter.orderOperator.value"
                :items="itemOperator"
                :search-input.sync="filter.orderOperator.searchOperator"
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
          </div>
        </v-col>
        <v-col cols="6" xl="6">
          <div class="pmt-flex wrap at-end">
            <v-col cols="3" xl="3">
              <v-menu
                v-model="filter.picker.datepicker1"
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
                    prepend-inner-icon="mdi-calendar-range-outline"
                    placeholder="Start Date"
                    :hint="$t('ui.field.start_date')"
                    persistent-hint
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @input="filterDate"
                  v-model="filter.date.startDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" xl="3">
              <v-menu
                class="ml-5"
                v-model="filter.picker.datepicker2"
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
                    prepend-inner-icon="mdi-calendar-range-outline"
                    placeholder="End Date"
                    :hint="$t('ui.field.end_date')"
                    persistent-hint
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @input="filterDate"
                  v-model="filter.date.endDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" xl="3">
              <v-btn
                elevation="0"
                class="text-capitalize white--text"
                color="#134889"
                width="100%"
                :disabled="input.isDisabled"
                @click="changeTicketClick"
                >{{ $t("ui.button_apply") }}</v-btn
              >
            </v-col>
          </div>
        </v-col>
      </div>
    </div>
    <v-card elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="itemTable"
        class="pl-3 pr-3 pmt-table"
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
        <template v-slot:[`item.operator_id`]="{ item }">
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
          <v-container class="max-width">
            <v-row justify="end" align="center">
              <v-col cols="2">
                <v-select
                  :items="pagination.rowsPerPageItems"
                  class="item-per-page"
                  v-model="pagination.rowsPerPage"
                  @input="setTableLimit"
                ></v-select>
              </v-col>
            </v-row>
            <div class="pmt-flex wrap at-center">
              <v-pagination
                v-model="pagination.page"
                class="my-4"
                :total-visible="7"
                :length="paginationType.totalItems"
                @input="setTable"
              ></v-pagination>
            </div>
          </v-container>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script src="./TicketingV2.js"></script>

<style></style>
