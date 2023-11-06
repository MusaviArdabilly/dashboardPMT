<template>
  <div class="table-content">
    <v-overlay :value="loadingData">
      <v-progress-circular
        class="loader"
        :size="50"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
    </v-overlay>
    <div class="title">
      <h4>{{ $t("general.menu.sub_district_potential_category") }}</h4>
    </div>
    <v-card>
      <v-overlay :absolute="true" :value="loadingTable">
        <v-progress-circular
          class="loader"
          :size="50"
          color="primary"
          indeterminate
        >
        </v-progress-circular>
      </v-overlay>
      <v-data-table
        :headers="headers"
        :items="dataItems"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
        hide-default-footer
      >
        <!-- <v-data-table :headers="headers" :items="dataItems" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
          :search="search" :options="pagination" :items-per-page="pagination.rowsPerPage" hide-default-footer> -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-row class="mt-4">
              <v-col lg="2">
                <v-btn
                  @click="categoryDialog = true"
                  class="text-none white--text"
                  color="#134889"
                >
                  {{ $t("ui.button_create") }}
                </v-btn>
              </v-col>
              <v-col lg="8">
                <v-text-field
                  class="ml-5"
                  outlined
                  prepend-inner-icon="mdi-magnify"
                  :placeholder="$t('ui.table_piece.search')"
                  dense
                  v-model="search"
                  clearable
                  @input="setTableLimit()"
                  @click:clear="setTableLimit()"
                ></v-text-field>
              </v-col>
              <v-col lg="2">
                <v-menu
                  bottom
                  origin="center center"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="blue darken-2"
                      class="white--text"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t("ui.table_piece.sort") }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="handleSort('asc')">
                      <v-list-item-title>
                        {{ $t("ui.table_piece.asc") }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleSort('desc')">
                      <v-list-item-title>
                        {{ $t("ui.table_piece.desc") }}</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-toolbar>
          <!-- Create and update dialog -->
          <v-dialog
            v-model="categoryDialog"
            max-width="700"
            transition="dialog-top-transition"
            open-delay="300"
            persistent
          >
            <v-overlay :absolute="true" :value="loadingCircle">
              <v-progress-circular
                class="loader"
                :size="50"
                color="primary"
                indeterminate
              >
              </v-progress-circular>
            </v-overlay>
            <v-card>
              <div class="pa-5 d-flex">
                <span class="font-weight-bold" ref="dialogtitle"
                  >Create Category</span
                >
                <v-spacer></v-spacer>
                <v-icon @click="categoryDialog = false">mdi-close</v-icon>
              </div>
              <v-divider></v-divider>
              <v-form @submit.prevent>
                <v-card-text>
                  <!-- <v-text-field type="hidden" v-model="category['id']" :value="category.id" v-if="editId != ''"></v-text-field> -->
                  <v-text-field
                    ref="inputName"
                    :rules="[rules.required]"
                    label="Name"
                    v-model="category['name']"
                    :value="category.name"
                    @change="setTable"
                  ></v-text-field>
                  <v-textarea
                    label="Description"
                    v-model="category['description']"
                    :value="category.description"
                  >
                  </v-textarea>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="categoryDialog = false"
                    >Close</v-btn
                  >
                  <v-btn
                    elevation="0"
                    class="text-capitalize white--text"
                    v-if="fetchId == ''"
                    color="#134889"
                    type="submit"
                    @click="saveCategory"
                    >Save</v-btn
                  >
                  <v-btn
                    elevation="0"
                    class="text-capitalize white--text"
                    color="#08c35e"
                    type="submit"
                    @click="saveExitCategory"
                    >Save & Exit</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- Create and update dialog -->
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          <td>{{ item.created_at | moment }}</td>
        </template>
        <template v-slot:[`item.updated_at`]="{ item }">
          <td>{{ item.updated_at | moment }}</td>
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <v-row justify="start">
            <v-col cols="2">
              <v-icon @click="editDialog(item.id)"
                >mdi-square-edit-outline</v-icon
              >
            </v-col>
            <v-col cols=" 2" class="ml-2">
              <v-icon @click="deleteDialog(item.id)">mdi-delete-outline</v-icon>
            </v-col>
          </v-row>
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
              @change="setTableLimit"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="paginationType.totalItems"
          @input="setTable"
        >
        </v-pagination>
      </v-container>
    </v-card>
  </div>
</template>

<script src="./PotensiDesaCategory.js"></script>
