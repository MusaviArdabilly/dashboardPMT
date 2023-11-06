<template>
  <div class="dashboard">
    <!-- <NavBar /> -->
    <div class="font-weight-bold mt-5 mb-5">
      Map Dashboard Telecommunication Infrastructur
    </div>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="selected_tower"
          :items="tower_data"
          @input="changeView(selected_tower)"
          item-text="tower_data"
          item-value="tower_data"
          solo
          rounded
          dense
          placeholder="Coverage"
        ></v-select>
      </v-col>
      <v-col cols="3" class="d-flex">
        <v-select
          solo
          class="mr-5"
          rounded
          dense
          placeholder="Wilayah"
        ></v-select>
        <v-select solo rounded dense placeholder="2G"></v-select>
      </v-col>
      <v-col cols="4">
        <v-btn
          elevation="0"
          rounded
          class="text-capitalize control-btn mr-5"
          outlined
          >Download <v-icon>mdi-file-download-outline</v-icon>
        </v-btn>
        <v-btn
          elevation="0"
          rounded
          class="text-capitalize control-btn"
          outlined
          @click="showModal"
          >Filter <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <!-- <v-col cols="2">
        <v-card class="pt-2 pl-3 pr-3 d-flex">
          <div style="color: #5e5873">Display to Dahsboard</div>
          <v-spacer></v-spacer>
          <v-switch inset dense color="#28C76F"></v-switch>
        </v-card>
      </v-col> -->
      <v-col lg="12">
        <v-card elevation="5" class="pa-5 map-card">
          <VueLayersMaps :height="height" :id="id" />
        </v-card>
      </v-col>
    </v-row>
    <component
      :is="selected_modal"
      :coverage="coverage"
      :coverage_bts="coverage_bts"
      :bts="bts"
      :transmission="transmission"
      v-on:closeCoverage="closeCoverage"
      v-on:closeCoverageBts="closeCoverageBts"
      v-on:closeBts="closeBts"
      v-on:closeTransmission="closeTransmission"
    />
  </div>
</template>

<script>
// import NavBar from "../../components/dashboard/NavBar.vue";
import VueLayersMaps from "../../../components/dashboard/VueLayersMaps";
import ColumnChart from "../../../components/dashboard/ColumnChart.vue";
import CoverageModal from "../../../components/dashboard/modal/CoverageModal";
import CoverageBtsModal from "../../../components/dashboard/modal/CoverageBtsModal";
import BtsModal from "../../../components/dashboard/modal/BtsModal";
import TransmissionModal from "../../../components/dashboard/modal/TransmissionModal";

export default {
  components: { VueLayersMaps, ColumnChart, CoverageModal },
  data: () => ({
    height: "500px",
    id: "mapRounded",
    tower_data: ["Coverage", "Coverage & BTS", "BTS", "Transmission"],
    selected_tower: "Coverage",
    show_transmission: false,
    skeleton_loading: true,
    selected_modal: "",
    coverage: false,
    coverage_bts: false,
    bts: false,
    transmission: false,
    items: [
      {
        name: "2G",
        alarm: 2,
        color: "#27557E",
      },
      {
        name: "3G",
        alarm: 12,
        color: "#3C7FBE",
      },
      {
        name: "4G",
        alarm: 36,
        color: "#74B8F6",
      },
      {
        name: "5G",
        alarm: 4,
        color: "#8ED6FF",
      },
      {
        name: "FO",
        alarm: 8,
        color: "#000000",
      },
    ],
    alarm_category: [
      {
        name: "Hardware RF",
        value: [
          {
            number: "10%",
            index: 5,
            color: "#27557e",
          },
          {
            number: "30%",
            index: 4,
            color: "#3c7fbe",
          },
          {
            number: "70%",
            index: 3,
            color: "#74b8f6",
          },
          {
            number: "80%",
            index: 2,
            color: "#8ed6ff",
          },
          {
            number: "100%",
            index: 1,
            color: "#000000",
          },
        ],
      },
      {
        name: "Hardware VSWR/RTWP",
        value: [
          {
            number: "20%",
            index: 5,
            color: "#27557e",
          },
          {
            number: "40%",
            index: 4,
            color: "#3c7fbe",
          },
          {
            number: "70%",
            index: 3,
            color: "#74b8f6",
          },
          {
            number: "90%",
            index: 2,
            color: "#8ed6ff",
          },
          {
            number: "100%",
            index: 1,
            color: "#000000",
          },
        ],
      },
      {
        name: "Cell Down / Blocked",
        value: [
          {
            number: "5%",
            index: 5,
            color: "#27557e",
          },
          {
            number: "50%",
            index: 4,
            color: "#3c7fbe",
          },
          {
            number: "60%",
            index: 3,
            color: "#74b8f6",
          },
          {
            number: "90%",
            index: 2,
            color: "#8ed6ff",
          },
          {
            number: "100%",
            index: 1,
            color: "#000000",
          },
        ],
      },
      {
        name: "Transmission",
        value: [
          {
            number: "30%",
            index: 5,
            color: "#27557e",
          },
          {
            number: "40%",
            index: 4,
            color: "#3c7fbe",
          },
          {
            number: "45%",
            index: 3,
            color: "#74b8f6",
          },
          {
            number: "95%",
            index: 2,
            color: "#8ed6ff",
          },
          {
            number: "100%",
            index: 1,
            color: "#000000",
          },
        ],
      },
      {
        name: "Clock",
        value: [
          {
            number: "30%",
            index: 5,
            color: "#27557e",
          },
          {
            number: "50%",
            index: 4,
            color: "#3c7fbe",
          },
          {
            number: "60%",
            index: 3,
            color: "#74b8f6",
          },
          {
            number: "70%",
            index: 2,
            color: "#8ed6ff",
          },
          {
            number: "100%",
            index: 1,
            color: "#000000",
          },
        ],
      },
      {
        name: "License / Configuration",
        value: [
          {
            number: "20%",
            index: 5,
            color: "#27557e",
          },
          {
            number: "70%",
            index: 4,
            color: "#3c7fbe",
          },
          {
            number: "90%",
            index: 3,
            color: "#74b8f6",
          },
          {
            number: "100%",
            index: 2,
            color: "#8ed6ff",
          },
          {
            number: "0%",
            index: 1,
            color: "#000000",
          },
        ],
      },
    ],
  }),
  methods: {
    changeView(value) {
      console.log(value);
      if (value == "Transmission") {
        this.show_transmission = true;
        setTimeout(() => {
          this.skeleton_loading = false;
        }, 3000);
      } else {
        this.show_transmission = false;
      }
    },

    showModal() {
      switch (this.selected_tower) {
        case "Coverage":
          {
            this.selected_modal = CoverageModal;
            this.coverage = true;
          }
          break;
        case "Coverage & BTS":
          {
            this.selected_modal = CoverageBtsModal;
            this.coverage_bts = true;
          }
          break;
        case "BTS":
          {
            this.selected_modal = BtsModal;
            this.bts = true;
          }
          break;
        case "Transmission":
          {
            this.selected_modal = TransmissionModal;
            this.transmission = true;
          }
          break;
      }
    },

    closeCoverage(value) {
      this.coverage = value;
    },
    closeCoverageBts(value) {
      this.coverage_bts = value;
    },
    closeBts(value) {
      this.bts = value;
    },
    closeTransmission(value) {
      this.transmission = value;
    },
  },
};
</script>

<style scped>
.map-card {
  border-radius: 20px;
}

.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.v-sheet.v-card {
  border-radius: 10px;
}

.control-btn {
  color: #5e5873 !important;
}

.alarm-item {
  margin-top: 13.7px;
  margin-bottom: 13.7px;
}

.miniBarProgress {
  background-color: #8a898a;
  height: 100%;
  position: absolute;
  top: 0rem;
  border-radius: 20px;
  left: 0rem;
}

.miniBar {
  height: 20px;
  border: 1px solid #ffffff;
  border-radius: 20px;
  position: relative;
  width: -webkit-calc(100% - 2rem);
  width: -moz-calc(100% - 2rem);
  width: calc(100% - 2rem);
  margin-right: 0.5rem;
}

.v-progress-circular__underlay {
  stroke: #ebf57f !important;
}

.kecamatan .v-progress-circular__underlay {
  stroke: #a7dc65 !important;
}

.kabupaten .v-progress-circular__underlay {
  stroke: #65dc9a !important;
}

.province .v-progress-circular__underlay {
  stroke: #28c76f !important;
}

.v-progress-circular__info {
  color: black;
}
</style>