<template>
  <div class="qoe">
    <div ref="qoereport">
      <div class="font-weight-bold mt-5 mb-5" style="font-size: 24px">
        {{ $t("general.menu.qoe_summary") }} -
        {{ $t("general.menu.qoe_availability") }}
      </div>
      <v-row>
        <v-col lg="2">
          <v-btn
            @click="changeQoE(1)"
            class="text-capitalize"
            :color="active_btn == 1 ? `primary` : `white`"
            width="100%"
            >{{ $t("ui.button_device_list") }}</v-btn
          >
        </v-col>
        <v-col lg="2">
          <v-btn
            @click="changeQoE(2)"
            class="text-capitalize"
            :color="active_btn == 2 ? `primary` : `white`"
            width="100%"
            >Alarm</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="12">
          <AvailabilityDevice v-if="active_btn == 1" />
        </v-col>
        <v-col lg="12" v-if="active_btn == 2">
          <AvailabilityAlarm />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import AvailabilityDevice from "../../../../components/qoe/qoe_alarm/AvailabilityDeviceTable.vue";
// import AvailabilityAlarm from "../../components/qoe/qoe_alarm/AvailabilityAlarmTable.vue";
import AvailabilityAlarm from "../../../../components/qoe/qoe_alarm/AvailabilityAlarmTableV2.vue";
import JwtService from "../../../../services/jwt.services";
import {
  GET_START_DATE,
  GET_END_DATE,
} from "../../../../store/modules/qoe.module";

export default {
  components: {
    AvailabilityDevice,
    AvailabilityAlarm,
  },
  data: () => ({
    date_1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    start_date: "",
    end_date: "",
    active_btn: 1,
  }),

  computed: {
    startDate: function () {
      return moment(this.date_1).format("DD-MM-YYYY");
    },
    endDate: function () {
      return moment(this.date_2).format("DD-MM-YYYY");
    },
  },

  created() {
    this.user_token = JwtService.getToken();
  },

  methods: {
    inputDate() {
      this.start_date = this.date_1;
      this.end_date = this.date_2;
      this.$store.dispatch(GET_START_DATE, this.date_1);
      this.$store.dispatch(GET_END_DATE, this.date_2);
    },
    submitFilter() {},

    changeQoE(value) {
      this.active_btn = value;
    },
  },
};
</script>

<style scoped>
.qoe {
  height: 100%;
}

.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}

.v-progress-linear--rounded {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

.v-sheet.v-card {
  border-radius: 10px;
}

.active-card {
  border: 1px solid #169cd6;
  box-shadow: rgba(3, 150, 248, 0.24) 0px 3px 8px !important;
  color: #169cd6 !important;
}

.active-btn {
  background-image: linear-gradient(
    109.6deg,
    rgba(45, 116, 213, 1) 11.2%,
    rgba(121, 137, 212, 1) 91.2%
  );
  color: white !important;
}

.rating-value {
  margin-top: 10px;
}
</style>
