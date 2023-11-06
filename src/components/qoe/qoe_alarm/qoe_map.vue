<template>
  <div>
    <!-- <div style="position: relative; z-index: 99; top: 100px;" class="font-weight-bold">Hello world</div> -->
    <Maps :height="height" style="position: relative; z-index: 98" />
    <InfoDrawer id="infoDrawer" />
    <QoEFilter id="overlayFilter" />
    <QoELegend id="mapLegends" />
  </div>
</template>

<script>
import Maps from "../../dashboard/QoeMaps.vue";
import InfoDrawer from "../../SummaryDashboard/MapComponents/InfoDrawer.vue";
import QoEFilter from "./QoEFilter.vue";
import QoELegend from "./QoELegend.vue";
import { GET_OPSEL } from "../../../store/modules/opsel.module";

// import NavbarBigScreen from "./NavbarBigScreen.vue";

export default {
  components: {
    Maps,
    InfoDrawer,
    QoEFilter,
    QoELegend,
  },

  data: () => ({
    height: "700px",
  }),

  computed: {
    activeLayers: {
      get() {
        let layers = this.$store.getters.getActiveLayers;
        console.log(layers);
        let activeLayers = "";
        for (const i of layers) {
          let index = layers.indexOf(i);
          if (layers.length - 1 == index) {
            activeLayers += `${i}`;
          } else {
            activeLayers += `${i},`;
          }
        }
        return activeLayers;
      },
      set(val) {
        return val;
      },
    },
    componentKey: function () {
      return this.$store.getters.componentKey;
    },

    opsel: function () {
      return this.$store.getters.getOpsel;
    },
  },

  mounted() {},

  created() {
    this.getOperatorCellular();
    // this.getDevice();
  },

  methods: {
    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
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
  right: 50px;
  width: 20vw;
}

#infoDrawer {
  position: absolute;
  z-index: 100;
  right: 0px;
  width: 20vw;
}
</style>
