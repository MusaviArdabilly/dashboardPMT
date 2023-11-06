<template>
  <div class="table-content">
    <div class="title">
      <h4>{{ $t("general.menu.city") }}</h4>
    </div>
    <v-card class="pa-5">
      <div class="pmt-flex wrap is-row at-between">
        <v-col cols="4">
          <v-autocomplete
            @input="changeProvince"
            v-model="selected_province"
            :loading="loadingSearch"
            :items="item_province"
            :search-input.sync="searchCity"
            item-text="name"
            item-value="id"
            class="mx-4"
            flat
            hide-no-data
            hide-details
            dense
            :label="$t('ui.field.province')"
            outlined
          ></v-autocomplete>
          <!-- <v-select
            @input="selectCity"
            v-model="selected_province"
            :items="province"
            item-text="name"
            item-value="id"
            outlined
            dense
            placeholder="Province"
          ></v-select> -->
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4" xl="5">
          <v-text-field
            dense
            @input="initialize"
            v-model="search"
            outlined
            :placeholder="$t('ui.table_piece.search')"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </div>
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
        <template v-slot:item.actions="{ item }">
          <v-btn
            outlined
            elevation="0"
            class="mr-5 text-capitalize grey--text"
            color="white"
            @click="viewDetail(item)"
            >View</v-btn
          >
          <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
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
  </div>
</template>

<script src="./City.js"></script>
