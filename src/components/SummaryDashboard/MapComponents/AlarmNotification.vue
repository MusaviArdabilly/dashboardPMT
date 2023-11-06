<template>
  <v-card class="mx-auto" width="300">
    <div class="d-flex align-center pa-2">
      <small class="font-weight-bold">Alarm Notification</small>
      <v-spacer></v-spacer>
      <v-switch
        hide-details
        dense
        inset
        v-model="showAlarm"
        @click="showAlarmPin"
      ></v-switch>
    </div>
  </v-card>
</template>

<script>
import { SHOW_ALARM } from "../../../store/modules/maps.module";
export default {
  data: () => ({
    switch_alarm: false,
  }),
  computed: {
    showAlarm: {
      get() {
        return this.$store.getters.showAlarm;
      },
      set(val) {
        return val;
      },
    },
  },
  methods: {
    showAlarmPin() {
      this.$store.commit(SHOW_ALARM, !this.showAlarm);
    },
  },
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0px;
}
</style>
