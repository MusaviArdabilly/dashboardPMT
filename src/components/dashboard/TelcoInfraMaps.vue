<template>
  <div>
    <!-- <div style="position: relative; z-index: 99; top: 100px;" class="font-weight-bold">Hello world</div> -->
    <MapFilters id="overlayFilter" />
    <AlarmNotification id="alarmNotification" />
    <MapsLegend id="mapLegends" />
    <InfoDrawer id="infoDrawer" />
    <Maps :height="height" style="position: relative; z-index: 98" />
  </div>
</template>

<script>
import Maps from "./VueLayersMaps.vue";
import MapFilters from "../SummaryDashboard/MapComponents/MapFilters.vue";
import AlarmNotification from "../SummaryDashboard//MapComponents/AlarmNotification.vue";
import MapsLegend from "../SummaryDashboard//MapComponents/MapsLegend.vue";
import InfoDrawer from "../SummaryDashboard//MapComponents/InfoDrawer.vue";
// import NavbarBigScreen from "./NavbarBigScreen.vue";

export default {
  components: {
    Maps,
    MapFilters,
    AlarmNotification,
    MapsLegend,
    InfoDrawer,
  },

  data: () => ({
    height: "700px",
  }),

  computed: {
    componentKey: function () {
      return this.$store.getters.componentKey;
    },
  },
};
</script>

<style scoped>
#overlayMenu {
  position: absolute;
  z-index: 99;
  top: 0px;
  left: 50px;
  width: 93vw;
}

#overlayFilter {
  position: absolute;
  z-index: 99;
  top: 50px;
  left: 70px;
  width: 20vw;
}

#alarmNotification {
  position: absolute;
  z-index: 99;
  top: 50px;
  right: 105px;
  width: 20vw;
}

#mapLegends {
  position: absolute;
  z-index: 99;
  bottom: 50px;
  right: 90px;
  width: 20vw;
}

#infoDrawer {
  position: absolute;
  z-index: 100;
  right: 0px;
  width: 20vw;
}
</style>