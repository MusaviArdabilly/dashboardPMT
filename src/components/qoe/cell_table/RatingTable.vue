<template>
  <v-card class="pa-5">
    <div class="font-weight-bold mr-5">Rating</div>
    <v-row class="mt-5">
      <v-col cols="2">
        <v-select
          v-model="selected_opsel_temp"
          :items="item_opsel"
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
          :items="technology"
          item-text="name"
          item-value="name"
          solo
          dense
        ></v-select>
      </v-col>
      <v-col lg="2">
        <v-select
          v-model="selected_status"
          :items="status"
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
          @click="getRating"
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
          :data="rating"
          :fields="json_fields"
          worksheet="My Worksheet"
          name="qoe_rating.xls"
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
      :items="rating"
      :single-select="singleSelect"
      :options="pagination"
      :items-per-page="pagination.rowsPerPage"
      hide-default-footer
      show-select
      item-key="id"
      v-model="selected"
      class="elevation-0"
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
          <!-- <v-btn color="primary" @click="getRating"> Reset </v-btn> -->
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
            @change="getRating"
          ></v-select>
        </v-col>
      </v-row>
      <v-pagination
        v-model="pagination.page"
        class="my-4"
        :total-visible="7"
        :length="pagination.totalItems"
        @input="getRating"
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

<script>
import { jsPDF } from "jspdf";
import { GET_RATING } from "../../../store/modules/qoe.module";
import { GET_OPSEL } from "../../../store/modules/opsel.module";
import JwtService from "../../../services/jwt.services";

export default {
  data: () => ({
    user: null,
    loading_overlay: false,
    dialog: false,
    menu: false,
    app_name: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    list_category: [
      {
        id: 1,
        name: "Service",
      },
      {
        id: 2,
        name: "Network",
      },
    ],
    selected_status: "",
    province: [],
    city: [],
    district: [],
    sub_district: [],
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
    selected_cell_operator: 0,
    category: "",
    subject: "",
    description: "",
    attachment: null,
    selected_data: {
      province_id: 0,
      city_id: 0,
      cell_operator_id: 0,
    },
    form_create: {},
    singleSelect: false,
    selected: [],
    headers: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      { text: "RATING", value: "rating", sortable: false },
      { text: "Connection Type", value: "connection_type", sortable: false },
      { text: "TEST TYPE", value: "test_type", sortable: false },
      { text: "PROVINCE", value: "province.name", sortable: false },
      { text: "CITY", value: "city.name", sortable: false },
      { text: "DISTRICT", value: "district.name", sortable: false },
      { text: "SUB DISTRICT", value: "sub_district.name", sortable: false },
      { text: "Timestamp", value: "rating_at", sortable: false },

      // { text: "Actions", value: "actions", sortable: false },
    ],
    selected_opsel: 0,
    threshold: 0,
    selected_opsel_temp: 0,
    technology: [
      {
        name: "All Technology",
        id: 0,
      },
      {
        name: "2G",
        id: 1,
      },
      {
        name: "3G",
        id: 2,
      },
      {
        name: "4G",
        id: 3,
      },
      {
        name: "Wi-fi",
        id: 4,
      },
    ],
    status: [
      {
        id: "",
        name: "All Test Type",
      },
      {
        id: "speedtest",
        name: "Speed Test",
      },
      {
        id: "webtest",
        name: "Web Test",
      },
      {
        id: "videotest",
        name: "Video Test",
      },
    ],
    selected_tech: "All Technology",
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    cell_operator_id: 0,
    connection_type: "",
    search: "",
    sort: "desc",
    expanded: [],
    disabledCount: 0,

    json_fields: {
      ISP: "cell_operator.name",
      "CONNECTION TYPE": "connection_type",
      "TEST TYPE": "test_type",
      RATING: "rating",
      PROVINCE: "province.name",
      CITY: "city.name",
      DISTRICT: "district.name",
      "SUB DISTRICT": "sub_district.name",
      TIMESTAMP: "rating_at",
    },
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8",
        },
      ],
    ],
  }),
  computed: {
    opsel: function () {
      return this.$store.getters.getOpsel;
    },

    item_opsel: function () {
      return this.$store.getters.item_opsel;
    },

    rating: function () {
      return this.$store.getters.rating;
    },

    loading: function () {
      return this.$store.getters.loading;
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
    this.user_token = JwtService.getToken();
    // this.initialize();
  },
  created() {
    this.getOperatorCellular();
    this.getRating();
  },

  methods: {
    selectAllToggle(props) {
      if (
        this.selected.length != 0 &&
        this.selected.length != props.items.length
      ) {
        this.selected = [];
        return;
      }
      if (this.selected.length != this.rating.length - this.disabledCount) {
        this.selected = [];
        const self = this;
        props.items.forEach((item) => {
          if (!item.ticket_flag) {
            self.selected.push(item);
          }
        });
      } else this.selected = [];
    },
    expandedRow(value) {
      this.expanded.push(value);
    },
    getRating() {
      if (this.selected_tech == "All Technology") {
        this.connection_type = "";
      } else {
        this.connection_type = this.selected_tech;
      }

      this.selected_opsel = this.selected_opsel_temp;
      this.selected = [];

      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        cell_operator_id: this.selected_opsel,
        connection_type: this.connection_type,
        test_type: this.selected_status,
      };

      this.$store.dispatch(GET_RATING, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }
        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
      });
    },

    resetFilter() {
      this.selected_opsel = 0;
      this.selected_tech = "All Technology";
      this.selected_status = 1;

      this.getSpeedTest();
    },

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

    createPDF() {
      const doc = new jsPDF();

      doc.text("Format Sample Dashboard PMT!", 10, 10);
      doc.save("rating.pdf");
    },

    setupCreateTicket() {
      this.dialog = true;
      this.app_name = this.selected[0].app.name;
      this.selected_cell_operator = this.selected[0].cell_operator_id;
    },

    createTicket() {
      let data = new FormData();

      // MAPPING DATA FOR CREATE
      this.form_create = {
        app_id: this.selected[0].app_id,
        cell_operator_id: this.selected_opsel,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: this.selected_sub_district,
        ticket_status_id: 1, //open
        source_name: this.selected[0].app.key,
        category: this.category,
        subject: this.subject,
        description: this.description,
        open_at: this.date + " 00:00:00",
        attachment: this.attachment,
        source_data: JSON.stringify(this.selected),
      };

      for (let key in this.form_create) {
        if (Object.hasOwnProperty.call(this.form_create, key)) {
          data.append(key, this.form_create[key]);
        }
      }

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/ticket/create`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          if (result.error == true) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
          } else {
            this.dialog = false;
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
            this.getRating();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getProvince() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/location/province`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.province = result.data.data;
            if (this.selected_province != 0) {
              this.getCity();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCity() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        province_id: this.selected_province,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.city = result.data.data;

            if (this.selected_city != 0) {
              this.getDistrict();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDistrict() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        city_id: this.selected_city,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.district = result.data.data;
            if (this.selected_district != 0) {
              this.getSubDistrict();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getSubDistrict() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        district_id: this.selected_district,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.sub_district = result.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

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
