<template>
  <v-row class="pa-5">
    <!-- first row -->
    <v-col lg="3">
      <div class="font-weight-bold">Source</div>
    </v-col>
    <v-col lg="3">
      <div>{{ selected_data.app.name }}</div>
    </v-col>
    <v-col lg="3">
      <div class="font-weight-bold">Status</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.ticket_status_id"
        :items="status"
        :disabled="disabled_ticket"
        item-value="id"
        item-text="name"
        dense
        outlined
        placeholder=""
      ></v-select>
    </v-col>

    <!-- second row -->
    <v-col lg="3">
      <div class="font-weight-bold">Date</div>
    </v-col>
    <v-col lg="3">
      <v-menu
        v-model="date_picker_3"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            class="mr-5"
            v-model="openAt"
            outlined
            prepend-inner-icon="mdi-calendar"
            placeholder="Start Date"
            readonly
            disabled
            hint="Open At"
            persistent-hint
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="selected_data.open_at"></v-date-picker>
      </v-menu>
      <v-menu
        v-model="date_picker_4"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            class="mr-5"
            v-model="closeAt"
            :disabled="disabled_ticket"
            outlined
            prepend-inner-icon="mdi-calendar"
            hint="Close At"
            persistent-hint
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="close_at"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col lg="3">
      <div class="font-weight-bold">Assign to</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.cell_operator_id"
        :items="itemOperator"
        :disabled="disabled_ticket"
        item-value="id"
        item-text="name"
        dense
        outlined
        placeholder=""
      ></v-select>
    </v-col>

    <!-- third row -->
    <v-col lg="3">
      <div class="font-weight-bold">Category</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.category"
        :items="category"
        :disabled="disabled_ticket"
        item-value="name"
        item-text="name"
        dense
        outlined
        placeholder=""
      ></v-select>
    </v-col>
    <v-col lg="3">
      <div class="font-weight-bold">Province</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.province_id"
        :items="province"
        :disabled="disabled_ticket"
        item-value="id"
        item-text="name"
        dense
        outlined
        @input="getCity(selected_data.province_id)"
        placeholder="Province"
      ></v-select>
    </v-col>

    <!-- fourth row -->
    <v-col lg="3">
      <div class="font-weight-bold">Subject</div>
    </v-col>
    <v-col lg="3">
      <v-text-field
        v-model="selected_data.subject"
        outlined
        :disabled="disabled_ticket"
        dense
        placeholder="Subject"
      ></v-text-field>
    </v-col>
    <v-col lg="3">
      <div class="font-weight-bold">City</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.city_id"
        :items="city"
        :disabled="disabled_ticket"
        item-value="id"
        item-text="name"
        dense
        outlined
        @input="getDistrict(selected_data.city_id)"
        placeholder="City"
      ></v-select>
    </v-col>

    <!-- fifth row -->
    <v-col lg="3">
      <div class="font-weight-bold">Description</div>
    </v-col>
    <v-col lg="3">
      <v-textarea
        dense
        :disabled="disabled_ticket"
        outlined
        v-model="selected_data.description"
      ></v-textarea>
    </v-col>
    <v-col lg="3">
      <div class="font-weight-bold">District</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.district_id"
        :items="district"
        :disabled="disabled_ticket"
        item-value="id"
        item-text="name"
        dense
        outlined
        @input="getSubDistrict(selected_data.district_id)"
        placeholder="District"
      ></v-select>
    </v-col>

    <!-- sixth row -->
    <v-col lg="3">
      <div class="font-weight-bold">Attachment</div>
    </v-col>
    <v-col lg="3">
      <div class="d-flex mb-5">
        <v-icon class="mr-5">mdi-file-outline</v-icon>
        <div>
          {{ selected_data.attachment ? selected_data.attachment : "-" }}
        </div>
      </div>
      <div>
        <v-file-input ref="file" v-model="file" style="display: none">
        </v-file-input>
        <v-btn color="primary" width="150" class="mr-5" @click="uploadFile">
          <v-icon left class="mr-2"> mdi-cloud-upload </v-icon>Upload</v-btn
        >

        <v-btn
          v-if="isViewer != true"
          :href="`${pmt_url + selected_data.attachment}`"
          target="_blank"
          download
          color="primary"
          width="150"
        >
          <v-icon left class="mr-2"> mdi-cloud-download </v-icon
          >{{ $t("ui.button_download") }}</v-btn
        >
      </div>
    </v-col>
    <v-col lg="3">
      <div class="font-weight-bold">Sub-District</div>
    </v-col>
    <v-col lg="3">
      <v-select
        v-model="selected_data.sub_district_id"
        :items="sub_district"
        :disabled="disabled_ticket"
        item-value="id"
        item-text="name"
        dense
        outlined
        placeholder="Sub District"
      ></v-select>
    </v-col>
    <v-col lg="12" class="mt-5">
      <div class="d-flex justify-end">
        <v-btn width="250" class="primary" @click="updateData"
          >Update Ticket</v-btn
        >
      </div>
    </v-col>
  </v-row>
</template>

<script>
import JwtService from "../../../services/jwt.services";
import moment from "moment";
export default {
  props: ["selected_data", "close_at"],
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    date_picker_3: false,
    date_picker_4: false,
    user_token: null,
    opsel: [],
    source: [],
    selected_opsel: 0,
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
  }),

  filters: {
    moment: function (date) {
      return moment(date).format("DD/MM/YYYY - hh:mm:ss");
    },
  },

  computed: {
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    startDate: function () {
      return moment(this.date_1).format("DD-MM-YYYY");
    },
    endDate: function () {
      return moment(this.date_2).format("DD-MM-YYYY");
    },
    openAt: function () {
      return moment(this.selected_data.open_at).format("DD-MM-YYYY");
    },
    closeAt: function () {
      return moment(this.close_at).format("DD-MM-YYYY");
    },
  },

  mounted() {
    this.user_token = JwtService.getToken();
    this.initialize();
  },

  methods: {
    initialize() {
      this.getProvince();
      this.getCity();
      this.getDistrict();
      this.getSubDistrict();
    },

    uploadFile() {
      this.$refs.file.$refs.input.click();
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
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/province`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error == false) {
            this.province = result.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCity(value) {
      // console.log(value);
      if (value == undefined) {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          province_id: this.selected_data.province_id,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            if (result.error == false) {
              this.city = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          province_id: value,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            if (result.error == false) {
              this.city = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getDistrict(value) {
      if (value == undefined) {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          city_id: this.selected_data.city_id,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            if (result.error == false) {
              this.district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          city_id: value,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            if (result.error == false) {
              this.district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getSubDistrict(value) {
      if (value == undefined) {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          district_id: this.selected_data.district_id,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            if (result.error == false) {
              this.sub_district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          district_id: value,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            if (result.error == false) {
              this.sub_district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    addFile(value) {
      console.log(value);
    },

    updateData() {
      let formData = new FormData();

      formData.append("id", this.selected_data.id);
      formData.append("cell_operator_id", this.selected_data.cell_operator_id);
      formData.append("province_id", this.selected_data.province.id);
      formData.append("city_id", this.selected_data.city.id);
      formData.append("district_id", this.selected_data.district.id);
      formData.append("sub_district_id", this.selected_data.sub_district.id);
      formData.append("ticket_status_id", this.selected_data.ticket_status_id);
      formData.append("category", this.selected_data.category);
      formData.append("description", this.selected_data.province_id);
      formData.append("subject", this.selected_data.subject);
      formData.append("ticket_number", this.selected_data.ticket_number);
      formData.append("close_at", `${this.close_at} 00:00:00`);
      formData.append("attachment", this.file);

      fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket/update`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ` + this.user_token,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("update", result);
          if (result.error == true) {
            this.$swal("Opps", result.message, "error");
          } else {
            this.$swal({
              title: "Success",
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    downloadFile(value) {
      fetch(process.env.VUE_APP_API_URL + value)
        .then((response) => response.arrayBuffer())
        .then((resp) => {
          // set the blog type to final pdf
          const file = new Blob([resp], { type: "application/pdf" });

          // process to auto download it
          const fileURL = URL.createObjectURL(file);
          console.log(fileURL);
          const link = document.createElement("a");
          link.href = fileURL;
          link.download = ".pdf";
          link.click();
        });
    },
  },
};
</script>

<style></style>
