<template>
  <v-card class="pa-5">
    <v-overlay :absolute="true" :value="whileDownload">
      <v-progress-circular
        class="loader"
        :size="50"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
      <span>{{ $t("ui.message.prepare_data") }}</span>
    </v-overlay>
    <div class="font-weight-bold mr-5">Rating</div>
    <v-row class="mt-5">
      <v-col cols="2" xl="2">
        <v-select
          v-model="filter.sort_cell_operator"
          :items="filterComputed.cell_operator"
          item-text="name"
          item-value="id"
          solo
          dense
          placeholder="Network Operator"
          :disabled="whileDownload"
        ></v-select>
      </v-col>
      <v-col cols="2" xl="2">
        <v-select
          v-model="filter.technology"
          :items="filterComputed.technology"
          item-text="name"
          item-value="value"
          solo
          dense
          :disabled="whileDownload"
        ></v-select>
      </v-col>
      <v-col cols="2" xl="2">
        <v-select
          v-model="filter.status"
          :items="filterComputed.status"
          item-text="name"
          item-value="id"
          solo
          dense
          :disabled="whileDownload"
        ></v-select>
      </v-col>
      <v-col cols="2" xl="2">
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
              v-model="filterComputed.preview.startDate"
              solo
              dense
              prepend-inner-icon="mdi-calendar-range-outline"
              placeholder="Start Date"
              :hint="$t('ui.field.start_date')"
              persistent-hint
              readonly
              v-bind="attrs"
              v-on="on"
              :disabled="whileDownload"
            ></v-text-field>
          </template>
          <v-date-picker v-model="filter.date.startDate"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" xl="2">
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
              v-model="filterComputed.preview.endDate"
              solo
              dense
              prepend-inner-icon="mdi-calendar-range-outline"
              placeholder="End Date"
              :hint="$t('ui.field.end_date')"
              persistent-hint
              readonly
              v-bind="attrs"
              v-on="on"
              :disabled="whileDownload"
            ></v-text-field>
          </template>
          <v-date-picker v-model="filter.date.endDate"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" xl="2">
        <v-btn
          elevation="0"
          class="mr-5 text-capitalize"
          color="primary"
          rounded
          @click="filterData"
          :disabled="whileDownload"
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
      <v-col cols="2" xl="2" v-if="isViewer == false">
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

      <v-col cols="2" xl="2" v-if="isViewer != true">
        <download-excel
          class="btn btn-default"
          :fetch="fetchRatingCell"
          :fields="excelFields('rating')"
          worksheet="My Worksheet"
          name="qoe_rating.xls"
          :before-generate="startDownload"
          :before-finish="finishDownload"
        >
          <v-btn
            :loading="whileDownload"
            :disabled="whileDownload"
            width="100%"
            style="color: #5e5873"
            color="white"
          >
            <div class="mr-2 text-capitalize">
              {{ $t("ui.button_download") }}
            </div>
            <v-icon>mdi-file-download-outline</v-icon>
          </v-btn>
        </download-excel>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :loading="loading"
      :items="rating"
      :single-select="singleSelect"
      :options="pagination"
      :items-per-page="pagination.rowsPerPage"
      hide-default-footer
      :show-select="isViewer == false"
      item-key="id"
      v-model="selected"
      class="elevation-0"
      @toggle-select-all="selectAllToggle"
    >
      <template v-slot:item.rating_at="{ item }">
        <div>{{ timeFilter(item.rating_at) }}</div>
      </template>

      <template
        v-slot:item.data-table-select="{ on, props, item, isSelected, select }"
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

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pa-0 td-expanded">
          <v-simple-table>
            <template v-slot:default>
              <thead class="th-expanded">
                <!-- DETAIL TEST VIDEO TEST -->
                <tr v-if="item.test_type == 'videotest'">
                  <th class="text-left">SOURCE</th>
                  <th class="text-left">YOUTUBE ID</th>
                  <th class="text-left">BUFFERING</th>
                  <th class="text-left">THROUGHPUT</th>
                  <th class="text-left">IP ADDRESS</th>
                </tr>
                <!-- DETAIL TEST SPEED TEST -->
                <tr v-if="item.test_type == 'speedtest'">
                  <th class="text-left">TIME</th>
                  <th class="text-left">UPLOAD</th>
                  <th class="text-left">{{ $t("ui.button_download") }}</th>
                  <th class="text-left">SIGNAL STRENGTH</th>
                  <th class="text-left">IP ADDRESS</th>
                </tr>
                <!-- DETAIL TEST WEB TEST -->
                <tr v-if="item.test_type == 'webtest'">
                  <th class="text-left">URL</th>
                  <th class="text-left">THROUGHPUT</th>
                  <th class="text-left">LOADING TIME</th>
                  <th class="text-left">IP ADDRESS</th>
                </tr>
              </thead>
              <tbody class="tbody-expanded">
                <tr v-if="item.test_type == 'videotest'">
                  <td>{{ item.test_data.source }}</td>
                  <td>{{ item.test_data.youtube_id }}</td>
                  <td>{{ item.test_data.buffering }}</td>
                  <td>{{ item.test_data.throughput }}</td>
                  <td>{{ item.user_information.ip }}</td>
                </tr>
                <tr v-if="item.test_type == 'speedtest'">
                  <td>{{ item.test_data.time }}</td>
                  <td>{{ item.test_data.upload }}</td>
                  <td>{{ item.test_data.download }}</td>
                  <td>{{ item.test_data.signalStrength }}</td>
                  <td>{{ item.user_information.ip }}</td>
                </tr>
                <tr v-if="item.test_type == 'webtest'">
                  <td>{{ item.test_data.url }}</td>
                  <td>{{ item.test_data.throughput }}</td>
                  <td>{{ item.test_data.loadingTime }}</td>
                  <td>{{ item.user_information.ip }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
      </template>

      <template v-slot:no-data>
        <div class="pa-5">
          <img
            height="300px"
            src="../../../assets/image/empty.svg"
            alt="no data"
          />
          <div>No Data</div>
          <v-btn color="primary" @click="resetFilter"> Reset </v-btn>
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
            @change="filterData"
            :disabled="whileDownload"
          ></v-select>
        </v-col>
      </v-row>
      <v-pagination
        v-model="pagination.page"
        class="my-4"
        :total-visible="7"
        :length="pagination.totalItems"
        @input="switchPagination"
        :disabled="whileDownload"
      ></v-pagination>
    </v-container>
    <v-overlay :z-index="999" :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- DIALOG CREATE TICKET -->
    <v-dialog width="80%" v-model="dialog">
      <v-card class="pa-5">
        <div class="font-weight-bold">{{ $t("ui.button_create_ticket") }}</div>
        <v-row class="mt-10">
          <v-col lg="1" class="font-weight-bold"> Source </v-col>
          <v-col lg="5" class="filter-text"> {{ app_name }} </v-col>
          <v-col lg="1" class="font-weight-bold">Status</v-col>
          <v-col lg="5" class="filter-text">Open</v-col>
          <v-col lg="1" class="font-weight-bold">Reported Case</v-col>
          <v-col lg="5" class="filter-text">{{ selected.length }}</v-col>
          <v-col lg="1" class="font-weight-bold mt-2">Assign to</v-col>
          <v-col lg="5" class="filter-text">
            <v-select
              v-model="filter.cell_operator"
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
              disabled
            ></v-text-field>
          </v-col>
          <v-col lg="1" class="font-weight-bold mt-2">Category</v-col>
          <v-col lg="5" class="filter-text">
            <v-select
              v-model="category"
              :items="filterComputed.list_category"
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
              placeholder="Tidak bisa internet"
            ></v-text-field>
          </v-col>
          <v-col lg="1" class="font-weight-bold mt-2">Attachment</v-col>
          <v-col lg="5" class="filter-text">
            <v-file-input
              show-size
              dense
              outlined
              v-model="attachment"
              placeholder="Upload file"
            ></v-file-input>
          </v-col>

          <v-col lg="1" class="font-weight-bold mt-2">Description</v-col>
          <v-col lg="5" class="filter-text">
            <v-textarea v-model="description" dense outlined></v-textarea>
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
  </v-card>
</template>

<script src="./RatingTableV2.js"></script>

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

.td-expanded {
  background-color: white;
}
.th-expanded {
  background-color: #b3e5fc;
}
.tbody-expanded {
  background-color: #e1f5fe;
}
</style>
