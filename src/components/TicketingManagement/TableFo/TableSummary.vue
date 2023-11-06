<template>
  <v-card elevation="0" outlined>
    <v-data-table
      :headers="headers"
      :items="itemTable"
      class="pl-3 pr-3 pmt-table"
      hide-default-footer
      :options="pagination"
      :items-per-page="pagination.rowsPerPage"
    >
      <template v-slot:top>
        <v-overlay :absolute="true" :value="loadingTable">
          <v-progress-circular
            class="loader"
            :size="50"
            color="primary"
            indeterminate
          >
          </v-progress-circular>
        </v-overlay>
      </template>
      <template v-slot:[`item.operator_id`]="{ item }">
        <div class="pmt-flex is-row wrap">
          <div is="v-col" cols="2">
            <div
              is="v-avatar"
              :color="avatarBackground(item.name)"
              v-if="item.logo == ''"
              size="40"
            >
              <span class="white--text">{{ stringInitial(item.name) }}</span>
            </div>
            <div is="v-avatar" v-else size="40">
              <img
                :src="item.logo_url + item.logo"
                :alt="item.name + '-logo'"
              />
            </div>
          </div>
          <span class="pt-5 font-weight-bold">{{ item.name }}</span>
        </div>
      </template>
      <template v-slot:no-data>
        <div class="pa-5">
          <img
            height="300px"
            src="../../../assets/image/empty.svg"
            alt="no data"
          />
          <div>No Data</div>
          <v-btn @click="resetData">Reset </v-btn>
        </div>
      </template>
      <template v-slot:footer>
        <v-container class="max-width">
          <v-row justify="end" align="center">
            <v-col cols="2">
              <v-select
                :items="pagination.rowsPerPageItems"
                class="item-per-page"
                v-model="pagination.rowsPerPage"
                @input="setTableLimit"
              ></v-select>
            </v-col>
          </v-row>
          <div class="pmt-flex wrap at-center">
            <v-pagination
              v-model="pagination.page"
              class="my-4"
              :total-visible="7"
              :length="paginationType.totalItems"
              @input="setTable"
            ></v-pagination>
          </div>
        </v-container>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  props: [
    "pagination",
    "itemTable",
    "headers",
    "loadingTable",
    "paginationType",
    "setTable",
    "setTableLimit",
  ],
  data() {
    return {};
  },
};
</script>
