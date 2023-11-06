<template>
  <div>
    <div class="font-weight-bold mt-7 mb-5" style="font-size: 20px">
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
            v-model="selectOperator"
            :items="itemOperator"
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
            v-model="selectStatus"
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
            v-model="search"
            :disabled="whileDownload"
          ></v-text-field>
        </v-col>
        <v-col cols="3" lg="2" xl="1">
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
                  date.default != true
                    ? dateDisplay.startDate
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
              @input="inputDate"
              v-model="date.startDate"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3" lg="2" xl="1">
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
                  date.default != true ? dateDisplay.endDate : date.defaultText
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
              @input="inputDate"
              v-model="date.endDate"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3" lg="2" xl="1">
          <v-btn
            @click="getTicket()"
            elevation="0"
            block
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
            class="text-capitalize white--text ml-2"
            color="red"
            block
            rounded
            @click="resetFilter"
            >Reset</v-btn
          ></v-col
        >
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
          </download-excel></v-col
        >
        <v-col cols="3" lg="3" xl="3">
          <v-btn
            style="color: #5e5873"
            color="white"
            block
            :disabled="selected.length == 0 || selected_opsel == 0"
            @click="
              selected_ticket = selected;
              dialog_confirmation_report = true;
            "
          >
            <div class="text-capitalize">
              {{ $t("ui.button_send_report_ticket") }}
            </div>
            <v-icon>mdi-email-send-outline</v-icon>
          </v-btn></v-col
        >
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
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn
              @click="resetFilter"
              color="primary"
              class="text-capitalize my-5"
              >Reset</v-btn
            >
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <td>
            <v-menu nudge-left="190" nudge-top="20">
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
      </v-data-table>

      <v-container class="max-width">
        <v-row justify="end" align="center">
          <v-col cols="2">
            <v-select
              :items="pagination.rowsPerPageItems"
              class="item-per-page"
              v-model="pagination.rowsPerPage"
              @change="getTicketByRow()"
              :disabled="whileDownload"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="getTicket()"
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

<script src="./TableTicket"></script>

<style>
.button-action:hover {
  color: #2196f3;
}
</style>
