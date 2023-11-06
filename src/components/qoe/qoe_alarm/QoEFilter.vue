<template>
  <v-card>
    <v-list>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title> Coverage</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-card flat class="overflow-y-auto" max-height="500px">
          <v-list-item v-for="item in coverage" :key="item.index">
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-switch
              hide-details
              dense
              inset
              @change="addOrRemoveLayer(item.alternate)"
            ></v-switch>
          </v-list-item>
        </v-card>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import {
  SET_ACTIVE_LAYER,
  SET_INFO_DRAWER,
  SET_TOGGLED_LAYER,
  SET_SELECTED_CATEGORY,
} from "../../../store/modules/maps.module";

export default {
  data: () => ({
    coverage: [],
    map_layers: [],
    active_layers: [],
    active_filter_category: [],
  }),
  created() {
    this.getMapLayer();
  },
  methods: {
    async getMapLayer() {
      await fetch("https://infragis.kominfo.go.id/webapi/geonode/layers")
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          for (let data of result.objects) {
            if (data.keywords == "coverage") {
              this.coverage.push(data);
            }
          }
          //   this.$store.commit(SET_MAP_FILTER, result.objects);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addOrRemoveLayer(layer) {
      console.log(layer);
      // Set toggled layer
      this.$store.commit(SET_TOGGLED_LAYER, layer);

      // Check if layer already exist
      if (this.active_layers.includes(layer)) {
        let index = this.active_layers.indexOf(layer);
        if (index > -1) {
          this.active_layers.splice(index, 1);
        }
      } else {
        // Push if layer not exist
        this.active_layers.push(layer);
      }

      // HIDE LAYER WHILE ADD MORE MAP FILTER
      this.$store.commit(SET_INFO_DRAWER, false);
      // STORE MAP FILTER
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
  },
};
</script>

<style scoped>
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
