<template>
  <div class="table-content">
    <div class="title">
      <h4>{{ $t("general.menu.province") }}</h4>
    </div>
    <v-card class="pa-5">
      <v-row justify="end">
        <v-col cols="4" xl="6">
          <v-text-field
            dense
            v-model="search"
            @input="getDataProvince()"
            outlined
            :placeholder="$t('ui.table_piece.search')"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data"
        item-key="id"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
        hide-default-footer
        class="elevation-0"
      >
        <template v-slot:[`item.island.island`]="{ item }">
          <div class="text-capitalize">{{ item.island.island }}</div>
        </template>
        <template v-slot:[`item.island.province_id`]="{ item }">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn @click="editData(item)" icon small class="mr-2" v-on="on">
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn color="primary" @click="resetData"> Reset </v-btn>
          </div>
        </template>
      </v-data-table>

      <v-container class="max-width">
        <v-row justify="end" align="center">
          <v-col cols="2">
            <v-select
              :items="pagination.rowsPerPageItems"
              class="item-per-page"
              v-model="pagination.rowsPerPage"
              @change="setRows"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="initialize"
        ></v-pagination>
      </v-container>
      <v-overlay :z-index="999" :value="loading_overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="isEditDialog" max-width="500px">
      <v-card>
        <div class="pa-5 font-weight-bold d-flex">
          Edit Province
          <v-spacer></v-spacer>
          <v-icon @click="isEditDialog = false">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
        <div class="pa-5">
          <label>Ibu Kota</label>
          <v-text-field
            v-model="formUpdate.capital"
            outlined
            dense
          ></v-text-field>
          <label>Alternative Name</label>
          <v-text-field
            v-model="formUpdate.alternative_name"
            outlined
            dense
          ></v-text-field>
          <label>Average Population</label>
          <v-text-field
            v-model="formUpdate.average_population"
            outlined
            dense
          ></v-text-field>
          <v-btn @click="submitUpdateData()" color="primary" width="100%"
            >Update Data</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlayLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script src="./Province.js"></script>
