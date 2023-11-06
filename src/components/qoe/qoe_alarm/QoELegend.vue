<template>
  <v-card width="200">
    <v-list>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title> Legend</v-list-item-title>
          </v-list-item-content>
        </template>
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
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    coverage: [
      { color: "#0000FE", text: "Baik Sekali" },
      { color: "#008001", text: "Baik" },
      { color: "#FFFF00", text: "Cukup" },
      { color: "#FE0000", text: "Kurang" },
    ],
  }),
};
</script>

<style>
</style>