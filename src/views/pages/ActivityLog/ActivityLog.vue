<template>
  <div class="table-content">
    <div class="title">
      <h4>{{ $t("general.menu.activity_log") }}</h4>
    </div>
    <v-card class="pa-4">
      <v-row>
        <v-col lg="6" class="d-flex">
          <!-- Start Date -->
          <v-dialog transition="dialog-top-transition" width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mr-5"
                v-model="startDate"
                solo
                prepend-inner-icon="mdi-calendar"
                placeholder="Start Date"
                :hint="$t('ui.field.start_date')"
                persistent-hint
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-tabs v-model="datetab" color="primary accent-4" left>
                  <v-tab>Date</v-tab>
                  <v-tab>Time</v-tab>

                  <v-tab-item>
                    <v-container fluid>
                      <v-row>
                        <v-date-picker
                          v-model="date_1"
                          @input="inputDate"
                          @change="datetab = 1"
                        ></v-date-picker>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container fluid>
                      <v-row>
                        <v-time-picker
                          v-model="start_time_picker"
                          class="mt-4"
                          format="24hr"
                          scrollable
                        ></v-time-picker>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                </v-tabs>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false">Close</v-btn>
                  <v-btn
                    text
                    @click="
                      dialog.value = false;
                      datetab = 0;
                    "
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <!-- End Date -->
          <v-dialog transition="dialog-top-transition" width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mr-5"
                v-model="endDate"
                solo
                prepend-inner-icon="mdi-calendar"
                placeholder="End Date"
                :hint="$t('ui.field.end_date')"
                persistent-hint
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-tabs v-model="datetab" color="primary accent-4" left>
                  <v-tab>Date</v-tab>
                  <v-tab>Time</v-tab>

                  <v-tab-item>
                    <v-container fluid>
                      <v-row>
                        <v-date-picker
                          v-model="date_2"
                          @input="inputDate"
                          @change="datetab = 1"
                        ></v-date-picker>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container fluid>
                      <v-row>
                        <v-time-picker
                          v-model="end_time_picker"
                          class="mt-4"
                          format="24hr"
                          scrollable
                        ></v-time-picker>
                      </v-row>
                    </v-container>
                  </v-tab-item>
                </v-tabs>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false">Close</v-btn>
                  <v-btn
                    text
                    @click="
                      dialog.value = false;
                      datetab = 0;
                    "
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
        <v-col lg="2">
          <v-btn
            elevation="0"
            class="text-capitalize white--text mt-2"
            color="#1976D2"
            rounded
            @click="submitFilter"
            >{{ $t("ui.button_submit") }}</v-btn
          >
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            placeholder="Search Name"
            @input="getBySearch()"
            v-model="search"
            clearable
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
        hide-default-footer
      >
        <template v-slot:item.user="{ item }">
          <div v-if="item.client_access_key == ''">
            {{ item.user.name ? item.user.name : "-" }}
          </div>
          <div v-else>{{ item.client_access.name }}</div>
        </template>
        <template v-slot:item.created_at="{ item }">
          <div>{{ item.created_at | moment }}</div>
        </template>
        <template v-slot:item.detail="{ item }">
          <div>{{ item.detail ? item.detail : "-" }}</div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
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
              @change="getByTableRow()"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="getByPagination()"
        ></v-pagination>
      </v-container>
      <v-overlay :z-index="999" :value="loading_overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </div>
</template>

<script src="./ActivityLog.js"></script>

<style lang="scss" scoped>
.item-per-page {
  width: 150px;
  &::before {
    content: "Item";
    margin-top: 0.5em;
    margin-right: 1em;
  }
}
</style>
