<template>
  <v-card class="pa-5">
    <div class="d-flex">
      <div class="font-weight-bold mr-2">Report Speed Test</div>
      (Value Threshold {{ speed_threshold.value }} Mbps )
    </div>
    <v-row class="mt-5">
      <v-col cols="2">
        <v-select
          v-model="selected_opsel_temp"
          :items="filter.cell_operator"
          item-text="name"
          item-value="id"
          solo
          dense
          placeholder="Network Operator"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selected_tech"
          :items="filter.technology"
          item-text="name"
          item-value="value"
          solo
          dense
        ></v-select>
      </v-col>
      <v-col lg="2">
        <v-select
          v-model="selected_status"
          :items="filter.status"
          item-text="name"
          item-value="id"
          solo
          dense
        ></v-select>
      </v-col>
      <v-col lg="2">
        <v-btn
          elevation="0"
          class="mr-5 text-capitalize"
          color="primary"
          rounded
          @click="getSpeedTest"
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
          :disabled="selected.length == 0 || selected_opsel == 0"
        >
          <div class="mr-2 text-capitalize">
            {{ $t("ui.button_create_ticket") }}
          </div>
          <v-icon>mdi-email-send-outline</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="2" v-if="isViewer != true">
        <download-excel
          class="btn btn-default"
          :data="speed_test"
          :fields="json_fields"
          worksheet="My Worksheet"
          name="qoe_speed.xls"
        >
          <v-btn width="100%" style="color: #5e5873" color="white">
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
      :items="speed_test"
      :single-select="singleSelect"
      :options="pagination"
      :items-per-page="pagination.rowsPerPage"
      single-expand
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      hide-default-footer
      show-select
      item-key="id"
      v-model="selected"
      class="elevation-0 mt-5"
      :item-class="row_threshold"
      @toggle-select-all="selectAllToggle"
    >
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
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Device</th>
                  <th class="text-left">Latitude</th>
                  <th class="text-left">Longitude</th>
                  <th class="text-left">IP Address</th>
                </tr>
              </thead>
              <tbody class="tbody-expanded">
                <tr>
                  <td>{{ item.user_information.name }}</td>
                  <td>{{ item.user_information.device }}</td>
                  <td>{{ item.user_information.full_address.latitude }}</td>
                  <td>{{ item.user_information.full_address.longitude }}</td>
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
          <v-btn color="primary" @click="getSpeedTest"> Reset </v-btn>
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
            <!-- <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }"> -->
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
            <!-- </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu> -->
          </v-col>
          <!-- <v-col lg="1" class="font-weight-bold mt-2">Province</v-col>
          <v-col lg="5" class="filter-text">
            <v-select
              v-model="selected_province"
              :value="selected_data.province_id"
              :items="province"
              item-value="id"
              item-text="name"
              dense
              outlined
              placeholder="Province"
              @change="getCity"
            ></v-select>
          </v-col> -->
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

          <!-- <v-col lg="1" class="font-weight-bold mt-2">City</v-col>
          <v-col lg="5" class="filter-text">
            <v-select
              v-model="selected_city"
              :value="selected_data.city_id"
              :items="city"
              item-value="id"
              item-text="name"
              dense
              outlined
              placeholder="City"
              @change="getDistrict"
            ></v-select>
          </v-col> -->

          <v-col lg="1" class="font-weight-bold mt-2">Subject</v-col>
          <v-col lg="5" class="filter-text">
            <v-text-field
              v-model="subject"
              dense
              outlined
              placeholder="Tidak bisa internet"
            ></v-text-field>
          </v-col>

          <!-- <v-col lg="1" class="font-weight-bold mt-2">District</v-col>
          <v-col lg="5" class="filter-text">
            <v-select
              v-model="selected_district"
              :value="selected_data.district_id"
              :items="district"
              item-value="id"
              item-text="name"
              dense
              outlined
              placeholder="District"
              @change="getSubDistrict"
            ></v-select>
          </v-col> -->
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
          <v-col lg="6" class="font-weight-bold mt-2">
            <!-- <v-row>
              <v-col cols="2">
                <div>Sub-District</div>
              </v-col>
              <v-col>
                <v-select
                  v-model="selected_sub_district"
                  :value="selected_data.sub_district_id"
                  :items="sub_district"
                  item-value="id"
                  item-text="name"
                  dense
                  outlined
                  placeholder="Sub District"
                ></v-select>
              </v-col>
            </v-row> -->
            <!-- <v-row>
              <v-col cols="2">
                <div>Attachment</div>
              </v-col>
              <v-col>
                <v-file-input
                  show-size
                  dense
                  outlined
                  v-model="attachment"
                  placeholder="Upload file"
                ></v-file-input>
              </v-col>
            </v-row> -->
          </v-col>
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

<script src="./SpeedTable.js"></script>

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
