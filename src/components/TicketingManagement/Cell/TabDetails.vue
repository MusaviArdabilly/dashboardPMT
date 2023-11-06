<template>
  <v-card class="pa-10" color="white">
    {{ selected_data.source_data[0].app_table.model_name }}
    <!-- IF MODEL NAME MONTEL -->
    <v-simple-table
      v-if="
        selected_data.source_data[0].app_table.model_name ==
        'MonitoringTelecommunication'
      "
    >
      <template v-slot:default>
        <thead class="th-expanded">
          <tr>
            <th class="text-left">Source</th>
            <th class="text-left">Account</th>
            <th class="text-left">Followers</th>
            <th class="text-left">Content</th>
            <th class="text-left">URL</th>
          </tr>
        </thead>
        <tbody class="tbody-expanded">
          <tr v-for="(data, index) in selected_data.source_data" :key="index">
            <td>{{ data.source }}</td>
            <td>{{ data.account }}</td>
            <td>{{ data.followers }}</td>
            <td>{{ data.content }}</td>
            <td>{{ data.url }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <!-- IF MODEL NAME QOE VIDEO TEST -->
    <v-data-table
      v-if="selected_data.source_data[0].app_table.model_name == 'VideoTest'"
      :headers="headers_video"
      :loading="loading"
      :items="selected_data.source_data"
      single-expand
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      hide-default-footer
      class="elevation-0"
    >
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
        </div>
      </template>
    </v-data-table>

    <!-- IF MODEL NAME QOE WEB TEST -->
    <v-data-table
      v-if="selected_data.source_data[0].app_table.model_name == 'WebTest'"
      :headers="headers_web"
      :loading="loading"
      :items="selected_data.source_data"
      single-expand
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      hide-default-footer
      class="elevation-0"
    >
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
        </div>
      </template>
    </v-data-table>

    <!-- IF MODEL NAME QOE SPEED TEST -->
    <v-data-table
      v-if="selected_data.source_data[0].app_table.model_name == 'SpeedTest'"
      :headers="headers_speed"
      :loading="loading"
      :items="selected_data.source_data"
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      hide-default-footer
      class="elevation-0"
    >
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
        </div>
      </template>
    </v-data-table>

    <!-- IF MODEL NAME QOE RATING -->
    <v-data-table
      v-if="selected_data.source_data[0].app_table.model_name == 'QoeRating'"
      :headers="headers_rating"
      :loading="loading"
      :items="selected_data.source_data"
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      hide-default-footer
      class="elevation-0"
    >
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
        </div>
      </template>
    </v-data-table>

    <!-- IF MODEL NAME QOE Availability -->
    <v-data-table
      v-if="
        selected_data.source_data[0].app_table.model_name == 'QoeAvailability'
      "
      :headers="headers_alarm"
      :loading="loading"
      :items="selected_data.source_data"
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      hide-default-footer
      class="elevation-0"
    >
      <template v-slot:no-data>
        <div class="pa-5">
          <img
            height="300px"
            src="../../../assets/image/empty.svg"
            alt="no data"
          />
          <div>No Data</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import JwtService from "../../../services/jwt.services";
import moment from "moment";

export default {
  props: ["selected_data"],
  data: () => ({
    loading: false,
    user_token: null,
    data: [],
    selectedFile: null,
    headers_video: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      { text: "Connection Type", value: "connection_type", sortable: false },
      { text: "Youtube ID", value: "video_information.id", sortable: false },
      { text: "Throughput", value: "throughput", sortable: false },
      { text: "PROVINCE", value: "province.name", sortable: false },
      { text: "CITY", value: "city.name", sortable: false },
      { text: "DISTRICT", value: "district.name", sortable: false },
      { text: "SUB DISTRICT", value: "sub_district.name", sortable: false },
      { text: "Timestamp", value: "test_at", sortable: false },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    headers_speed: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      { text: "Connection Type", value: "connection_type", sortable: false },
      { text: "DL", value: "download_speed", sortable: false },
      { text: "UL", value: "upload_speed", sortable: false },
      { text: "LATENCY", value: "latency", sortable: false },
      { text: "JITTER", value: "jitter", sortable: false },
      { text: "LOSS", value: "loss", sortable: false },
      { text: "PROVINCE", value: "province.name", sortable: false },
      { text: "CITY", value: "city.name", sortable: false },
      { text: "DISTRICT", value: "district.name", sortable: false },
      { text: "SUB DISTRICT", value: "sub_district.name", sortable: false },

      { text: "Timestamp", value: "test_at", sortable: false },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    headers_rating: [
      { text: "USERNAME", value: "user_information.user", sortable: false },
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
    headers_web: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      { text: "Connection Type", value: "connection_type", sortable: false },
      {
        text: "Throughput",
        value: "throughput",
        sortable: false,
      },
      { text: "DL", value: "download_speed", sortable: false },
      { text: "UL", value: "upload_speed", sortable: false },
      { text: "LATENCY", value: "latency", sortable: false },
      { text: "JITTER", value: "jitter", sortable: false },
      { text: "LOSS", value: "loss", sortable: false },
      { text: "PROVINCE", value: "province.name", sortable: false },
      { text: "CITY", value: "city.name", sortable: false },
      { text: "DISTRICT", value: "district.name", sortable: false },
      { text: "SUB DISTRICT", value: "sub_district.name", sortable: false },

      { text: "Timestamp", value: "test_at", sortable: false },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    headers_alarm: [
      { text: "ISP", value: "cell_operator.name", sortable: false },
      { text: "USERNAME", value: "username", sortable: false },
      { text: "EMAIL", value: "user_information.email", sortable: false },
      { text: "IMEI", value: "imei", sortable: false },
      {
        text: "ADDRESS",
        value: "user_information.full_address.address",
        sortable: false,
      },
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
    ],
    expanded: [],
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
  },
};
</script>

<style scoped>
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
