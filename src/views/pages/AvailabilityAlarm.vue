<template>
  <div class="availability-device">
    <!-- <NavBar /> -->
    <div class="d-flex mt-5">
      <div class="font-weight-bold mt-5">Availability Alarm</div>
      <v-spacer></v-spacer>
      <v-card class="refresh-btn pa-2 mt-5 nav-card">
        <div class="d-flex">
          <div class="ml-5 mr-5 mt-2">Last update: 20/04/2021 - 11:53:01</div>
          <v-btn rounded class="mr-1 white--text" color="#3C7FBE">
            <v-icon color="white">mdi-sync</v-icon> Refresh</v-btn
          >
        </div>
      </v-card>
    </div>
    <AvailabilityAlarmTable class="mt-10" />
  </div>
</template>

<script>
// import NavBar from "../../components/dashboard/NavBar.vue";
// import AvailabilityAlarmTable from "../../components/qoe/qoe_alarm/AvailabilityAlarmTable.vue";
import AvailabilityAlarmTable from "../../components/qoe/qoe_alarm/AvailabilityAlarmTableV2.vue";

export default {
  components: {   AvailabilityAlarmTable },
  data: () => ({
    user_token: null,
    data: [],
  }),

  created() {
   

    this.user_token = JwtService.getToken();
    this.getAlarm()
  },

  methods: {
    
  },
};
</script>

<style>
</style>