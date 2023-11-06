<template>
  <div>
    <v-row>
      <v-col lg="2">
        <v-skeleton-loader v-bind="attrs" type="avatar"></v-skeleton-loader>
      </v-col>
      <v-col lg="10">
        <v-skeleton-loader v-bind="attrs" type="list-item-three-line, actions"></v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    attrs: {
      elevation: 0,
    },
  }),
};
</script>

<style>
</style>