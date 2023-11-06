<template>
  <div class="map-filters">
    <v-card
      class="mx-auto maps-search-card"
      width="400"
      rounded
      color="transparent"
    >
      <div class="pa-2">
        <v-autocomplete
          v-model="model"
          :items="entries"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          clearable
          outlined
          dense
          solo
          hide-no-data
          hide-selected
          label="Search Region"
          placeholder="Start typing to Search"
          return-object
          class="maps-search"
        >
          <template v-slot:item="{ item }">
            {{item}}
          </template>

          <template v-slot:append>
            <v-slide-x-reverse-transition mode="out-in">
              <v-icon
                color="info"
                @click="searchMaps"
                v-text="'mdi-map-search-outline'"
              ></v-icon>
            </v-slide-x-reverse-transition> </template
        ></v-autocomplete>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "maps-search",
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  methods: {
    searchMaps() {
      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${this.search}&format=geojson&countrycodes=id&limit=5`
      )
        .then((res) => res.json())
        .then((res) => {
          const { features } = res;
          this.entries = features;
          console.log("features", this.entries);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },

  // watch: {
  //   search(val) {
  //     console.log(val);
  //     // Items have already been loaded
  //     if (this.items.length > 0) return;

  //     // Items have already been requested
  //     if (this.isLoading) return;

  //     this.isLoading = true;

  //     // Lazily load input items
  //     fetch(
  //       `https://nominatim.openstreetmap.org/search?q=${val}&format=geojson&countrycodes=id&limit=5`
  //     )
  //       .then((res) => res.json())
  //       .then((res) => {
  //         // const { features } = res;
  //         // console.log("features", features);
  //         this.entries = res.features;
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //       .finally(() => (this.isLoading = false));
  //   },
  // },
};
</script>

<style>
/* .maps-search .v-input__control .v-text-field__details {
  display: none !important;
} */

/* .maps-search-card {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none !important;
} */
</style>