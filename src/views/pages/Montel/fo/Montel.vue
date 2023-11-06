<template>
  <section class="single-page p-0">
    <div class="title big">
      <h4>{{ $t("general.menu.montel_dashboard") }}</h4>
    </div>
    <NavigationCellAndFo
      :link="{
        cellular: '/dashboard/montel',
        fo: '/dashboard/fo/montel',
      }"
      is-page="Fixed Broadband"
    />
    <!-- summary card -->
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-red">
            <div class="summary-wrap">
              <h4 class="summary-title">Reported</h4>
              <span class="summary-count">
                {{
                  summary_montel.open +
                  summary_montel.on_progress +
                  summary_montel.closed
                }}</span
              >
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-orange">
            <div class="summary-wrap">
              <h4 class="summary-title">Ticket</h4>
              <span class="summary-count">{{ summary_montel.open }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-green">
            <div class="summary-wrap">
              <h4 class="summary-title">
                {{ $t("ui.summary_card.ticket_progress") }}
              </h4>
              <span class="summary-count">
                {{ summary_montel.on_progress }}</span
              >
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-blue">
            <div class="summary-wrap">
              <h4 class="summary-title">Completed Tickets</h4>
              <span class="summary-count">{{ summary_montel.closed }}</span>
            </div>
          </v-card>
        </v-col>
      </div>
    </div>
    <!-- channel card -->
    <v-col cols="12" lg="12" xl="12">
      <div class="font-weight-bold mb-5">
        {{ $t("ui.menu_title.montel_channel") }}
      </div>
      <v-card class="pa-5 montel-card">
        <v-row>
          <v-col lg="11">
            <v-row>
              <v-col lg="2" class="d-flex justify-center align-center">
                <img
                  src="../../../../assets/image/facebook.svg"
                  alt="facebook"
                />
                <div class="ml-2 mr-2">Facebook</div>
                <v-checkbox v-model="ck1" disabled></v-checkbox>
              </v-col>
              <v-col lg="2" class="d-flex justify-center align-center">
                <img src="../../../../assets/image/twitter.svg" alt="twitter" />
                <div class="ml-2 mr-2">Twitter</div>
                <v-checkbox
                  v-model="ck2"
                  :disabled="whileDownload"
                ></v-checkbox>
              </v-col>
              <v-col lg="2" class="d-flex justify-center align-center">
                <img src="../../../../assets/image/youtube.svg" alt="youtube" />
                <div class="ml-2 mr-2">Youtube</div>
                <v-checkbox v-model="ck3" disabled></v-checkbox>
              </v-col>
              <v-col lg="2" class="d-flex justify-center align-center">
                <img src="../../../../assets/image/chat.svg" alt="forum" />
                <div class="ml-2 mr-2">Forum</div>
                <v-checkbox v-model="ck4" disabled></v-checkbox>
              </v-col>
              <v-col lg="2" class="d-flex justify-center align-center">
                <img src="../../../../assets/image/blog.svg" alt="blog" />
                <div class="ml-2 mr-2">Blog</div>
                <v-checkbox v-model="ck5" disabled></v-checkbox>
              </v-col>
              <v-col lg="2" class="d-flex justify-center align-center">
                <img src="../../../../assets/image/news.svg" alt="blog" />
                <div class="ml-2 mr-2">Berita</div>
                <v-checkbox v-model="ck6" disabled></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" lg="12" xl="12">
      <v-alert
        class="pmt-alert pr-5"
        v-model="alert"
        close-text="Close Alert"
        color="#FFE68E"
        light
        elevation="1"
        dismissible
      >
        <div class="alert-text">
          <v-col class="icon-wrap" cols="2" lg="2" xl="2">
            <v-icon>mdi mdi-alert</v-icon>
          </v-col>
          <v-col cols="9" lg="9" xl="9">
            <h4 class="alert-title">
              {{ $t("general.message.alert_montel.title") }}
            </h4>
            <span> {{ $t("general.message.alert_montel.message") }}</span>
          </v-col>
        </div>
      </v-alert>
    </v-col>
    <!-- result -->
    <div class="pmt-flex wrap is-row">
      <v-col cols="8" lg="8" xl="8">
        <div class="d-flex justify-space-between">
          <div class="font-weight-bold mb-5">
            {{ $t("ui.menu_title.montel_results") }}
          </div>
          <download-excel
            v-if="isViewer != true"
            class="btn btn-default mr-2"
            :fetch="fetchMontelFO"
            :fields="printOutHeader"
            worksheet="My Worksheet"
            name="montel_fo.xls"
            :before-generate="startDownload"
            :before-finish="finishDownload"
          >
            <v-btn
              :disabled="whileDownload"
              :loading="whileDownload"
              width="12rem"
              style="color: #5e5873"
              color="white"
            >
              <div class="text-capitalize">{{ $t("ui.button_download") }}</div>
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </download-excel>
        </div>
        <v-card class="pa-5 mb-5 montel-card">
          <SkeletonLoader v-if="loading" />
          <div v-else>
            <div v-if="results.length == 0" class="d-flex justify-center">
              <div class="d-flex justify-center flex-column py-10">
                <p>No Data Available</p>
                <v-btn
                  class="text-capitalize"
                  color="primary"
                  @click="resetFilter"
                  >Reset</v-btn
                >
              </div>
            </div>
            <div
              v-show="!error"
              v-else
              v-for="item in results"
              :key="item.index"
            >
              <div class="d-flex">
                <div>
                  <img
                    src="../../../../assets/image/twitter2.svg"
                    alt="twitter"
                  />
                </div>
                <div class="ml-5">
                  <div>{{ item.post_at | moment }}</div>
                  <div class="mt-2">
                    Service
                    {{
                      item.service.charAt(0).toUpperCase() +
                      item.service.slice(1)
                    }}
                  </div>
                  <div class="font-weight-bold mt-2">
                    {{ item.account }}
                    <small class="primary--text"
                      >(Follower: {{ item.followers }})</small
                    >
                  </div>
                  <div class="mt-2">{{ item.content }}</div>
                  <div class="d-flex mt-2 mb-5">
                    <v-btn
                      elevation="0"
                      class="text-capitalize white--text"
                      color="#3C7FBE"
                      @click="setupCreateTicket(item)"
                      :disabled="item.ticket_flag"
                      >{{ $t("ui.button_create_ticket") }}</v-btn
                    >
                    <v-btn
                      outlined
                      elevation="0"
                      class="ml-5 text-capitalize"
                      :href="item.url"
                      target="_blank"
                      >Visit</v-btn
                    >
                  </div>
                </div>
              </div>
              <v-divider
                class="mb-5"
                style="border-color: #e0e0e0 !important"
              ></v-divider>
            </div>
          </div>

          <!-- DIALOG CREATE TICKET -->
          <v-dialog width="80%" v-model="dialog">
            <v-card class="pa-5">
              <div class="font-weight-bold">
                {{ $t("ui.button_create_ticket") }}
              </div>
              <v-row class="mt-10">
                <v-col lg="1" class="font-weight-bold"> Source </v-col>
                <v-col lg="5" class="filter-text">
                  {{ app_name }}
                </v-col>
                <v-col lg="1" class="font-weight-bold">Status</v-col>
                <v-col lg="5" class="filter-text">Open</v-col>
                <v-col lg="1" class="font-weight-bold mt-2">Date</v-col>
                <v-col lg="5" class="filter-text">
                  <v-text-field
                    v-model="date_open"
                    dense
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col lg="1" class="font-weight-bold mt-2">Assign to</v-col>
                <v-col lg="5" class="filter-text">
                  <v-select
                    v-model="selected_cell_operator"
                    :value="selected_data.cell_operator_id"
                    :items="itemOperator"
                    item-value="id"
                    item-text="name"
                    dense
                    outlined
                    placeholder="Assign To"
                  ></v-select>
                </v-col>
                <v-col lg="1" class="font-weight-bold mt-2">Category</v-col>
                <v-col lg="5" class="filter-text">
                  <v-select
                    v-model="category"
                    :items="list_category"
                    item-value="name"
                    item-text="name"
                    dense
                    outlined
                    placeholder="Category"
                  ></v-select>
                </v-col>
                <v-col lg="1" class="font-weight-bold mt-2">Subject</v-col>
                <v-col lg="5" class="filter-text">
                  <v-text-field
                    v-model="subject"
                    dense
                    outlined
                    placeholder="Tidak bisa internet"
                  ></v-text-field>
                </v-col>
                <v-col lg="1" class="font-weight-bold mt-2">Description</v-col>
                <v-col lg="5" class="filter-text">
                  <v-textarea v-model="description" dense outlined></v-textarea>
                </v-col>

                <v-col lg="1" class="font-weight-bold mt-2">Attachment</v-col>
                <v-col lg="5" class="filter-text">
                  <v-file-input
                    show-size
                    dense
                    outlined
                    v-model="attachment"
                    placeholder="Upload file"
                  ></v-file-input>
                </v-col>
                <v-col lg="12" class="d-flex justify-end">
                  <v-btn
                    elevation="0"
                    class="mr-5 white--text text-capitalize"
                    color="#3C7FBE"
                    @click="createTicket"
                    >Buat Ticket</v-btn
                  >
                  <v-btn
                    outlined
                    class="text-capitalize"
                    elevation="0"
                    @click="dialog = false"
                    >Cancel</v-btn
                  >
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>
          <div v-show="error">{{ message }}</div>
          <v-container class="max-width">
            <v-row justify="end" align="center">
              <v-col cols="2">
                <v-select
                  :items="pagination.rowsPerPageItems"
                  class="item-per-page"
                  v-model="pagination.rowsPerPage"
                  @change="getMontelDataByTableRow"
                ></v-select>
              </v-col>
            </v-row>
            <v-pagination
              v-model="pagination.page"
              class="my-4"
              :total-visible="7"
              :length="pagination.totalItems"
              @input="getMontelDataByPagination"
            ></v-pagination>
          </v-container>
          <v-overlay :z-index="999" :value="loading_overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-card>
      </v-col>
      <v-col cols="4" lg="4" xl="4">
        <div class="font-weight-bold mb-5">Filter</div>
        <v-card class="pa-5 montel-card">
          <v-row>
            <v-col lg="12">
              <v-row>
                <v-col class="text-capitalize" lg="6">{{
                  $t("ui.table_piece.start_date")
                }}</v-col>
                <v-col class="text-capitalize" lg="6">{{
                  $t("ui.table_piece.end_date")
                }}</v-col>
              </v-row>
            </v-col>
            <v-col lg="12" class="d-flex">
              <v-menu
                v-model="date_picker_1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="mr-5"
                    v-model="startDate"
                    solo
                    prepend-inner-icon="mdi-calendar"
                    placeholder="Start Date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="whileDownload"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @input="inputDate"
                  v-model="date_1"
                ></v-date-picker>
              </v-menu>
              <v-menu
                class="ml-5"
                v-model="date_picker_2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    solo
                    prepend-inner-icon="mdi-calendar"
                    placeholder="End Date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="whileDownload"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @input="inputDate"
                  v-model="date_2"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col lg="4">
              <div class="filter-text">{{ $t("ui.table_piece.sort") }}</div>
            </v-col>
            <v-col lg="8">
              <v-select
                v-model="selected_sort"
                :items="sort"
                item-text="name"
                item-value="value"
                dense
                outlined
                placeholder="Last updated"
                :disabled="whileDownload"
              ></v-select>
            </v-col>
            <v-col lg="4">
              <div class="filter-text">{{ $t("ui.table_piece.service") }}</div>
            </v-col>
            <v-col lg="8">
              <v-select
                v-model="selected_service"
                :items="service"
                item-text="name"
                item-value="value"
                dense
                outlined
                placeholder="Select all"
                :disabled="whileDownload"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col lg="4">
              <div class="filter-text">Operator</div>
            </v-col>
            <v-col lg="8">
              <v-autocomplete
                v-model="selected_opsel"
                :items="itemOperator"
                :search-input.sync="filter.searchOperator"
                item-text="name"
                item-value="id"
                dense
                :clearable="true"
                outlined
                multiple
                @input="selectOpsel"
                placeholder="Select Fixed Broadband"
                :disabled="whileDownload"
              ></v-autocomplete>
            </v-col>
            <v-col lg="4"
              ><p>{{ $t("ui.table_piece.search") }}</p></v-col
            >
            <v-col lg="8" class="d-flex">
              <v-text-field
                dense
                outlined
                :placeholder="$t('ui.table_piece.search')"
                clearable
                v-model="search"
                :disabled="whileDownload"
              ></v-text-field>
            </v-col>
            <v-col lg="12">
              <v-btn
                width="100%"
                elevation="0"
                class="text-capitalize white--text"
                color="#3C7FBE"
                @click="submitFilterMontel"
                :disabled="whileDownload"
                >{{ $t("ui.button_submit") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </div>
  </section>
</template>

<script src="./Montel.js"></script>

<style></style>
