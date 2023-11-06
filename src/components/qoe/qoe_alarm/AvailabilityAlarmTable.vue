<template>
  <v-card class="px-5 py-2">
    <div class="font-weight-bold mt-2 mr-5">Alarm Availability Device</div>
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
          @change="resetPaginate"
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
          @change="resetPaginate"
        ></v-select>
      </v-col>
      <v-col lg="2">
        <v-btn
          elevation="0"
          class="mr-5 text-capitalize"
          color="primary"
          rounded
          @click="getAlarm"
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
    </v-row>
    <v-data-table
      :headers="headers"
      :items="alarm"
      :loading="loading"
      :single-select="singleSelect"
      hide-default-footer
      disable-pagination
      class="elevation-0 pa-3 pb-5"
      item-key="id"
      v-model="selected"
      show-select
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
      <template v-slot:item.is_resolved="{ item }">
        <v-chip
          v-if="item.is_resolved"
          class="ma-2"
          color="green"
          text-color="white"
        >
          Resolved
        </v-chip>
        <v-chip v-else class="ma-2" color="red" text-color="white">
          Open
        </v-chip>
      </template>
      <template v-slot:item.created_at="{ item }">
        <div>{{ item.created_at | moment }}</div>
      </template>
      <template v-slot:item.updated_at="{ item }">
        <div v-if="item.is_resolved">
          {{ item.updated_at | moment }}
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:no-data>
        <div class="pa-5">
          <img
            height="300px"
            src="../../../assets/image/empty.svg"
            alt="no data"
          />
          <div>No Data</div>
          <v-btn color="primary" @click="getAlarm"> Reset </v-btn>
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
            @change="getAlarm"
          ></v-select>
        </v-col>
      </v-row>
      <v-pagination
        v-model="pagination.page"
        class="my-4"
        :total-visible="7"
        :length="pagination.totalItems"
        @input="getAlarm"
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
              disabled
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

          <v-col lg="1" class="font-weight-bold mt-2">Subject</v-col>
          <v-col lg="5" class="filter-text">
            <v-text-field
              v-model="subject"
              dense
              outlined
              placeholder=""
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

<script>
import JwtService from "../../../services/jwt.services";

import moment from "moment";
import { GET_ALARM } from "../../../store/modules/qoe.module";
import { GET_OPSEL } from "../../../store/modules/opsel.module";
export default {
  data: () => ({
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
      { text: "USERNAME", value: "username", sortable: false },
      {
        text: "IMEI",
        value: "imei",
        sortable: false,
      },
      { text: "CELL OPERATOR", value: "cell_operator.name", sortable: false },
      { text: "STATUS", value: "is_resolved", sortable: false },
      { text: "OFFLINE TIME", value: "created_at", sortable: false },
      { text: "ONLINE TIME", value: "updated_at", sortable: false },
      {
        text: "PROVINCE",
        value: "user_information.full_address.provinsi",
        sortable: false,
      },
      {
        text: "CITY",
        value: "user_information.full_address.kota_kabupaten",
        sortable: false,
      },
      {
        text: "DISTRICT",
        value: "user_information.full_address.kecamatan",
        sortable: false,
      },
      {
        text: "SUB DISTRICT",
        value: "user_information.full_address.kelurahan",
        sortable: false,
      },
      {
        text: "LATITUDE",
        value: "user_information.full_address.latitude",
        sortable: false,
      },
      {
        text: "LONGITUDE",
        value: "user_information.full_address.longitude",
        sortable: false,
      },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    search: "",
    sort: "desc",
    loading_overlay: false,
    loading: false,
    status: [
      {
        id: "",
        name: "All Status",
      },
      {
        id: "Open",
        name: "Open",
      },
      {
        id: "Resolved",
        name: "Resolved",
      },
    ],
    selected_status: "",
    selected_opsel_temp: 0,
    selected_opsel: 0,
  }),

  filters: {
    moment: function (date) {
      return moment(date).format("DD/MM/YYYY - hh:mm:ss");
    },
  },

  computed: {
    // loading: function () {
    //   return this.$store.getters.loading;
    // },

    start_date: function () {
      return this.$store.getters.start_date;
    },

    end_date: function () {
      return this.$store.getters.end_date;
    },

    alarm: function () {
      return this.$store.getters.alarm;
    },

    item_opsel: function () {
      return this.$store.getters.item_opsel;
    },

    opsel: function () {
      return this.$store.getters.getOpsel;
    },
  },

  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },

  methods: {
    initialize() {
      this.getOperatorCellular();
      this.getProvince();
      this.getAlarm();
    },

    getAlarm() {
      if (this.search.length != 0 && this.search.length < 3) {
        return;
      }

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
        start_date: "",
        end_date: "",
        cell_operator_id: this.selected_opsel,
        status: this.selected_status,
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
        search: this.search,
      };

      this.$store.dispatch(GET_ALARM, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }
        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
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

    logout() {
      localStorage.removeItem("user");
      this.$router.push({ name: "Login" });
    },

    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
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
            this.getAlarm();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    row_resolved(item) {
      if (item.is_resolved == false) {
        return "red--text";
      }
    },

    applyFilter() {
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.sort,
        start_date: "",
        end_date: "",
        cell_operator_id: this.selected_opsel_temp,
        status: this.selected_status,
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
        search: this.search,
      };

      this.$store.dispatch(GET_ALARM, data).then((result) => {
        if (result.error) {
          this.pagination.page = 1;
          this.pagination.totalItems = 0;
          return;
        }
        console.log("ALARM", result);
        this.pagination.page = result.data.pagination.current_page;
        this.pagination.totalItems = result.data.pagination.total_page;
      });
    },

    resetFilter() {
      this.alarm = [];
      this.selected_opsel_temp = 0;
      this.selected_status = "All Status";
      this.initialize();
    },

    resetPaginate() {
      this.pagination.page = 1;
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
</style>
