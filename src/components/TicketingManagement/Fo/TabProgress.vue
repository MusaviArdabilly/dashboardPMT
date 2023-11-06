<template>
  <v-timeline dense>
    <v-timeline-item color="primary">
      <v-card class="mr-10" elevation="2">
        <v-card-title class="primary white--text">
          <span class="text-h5"> Create Progress </span>
          <v-spacer></v-spacer>
          <v-btn
            @click="updateProgress"
            outlined
            color="white"
            rounded
            class="text-capitalize"
            >Create Progress</v-btn
          >
        </v-card-title>
        <v-container class="mt-2">
          <v-row>
            <v-col cols="1" class="font-weight-bold ml-2">Subject</v-col>
            <v-col cols="2">
              <v-text-field
                v-model="subject"
                outlined
                dense
                placeholder="Subject"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" class="font-weight-bold ml-2">Description</v-col>
            <v-col cols="4">
              <v-textarea
                v-model="description"
                outlined
                dense
                placeholder="Description"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row class="mb-5">
            <v-col cols="1" class="font-weight-bold ml-2">Attachment</v-col>
            <v-col cols="4">
              <div class="d-flex mb-5">
                <v-icon class="mr-5">mdi-file-outline</v-icon>
                <div>{{ chosenFile.name }}</div>
              </div>
              <div>
                <v-file-input
                  ref="file"
                  v-model="chosenFile"
                  style="display: none"
                >
                </v-file-input>
                <v-btn
                  color="primary"
                  width="150"
                  class="mr-5"
                  @click="uploadFile"
                >
                  <v-icon left class="mr-2"> mdi-cloud-upload </v-icon
                  >Upload</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-timeline-item>
    <v-timeline-item color="#283593" v-for="item in data" :key="item.index">
      <v-card class="mr-10" elevation="2">
        <v-card-title class="indigo darken-3 white--text">
          <span class="text-h5">
            {{ item.created_at | moment }}
          </span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-container class="mt-2">
          <v-row>
            <v-col cols="1" class="font-weight-bold ml-2">Subject</v-col>
            <v-col cols="2">
              {{ item.subject }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" class="font-weight-bold ml-2">Description</v-col>
            <v-col cols="4">
              {{ item.description }}
            </v-col>
          </v-row>
          <v-row class="mb-5">
            <v-col cols="1" class="font-weight-bold ml-2">Attachment</v-col>
            <v-col cols="4">
              <div class="d-flex mb-5">
                <v-icon class="mr-5">mdi-file-outline</v-icon>
                <div>
                  {{ item.attachment ? item.attachment : "-" }}
                </div>
              </div>
              <v-btn
                v-if="isViewer != true"
                :href="`${pmt_url + item.attachment}`"
                target="_blank"
                download
                color="primary"
                width="150"
              >
                <v-icon left class="mr-2"> mdi-cloud-download </v-icon
                >{{ $t("ui.button_download") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import JwtService from "../../../services/jwt.services";
import moment from "moment";

export default {
  props: ["selected_data"],
  data: () => ({
    user_token: null,
    data: [],
    selectedFile: null,
    isSelecting: false,
    chosenFile: "",
    subject: "",
    description: "",
  }),

  filters: {
    moment: function (date) {
      return moment(date).format("DD/MM/YYYY - hh:mm:ss");
    },
  },
  mounted() {
    this.user_token = JwtService.getToken();
    this.intialize();
  },

  methods: {
    intialize() {
      this.getProgress();
    },

    getProgress() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        ticket_id: this.selected_data.id,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket-progress`, {
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
          this.data = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    uploadFile() {
      this.$refs.file.$refs.input.click();
      console.log(this.chosenFile);
    },

    updateProgress() {
      const formData = new FormData();
      console.log("masuk");

      formData.append("ticket_id", this.selected_data.id);
      formData.append("subject", this.subject);
      formData.append("description", this.description);
      formData.append("attachment", this.chosenFile);

      fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket-progress/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ` + this.user_token,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.error == true) {
            this.$swal("Opps", result.message, "error");
          } else {
            this.subject = "";
            this.description = "";
            this.chosenFile = "";
            this.$swal({
              title: "Success",
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            }).then(() => this.intialize());
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
