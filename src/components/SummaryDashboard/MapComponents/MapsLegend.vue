<template>
  <v-card class="mx-auto" width="300">
    <div class="pa-2">
      <v-list dense>
        <v-list-group>
          <template v-slot:activator>
            <v-list-item-title> Legend</v-list-item-title>
          </template>

          <!-- BTS -->
          <v-list-group sub-group v-model="active_filter_category['BTS']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('BTS')">
                <v-list-item-title>BTS</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-item v-for="data in opsel" :key="data.index">
                <v-img
                  :src="baseURL + `${data.secondary_logo}`"
                  width="30"
                  height="30"
                ></v-img>
                <v-list-item-title v-text="data.name"></v-list-item-title>
              </v-list-item>
            </v-card>
          </v-list-group>

          <!-- Kepadatan Penduduk -->
          <v-list-group
            sub-group
            v-model="active_filter_category['Kepadatan Penduduk']"
          >
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Kepadatan Penduduk')">
                <v-list-item-title>Kepadatan Penduduk</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-item v-for="data in population_density" :key="data.index">
                <v-sheet
                  :color="data.color"
                  elevation="1"
                  height="30"
                  width="30"
                  class="mr-2"
                ></v-sheet>
                <v-list-item-title v-text="data.text"></v-list-item-title>
              </v-list-item>
            </v-card>
          </v-list-group>

          <!-- Coverage -->
          <v-list-group sub-group v-model="active_filter_category['Coverage']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Coverage')">
                <v-list-item-title>Coverage</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-item v-for="data in coverage" :key="data.index">
                <v-sheet
                  v-if="data.text == 'Fiber Optic'"
                  :color="data.color"
                  elevation="1"
                  height="5"
                  width="30"
                  class="mr-2"
                ></v-sheet>
                <v-sheet
                  v-else
                  :color="data.color"
                  elevation="1"
                  height="30"
                  width="30"
                  class="mr-2"
                ></v-sheet>
                <v-list-item-title v-text="data.text"></v-list-item-title>
              </v-list-item>
            </v-card>
          </v-list-group>

          <!-- Fiber -->
          <v-list-group sub-group v-model="active_filter_category['Fiber']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Fiber')">
                <v-list-item-title>Fiber Optic</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-item v-for="data in fiber" :key="data.index">
                <v-sheet
                  :color="data.color"
                  elevation="1"
                  height="5"
                  width="30"
                  class="mr-2"
                ></v-sheet>
                <v-list-item-title v-text="data.text"></v-list-item-title>
              </v-list-item>
            </v-card>
          </v-list-group>

          <!-- Other -->
          <v-list-group sub-group v-model="active_filter_category['Other']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Other')">
                <v-list-item-title>Other</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-item>
                <img
                  class="mr-2"
                  src="../../../assets/image/legend/jalan.svg"
                  width="30"
                />
                <v-list-item-title v-text="'Jalan'"></v-list-item-title>
              </v-list-item>
            </v-card>
          </v-list-group>

          <!-- QOE -->
          <v-list-group sub-group v-model="active_filter_category['QOE']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('QOE')">
                <v-list-item-title>Sigmon</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-item v-for="data in qoe_legend" :key="data.index">
                <v-sheet
                  :color="data.color"
                  elevation="1"
                  height="30"
                  width="30"
                  class="mr-2"
                  shaped
                ></v-sheet>
                <v-list-item-title v-text="data.text"></v-list-item-title>
              </v-list-item>
            </v-card>
          </v-list-group>
        </v-list-group>
      </v-list>
    </div>
  </v-card>
</template>

<script>
import JwtService from "../../../services/jwt.services";

export default {
  name: "map-legend",
  data: () => ({
    baseURL: process.env.VUE_APP_API_URL,

    opsel: [],
    qoe_legend: [
      { color: "rgb(1, 29, 190)", text: "XL"  },
      { color: "rgb(77, 77, 77)", text: "H3I"  },
      { color: "rgb(253, 249, 4)", text: "Indosat"  },
      { color: "rgb(190, 1, 181)", text: "Smartfren"  },
      { color: "rgb(190, 1, 1)", text: "Telkomsel"  },
    ],

    population_density: [
      { color: "#2F82B4", text: "0 - 41" },
      { color: "#ACDDA5", text: "42 - 169" },
      { color: "#FFFEC5", text: "170 - 515" },
      { color: "#FBAF63", text: "516 - 1317" },
      { color: "#D7191B", text: "1318 - 205957" },
    ],
    coverage: [
      { color: "#0000FE", text: "Baik Sekali" },
      { color: "#008001", text: "Baik" },
      { color: "#FFFF00", text: "Cukup" },
      { color: "#FE0000", text: "Kurang" },
    ],
    fiber: [
      { color: "#9EDE73", text: "FO Telkom Indonesia" },
      { color: "#2666CF", text: "SKKL" },
      { color: "#2666CF", text: "FO NON Telkom Indonesia" }
    ],
    other: [],
    active_filter_category: [],

    user: null,
    user_token: null,
  }),
  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();

    this.getOperator();

    console.log("MAP LEGEND", this.opsel);
  },
  methods: {
    toggleFilter() {},
    getOperator() {
      this.loading = true;
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/cell-operator`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.error == false) {
            this.opsel = result.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
</style>