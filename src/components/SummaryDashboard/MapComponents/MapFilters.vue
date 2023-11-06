<template>
  <div class="map-filters">
    <v-card class="mx-auto" width="600" rounded>
      <v-list dense>
        <v-list-group>
          <template v-slot:activator>
            <v-list-item-title> Map Filter </v-list-item-title>
          </template>
          <v-row class="pa-2">
            <v-col lg="12">
              <v-card width="600" flat>
                <div class="d-flex align-center py-1 pl-2 pr-1">
                  <small class="font-weight-bold">Alarm Opsel</small>
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
            </v-col>
          </v-row>
          <v-list-group sub-group v-model="active_filter_category['BTS']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('BTS')">
                <v-list-item-title>BTS</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-group
                sub-group
                v-for="tech in technology"
                :key="`bts+${tech}`"
                style="padding-left: 2em"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ tech }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-card flat style="max-height: 500px" class="overflow-y-auto">
                  <v-list-item>
                    <v-list-item-title>All</v-list-item-title>
                    <v-switch
                      v-model="active_all_button[tech]"
                      hide-details
                      dense
                      inset
                      @change="addOrRemoveLayer('', tech)"
                    ></v-switch>
                  </v-list-item>
                  <template v-for="data in bts">
                    <v-list-item
                      v-if="checkTechnology(data.title, tech)"
                      :key="data.index"
                    >
                      <v-list-item-title
                        v-text="data.title"
                      ></v-list-item-title>
                      <v-switch
                        hide-details
                        dense
                        inset
                        @change="addOrRemoveLayer(data.alternate)"
                        v-model="active_layers"
                        :value="data.alternate"
                      ></v-switch>
                    </v-list-item>
                  </template>
                </v-card>
              </v-list-group>
            </v-card>
          </v-list-group>

          <v-list-group sub-group v-model="active_filter_category['Coverage']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Coverage')">
                <v-list-item-title>Coverage</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 500px" class="overflow-y-auto">
              <v-list-group
                sub-group
                v-for="type in coverage_type"
                :key="`coverage+${type}`"
                style="padding-left: 2em"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-if="type == 'ALL'"
                      >Wilayah</v-list-item-title
                    >
                    <v-list-item-title v-else>Pemukiman</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-card flat style="max-height: 500px" class="overflow-y-auto">
                  <v-list-group
                    sub-group
                    v-for="tech in technology"
                    :key="`coverage+${tech}`"
                    style="padding-left: 2em"
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>{{ tech }}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-card
                      flat
                      style="max-height: 500px"
                      class="overflow-y-auto"
                    >
                      <template v-for="data in coverage">
                        <v-list-item
                          v-if="
                            checkTechnologyCoverage(
                              data.title,
                              tech,
                              data.category__gn_description,
                              type
                            )
                          "
                          :key="data.index"
                        >
                          <v-list-item-title
                            v-text="data.title"
                          ></v-list-item-title>
                          <v-switch
                            hide-details
                            dense
                            inset
                            @change="addOrRemoveLayer(data.alternate)"
                          ></v-switch>
                        </v-list-item>
                      </template>
                    </v-card>
                  </v-list-group>
                </v-card>
              </v-list-group>
              <!-- 
              <v-list-group
                sub-group
                v-for="tech in technology"
                :key="`bts+${tech}`"
                style="padding-left: 2em"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ tech }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-card flat style="max-height: 500px" class="overflow-y-auto">
                  <template v-for="data in coverage">
                    <v-list-item
                      v-if="checkTechnology(data.title, tech)"
                      :key="data.index"
                    >
                      <v-list-item-title
                        v-text="data.title"
                      ></v-list-item-title>
                      <v-switch
                        hide-details
                        dense
                        inset
                        @change="addOrRemoveLayer(data.alternate)"
                      ></v-switch>
                    </v-list-item>
                  </template>
                </v-card>
              </v-list-group> -->
            </v-card>
          </v-list-group>

          <v-list-group sub-group v-model="active_filter_category['FO']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('FO')">
                <v-list-item-title>Fixed Broadband</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 300px" class="overflow-y-auto">
              <v-list-item v-for="data in fo" :key="data.index">
                <v-list-item-title v-text="data.title"></v-list-item-title>
                <v-switch
                  hide-details
                  dense
                  inset
                  @change="addOrRemoveLayer(data.alternate)"
                ></v-switch>
              </v-list-item>
            </v-card>
          </v-list-group>

          <v-list-group sub-group v-model="active_filter_category['Resident']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Resident')">
                <v-list-item-title>Penduduk</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 300px" class="overflow-y-auto">
              <v-list-item v-for="data in resident" :key="data.index">
                <v-list-item-title v-text="data.title"></v-list-item-title>
                <v-switch
                  hide-details
                  dense
                  inset
                  @change="addOrRemoveLayer(data.alternate)"
                ></v-switch>
              </v-list-item>
            </v-card>
          </v-list-group>

          <v-list-group sub-group v-model="active_filter_category['Others']">
            <template v-slot:activator>
              <v-list-item-content @click="toggleFilter('Others')">
                <v-list-item-title>Lainnya</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-card flat style="max-height: 300px" class="overflow-y-auto">
              <v-list-item v-for="data in others" :key="data.index">
                <v-list-item-title v-text="data.title"></v-list-item-title>
                <v-switch
                  hide-details
                  dense
                  inset
                  @change="addOrRemoveLayer(data.alternate)"
                ></v-switch>
              </v-list-item>
            </v-card>
          </v-list-group>

          <template v-for="layer in map_layers">
            <v-list-group
              v-if="
                layer.map_layer_category != 'BTS' &&
                layer.map_layer_category != 'Coverage'
              "
              sub-group
              :key="layer.map_layer_category"
              v-model="active_filter_category[layer.map_layer_category]"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content
                  @click="toggleFilter(layer.map_layer_category)"
                >
                  <v-list-item-title>{{
                    layer.map_layer_category
                  }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-card flat style="max-height: 300px" class="overflow-y-auto">
                <v-list-item v-for="(l, i) in layer.data" :key="i">
                  <v-list-item-title
                    v-if="l.cell_operator_id == 0"
                    v-text="l.name"
                  ></v-list-item-title>
                  <v-list-item-title
                    v-else
                    v-text="`${l.cell_operator.name} - ${l.technology}`"
                  ></v-list-item-title>

                  <v-switch
                    hide-details
                    dense
                    inset
                    @change="addOrRemoveLayer(l.value)"
                    v-model="active_layers[l.value]"
                  ></v-switch>
                </v-list-item>
              </v-card>
            </v-list-group>
          </template>
        </v-list-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import JwtService from "../../../services/jwt.services";
import {
  SET_ACTIVE_LAYER,
  SET_MAP_FILTER,
  SET_INFO_DRAWER,
  SET_TOGGLED_LAYER,
  SET_SELECTED_CATEGORY,
  SHOW_ALARM,
} from "../../../store/modules/maps.module";
import { SET_DARK_MODE } from "../../../store/modules/maps.module";

export default {
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    user: null,
    user_token: null,
    map_layers: [],
    active_layers: [],
    active_filter_category: [],
    switch_alarm: false,
    technology: ["2G", "3G", "4G"],
    coverage_type: ["ALL", "Pemukiman"],
    active_all_button: [],
  }),
  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.getMapLayer();
  },
  computed: {
    showAlarm: {
      get() {
        return this.$store.getters.showAlarm;
      },
      set(val) {
        return val;
      },
    },
    mode: function () {
      return this.$store.getters.getMode;
    },

    mapMode: {
      get() {
        return this.$store.getters.getDarkMode;
      },
      set(val) {
        this.$store.commit(SET_DARK_MODE, val);
      },
    },

    borderline: function () {
      return this.$store.getters.getBorderline;
    },

    bts: function () {
      return this.$store.getters.getBts;
    },

    coverage: function () {
      return this.$store.getters.getCoverage;
    },

    fo: function () {
      return this.$store.getters.getFixedBroadband;
    },

    others: function () {
      return this.$store.getters.getOthers;
    },

    resident: function () {
      return this.$store.getters.getResident;
    },

    bts_layer: function () {
      let ar = [];
      // 2G
      ar["2G"] = this.bts.filter((bts) => bts.title.includes("2G"));
      // 3G
      ar["3G"] = this.bts.filter((bts) => bts.title.includes("3G"));
      // 4G
      ar["4G"] = this.bts.filter((bts) => bts.title.includes("4G"));

      return ar;
    },

    selected_category: function () {
      return this.$store.getters.getCategory;
    },
  },

  watch: {
    mapMode() {},
    coverage() {},
    bts() {},
    bts_layer() {},
  },

  methods: {
    getMapLayer() {
      fetch("https://infragis.kominfo.go.id/webapi/geonode/layers")
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.$store.commit(SET_MAP_FILTER, result.objects);
        })
        .catch((err) => {
          console.log(err);
        });
      // fetch(
      //   process.env.VUE_APP_API_URL +
      //     `api/v1/${this.user.language}/map-layer/category`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${this.user.token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((result) => {
      //     if (result.error == true) {
      //       console.log(result.message);
      //     } else {
      //       this.map_layers = result.data;
      //       this.$store.commit(SET_MAP_FILTER, result.data);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },

    async addOrRemoveLayer(layer, tech) {
      if (layer == "") {
        let obj = this.bts_layer[tech];
        for (const o of obj) {
          layer = o.alternate;
          if (this.active_layers.includes(layer)) {
            if (this.active_all_button[tech]) continue;
            let index = this.active_layers.indexOf(layer);
            if (index > -1) {
              this.active_layers.splice(index, 1);
            }
          } else {
            if (!this.active_all_button[tech]) continue;
            this.active_layers.push(layer);
          }
          await this.addOrRemoveLayer(layer);
        }
        return;
      }

      if (this.selected_category != "BTS") {
        // // Check if layer already exist
        if (this.active_layers.includes(layer)) {
          let index = this.active_layers.indexOf(layer);
          if (index > -1) {
            this.active_layers.splice(index, 1);
          }
        } else {
          // Push if layer not exist
          this.active_layers.push(layer);
        }
      }

      // Set toggled layer
      this.$store.commit(SET_TOGGLED_LAYER, layer);

      // // Check if layer already exist
      // if (this.active_layers.includes(layer)) {
      //   let index = this.active_layers.indexOf(layer);
      //   if (index > -1) {
      //     this.active_layers.splice(index, 1);
      //   }
      // } else {
      //   // Push if layer not exist
      //   this.active_layers.push(layer);
      // }
      // HIDE LAYER WHILE ADD MORE MAP FILTER
      this.$store.commit(SET_INFO_DRAWER, false);
      // STORE MAP FILTER
      this.$store.commit(SET_ACTIVE_LAYER, this.active_layers);
    },

    showAlarmPin() {
      this.$store.commit(SHOW_ALARM, !this.showAlarm);
    },

    resetFilter() {
      this.active_layers = [];

      this.$store.commit(SET_ACTIVE_LAYER, this.active_layers);
    },

    toggleFilter(item) {
      this.$store.commit(SET_SELECTED_CATEGORY, item);

      for (
        let i = 0;
        i < Object.keys(this.active_filter_category).length;
        i++
      ) {
        if (item != Object.keys(this.active_filter_category)[i]) {
          this.active_filter_category[
            Object.keys(this.active_filter_category)[i]
          ] = false;
        } else {
          Object.keys(this.active_filter_category)[i] = true;
        }
      }
    },

    checkTechnology(name, tech) {
      return name.includes(tech);
    },

    checkTechnologyCoverage(name, tech, category, type) {
      return name.includes(tech) && category.includes(type);
    },

    arrayLayer(obj) {
      for (const o of obj) {
        this.active_layers.push(o.alternate);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 10px !important;
}
.v-input--selection-controls {
  margin-top: 0px;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
