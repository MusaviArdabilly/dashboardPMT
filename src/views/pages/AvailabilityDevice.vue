<template>
  <div class="availability-device">
    <!-- <NavBar /> -->
    <div class="d-flex mt-5">
      <div class="font-weight-bold mt-5">Availability Device</div>
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
    <AvailabilityDeviceTable class="mt-10" />
  </div>
</template>

<script>
// import NavBar from "../../components/dashboard/NavBar.vue";
import AvailabilityDeviceTable from "../../components/qoe/qoe_alarm/AvailabilityDeviceTable.vue";

export default {
  components: {   AvailabilityDeviceTable },
  data: () => ({
    user_token: null,
    data: [],
  }),

  created() {
   

    this.user_token = JwtService.getToken();
    this.getAvailability()
  },

  methods: {
   
  },
};
</script>

<style>
</style>