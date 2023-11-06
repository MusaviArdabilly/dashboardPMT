<template>
  <div>
    <!-- <div style="position: relative; z-index: 99; top: 100px;" class="font-weight-bold">Hello world</div> -->
    <NavbarBigScreen id="overlayMenu" />
    <!-- <AlarmNotification id="alarmNotification" /> -->
    <MapFilters id="overlayFilter" />
    <MapsLegend id="mapLegends" />
    <InfoDrawer id="infoDrawer" />
    <!-- <MapsSearch id="maps-search" /> -->
    <Maps :height="height" style="position: relative; z-index: 98" />
  </div>
</template>

<script>
import Maps from "../dashboard/VueLayersMaps.vue";
import MapFilters from "./MapComponents/MapFilters.vue";
// import AlarmNotification from "./MapComponents/AlarmNotification.vue";
import MapsLegend from "./MapComponents/MapsLegend.vue";
// import MapsSearch from "./MapComponents/MapsSearch.vue";
import InfoDrawer from "./MapComponents/InfoDrawer.vue";
import NavbarBigScreen from "./NavbarBigScreen.vue";

export default {
  components: {
    Maps,
    NavbarBigScreen,
    MapFilters,
    MapsLegend,
    InfoDrawer,
  },

  data: () => ({
    height: "100vh",
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
  left: 4%;
  width: 92%;
}

#overlayFilter {
  position: absolute;
  z-index: 99;
  top: 120px;
  left: 5%;
  width: 30vw;
}

#alarmNotification {
  position: absolute;
  z-index: 99;
  top: 120px;
  right: 5%;
  width: 20vw;
}

#mapLegends {
  position: absolute;
  z-index: 99;
  bottom: 50px;
  right: 5%;
  width: 20vw;
}

#infoDrawer {
  position: absolute;
  z-index: 100;
  right: 0px;
  width: 20vw;
}

#maps-search {
  position: absolute;
  z-index: 99;
  top: 115px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>