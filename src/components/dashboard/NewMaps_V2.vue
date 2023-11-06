<template>
  <div>
    <!-- Location -->
    <h1 class="ml-5" id="location-text" v-if="selected_location != null">
      {{ detail_location ? detail_location.name : "" }}
    </h1>
    <div ref="map-root" :id="id" :style="`width: 100%; height:100vh;`"></div>

    <!-- Marker -->
    <div
      v-show="show_marker"
      v-for="(marker, index) in place"
      :key="index"
      :id="`marker-${index}`"
      :class="`marker marker-${marker.data.cell_operator_id}`"
      :style="`background-image: url(${marker.url})`"
      @click="handleAlarmDetail(marker)"
    ></div>

    <!-- Tower Count Dialog -->
    <v-navigation-drawer
      v-model="overlay_total_tower"
      width="600"
      absolute
      left
      style="z-index: 999999 !important"
    >
      <div class="pa-10 d-flex">
        <h3 class="text-header-total-bts">Informasi Total BTS</h3>
        <v-spacer></v-spacer>
        <v-btn @click="closeDrawerInfo" text
          ><v-icon class="close-ic">mdi-close</v-icon></v-btn
        >
      </div>

      <v-card flat height="100vh">
        <!-- <v-overlay absolute :value="loading_tower_count">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay> -->

        <v-data-table
          :headers="headers_tower_count"
          :items="tower_count"
          :loading="loading_tower_count"
          loading-text="memuat data..."
          hide-default-footer
        >
          <!-- Operator -->
          <template v-slot:item.cell_operator.secondary_logo="{ item }">
            <v-img
              :src="pmt_url + item.cell_operator.secondary_logo"
              height="64px"
              width="64px"
            ></v-img>
          </template>
          <!-- 4G -->
          <template v-slot:item.data.4G="{ item }">
            <p>{{ item.data["4G"] }}</p>
          </template>
          <!-- 3G -->
          <template v-slot:item.data.3G="{ item }">
            <p>{{ item.data["3G"] }}</p>
          </template>
          <!-- 2G -->
          <template v-slot:item.data.2G="{ item }">
            <p>{{ item.data["2G"] }}</p>
          </template>
        </v-data-table>
      </v-card>
    </v-navigation-drawer>
    <!-- QOE & SIGMON DIALOG -->
    <v-dialog v-model="showChart" fullscreen>
      <v-card class="pa-5">
        <div class="d-flex">
          <h1 v-if="selected_location == null">National</h1>
          <h1 v-if="selected_location != null">
            {{ detail_location ? detail_location.name : "" }}
          </h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeChart">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <h1 class="mt-10">Sigmon</h1>

        <v-tabs v-model="tabTechnology">
          <v-tab @click="getDataChartSigmon('4G')">4G</v-tab>
          <v-tab @click="getDataChartSigmon('3G')">3G</v-tab>
          <v-tab @click="getDataChartSigmon('2G')">2G</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabTechnology">
          <!-- 4G -->
          <v-tab-item>
            <v-row>
              <!-- Download -->
              <v-col cols="12" lg="6">
                <v-card class="pa-5 mt-10">
                  <div class="d-flex">
                    <div class="font-weight-bold">
                      {{ $t("ui.button_download") }}
                    </div>
                    <v-spacer></v-spacer>
                  </div>
                  <div
                    id="sigmon4gdownload"
                    ref="sigmon4gdownload"
                    :key="componentKey4G['download']"
                  ></div>
                </v-card>
              </v-col>

              <!-- Upload -->
              <v-col cols="12" lg="6">
                <v-card class="pa-5 mt-10">
                  <div class="d-flex">
                    <div class="font-weight-bold">Upload</div>
                    <v-spacer></v-spacer>
                  </div>
                  <div
                    id="sigmon4gupload"
                    ref="sigmon4gupload"
                    :key="componentKey4G['upload']"
                  ></div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Signal Strength -->
            <v-card class="pa-5 mt-10">
              <div class="d-flex">
                <div class="font-weight-bold">Signal Strength</div>
                <v-spacer></v-spacer>
              </div>
              <div
                id="sigmon4gsignal"
                ref="sigmon4gsignal"
                :key="componentKey4G['signal']"
              ></div>
            </v-card>
          </v-tab-item>
          <!-- 3G -->
          <v-tab-item>
            <v-row>
              <!-- Download -->
              <v-col cols="12" lg="6">
                <v-card class="pa-5 mt-10">
                  <div class="d-flex">
                    <div class="font-weight-bold">
                      {{ $t("ui.button_download") }}
                    </div>
                    <v-spacer></v-spacer>
                  </div>
                  <div
                    id="sigmon3gdownload"
                    ref="sigmon3gdownload"
                    :key="componentKey3G['download']"
                  ></div>
                </v-card>
              </v-col>

              <!-- Upload -->
              <v-col cols="12" lg="6">
                <v-card class="pa-5 mt-10">
                  <div class="d-flex">
                    <div class="font-weight-bold">Upload</div>
                    <v-spacer></v-spacer>
                  </div>
                  <div
                    id="sigmon3gupload"
                    ref="sigmon3gupload"
                    :key="componentKey3G['upload']"
                  ></div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Signal Strength -->
            <v-card class="pa-5 mt-10">
              <div class="d-flex">
                <div class="font-weight-bold">Signal Strength</div>
                <v-spacer></v-spacer>
              </div>
              <div
                id="sigmon3gsignal"
                ref="sigmon3gsignal"
                :key="componentKey3G['signal']"
              ></div>
            </v-card>
          </v-tab-item>
          <!-- 2G -->
          <v-tab-item>
            <v-row>
              <!-- Download -->
              <v-col cols="12" lg="6">
                <v-card class="pa-5 mt-10">
                  <div class="d-flex">
                    <div class="font-weight-bold">
                      {{ $t("ui.button_download") }}
                    </div>
                    <v-spacer></v-spacer>
                  </div>
                  <div
                    id="sigmon2gdownload"
                    ref="sigmon2gdownload"
                    :key="componentKey2G['download']"
                  ></div>
                </v-card>
              </v-col>

              <!-- Upload -->
              <v-col cols="12" lg="6">
                <v-card class="pa-5 mt-10">
                  <div class="d-flex">
                    <div class="font-weight-bold">Upload</div>
                    <v-spacer></v-spacer>
                  </div>
                  <div
                    id="sigmon2gupload"
                    ref="sigmon2gupload"
                    :key="componentKey2G['upload']"
                  ></div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Signal Strength -->
            <v-card class="pa-5 mt-10">
              <div class="d-flex">
                <div class="font-weight-bold">Signal Strength</div>
                <v-spacer></v-spacer>
              </div>
              <div
                id="sigmon2gsignal"
                ref="sigmon2gsignal"
                :key="componentKey2G['signal']"
              ></div>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showChartQOS" fullscreen>
      <v-card class="pa-5">
        <div class="d-flex">
          <h1 v-if="selected_location == null">National</h1>
          <h1 v-if="selected_location != null">
            {{ detail_location ? detail_location.name : "" }}
          </h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeChartQOS">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <h1 class="mt-10">Quality of Service</h1>

        <v-row>
          <!-- Download -->
          <v-col cols="12" lg="6">
            <v-card class="pa-5 mt-10">
              <div class="d-flex">
                <div class="font-weight-bold">
                  {{ $t("ui.button_download") }}
                </div>
                <v-spacer></v-spacer>
              </div>
              <div
                id="qosdownload"
                ref="qosdownload"
                :key="componentKeyQOS['download']"
              ></div>
            </v-card>
          </v-col>

          <!-- Upload -->
          <v-col cols="12" lg="6">
            <v-card class="pa-5 mt-10">
              <div class="d-flex">
                <div class="font-weight-bold">Upload</div>
                <v-spacer></v-spacer>
              </div>
              <div
                id="qosupload"
                ref="qosupload"
                :key="componentKeyQOS['upload']"
              ></div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Signal Strength -->
        <v-card class="pa-5 mt-10">
          <v-row class="d-flex">
            <v-col cols="6" lg="2">
              <div class="font-weight-bold">Signal Strength</div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-tabs v-model="tabTechnologyQOS">
                <v-tab @click="getDataChartQOS">4G</v-tab>
                <v-tab @click="getDataChartQOS">3G</v-tab>
                <v-tab @click="getDataChartQOS">2G</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-tabs-items v-model="tabTechnologyQOS">
            <!-- 4G -->
            <v-tab-item>
              <div
                id="qossignal4g"
                ref="qossignal4g"
                :key="componentKeyQOS['qossignal4g']"
              ></div>
            </v-tab-item>
            <!-- 3G -->
            <v-tab-item>
              <div
                id="qossignal3g"
                ref="qossignal3g"
                :key="componentKeyQOS['qossignal3g']"
              ></div>
            </v-tab-item>
            <!-- 2G -->
            <v-tab-item>
              <div
                id="qossignal2g"
                ref="qossignal2g"
                :key="componentKeyQOS['qossignal2g']"
              ></div>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-card>
    </v-dialog>

    <!-- SEARCH DIALOG -->
    <v-dialog
      v-model="overlay_search"
      transition="dialog-bottom-transition"
      max-width="600"
      content-class="overlay_search"
      style="overflow-y: none; color: red"
    >
      <v-card flat class="pa-5">
        <v-autocomplete
          @input="checkLocationByCode"
          @click:append-outer="resetSearch"
          v-model="selected_location"
          :loading="isLoading"
          :items="locations"
          :search-input.sync="search"
          :item-text="text"
          item-value="code"
          label="Cari wilayah..."
          solo
          append-outer-icon="mdi-close"
        ></v-autocomplete>
      </v-card>
    </v-dialog>

    <!-- Overlay Loading -->
    <v-overlay :value="loading_overlay" z-index="999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- TICKET DIALOG -->
    <v-dialog v-model="showTicket" fullscreen>
      <v-card class="pa-5">
        <div class="d-flex">
          <h1>Summary Ticket</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeTicket">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-row class="mt-5">
          <v-col
            xs="12"
            sm="12"
            md="4"
            lg="4"
            xl="4"
            v-for="data in ticket"
            :key="data.index"
          >
            <v-card class="pa-5">
              <div class="d-flex align-center">
                <img width="10%" :src="pmt_url + data.logo" :alt="data.name" />
                <div class="font-weight-bold ml-5">{{ data.name }}</div>
              </div>
              <v-divider></v-divider>
              <v-row class="mt-5">
                <v-col lg="4" xl="4" class="font-weight-bold">
                  Total Ticket
                </v-col>
                <v-col lg="8" xl="8"> : {{ data.total }} </v-col>
              </v-row>
              <v-row v-for="item in data.data" :key="item.index">
                <v-col lg="4" xl="4" class="font-weight-bold">{{
                  item.name
                }}</v-col>
                <v-col lg="8" xl="8"> : {{ item.count }} </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- ANALYSIS DIALOG -->
    <v-dialog v-model="show_analysis" fullscreen>
      <v-card class="pa-5">
        <div class="d-flex">
          <h1>Analysis Summary</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeAnalysis">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="analysis-dashboard">
          <v-row class="mt-5">
            <v-col lg="2">
              <v-select
                v-model="selected_opsel_temp"
                @input="addOpselAnaylysis"
                label="Network Operator"
                :items="item_opsel"
                item-text="name"
                item-value="id"
                outlined
                dense
                placeholder="Network Operator"
              ></v-select>
            </v-col>

            <v-col lg="2">
              <v-select
                v-model="selected_tech"
                @input="selectedTech"
                :items="technology"
                item-text="name"
                item-value="id"
                label="Technology"
                outlined
                dense
                hide-details
                placeholder="Technology"
              ></v-select>
            </v-col>
            <v-col lg="2">
              <v-btn
                @click="applyFilter"
                class="mr-5 text-capitalize white--text"
                color="#169CD6"
                >{{ $t("ui.button_apply") }}</v-btn
              >
              <v-btn
                @click="resetFilter"
                class="text-capitalize white--text"
                color="#EA5455"
                >Reset</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col lg="12">
              <v-card v-if="show_data" class="pa-2">
                <v-row>
                  <v-col lg="2">
                    <img
                      width="80%"
                      :src="pmt_url + opsel_selected.logo"
                      :alt="opsel_selected.name"
                    />
                  </v-col>
                  <v-col lg="10">
                    <div class="mt-2" style="font-size: 24px; font-weight: 500">
                      ANALYSIS
                    </div>
                    <div class="mt-2" style="font-size: 24px; font-weight: 500">
                      {{ opsel_selected.name }}, Technology
                      {{ technology_selected }}
                    </div>
                    <div class="mt-2">
                      {{ province }}, {{ city }}, {{ district }}
                    </div>
                    <div class="mt-5">
                      {{ selected_data == "" ? "-" : selected_data }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="filter_selected">
            <v-col lg="12">
              <v-card class="pa-5 text-center">
                <div class="mb-5 font-weight-bold">
                  {{ message == "" ? "Please Select Filter First" : message }}
                </div>
                <img
                  width="25%"
                  src="../../assets/image/empty.svg"
                  alt="no data"
                />
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col lg="4">
              <v-card class="pa-5">
                <div class="text-center mb-1 font-weight-bold text-capitalize">
                  COVERAGE
                </div>
                <div
                  class="text-center mb-10 font-weight-bold text-capitalize"
                  style="border-bottom: 1px solid #c4c4c4"
                >
                  CovPrediction x SIGMON
                </div>
                <v-row v-if="skeleton">
                  <v-col lg="12">
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col lg="3">
                    <div style="width: 100%; height: 100%">
                      <div class="vrt-prm">Signal Strength</div>
                      <div class="vrt-prm">Coverage Prediction</div>
                    </div>
                  </v-col>
                  <v-col lg="6">
                    <v-row>
                      <v-col lg="4">
                        <div style="color: #867e7e">GOOD</div>
                      </v-col>
                      <v-col lg="4">
                        <div style="color: #867e7e">FAIR</div>
                      </v-col>
                      <v-col lg="4">
                        <div style="color: #867e7e">BAD</div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col lg="4">
                        <div class="param-good">BAD</div>
                        <v-card
                          color="#3FC57B"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.good_good ? cov_qoe_ss.good_good : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(63, 197, 123, 0.7)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.good_fair ? cov_qoe_ss.good_fair : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(63, 197, 123, 0.3)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.good_bad ? cov_qoe_ss.good_bad : 0 }}%
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col lg="4">
                        <div class="param-fair">FAIR</div>
                        <v-card
                          color="rgba(236, 175, 85, 0.7)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.fair_good ? cov_qoe_ss.fair_good : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="#ECAF55"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.fair_fair ? cov_qoe_ss.fair_fair : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(236, 175, 85, 0.3)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.fair_bad ? cov_qoe_ss.fair_bad : 0 }}%
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col lg="4">
                        <div class="param-bad">GOOD</div>
                        <v-card
                          color="rgba(216, 76, 58, 0.3)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.bad_good ? cov_qoe_ss.bad_good : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(216, 76, 58, 0.7)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.bad_fair ? cov_qoe_ss.bad_fair : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="#D84C3A"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_ss.bad_bad ? cov_qoe_ss.bad_bad : 0 }}%
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col lg="3"></v-col>
                  <v-col lg="12">
                    <div class="text-center">Signal Strength</div>
                    <div class="text-center">SIGMON</div>
                  </v-col>
                  <v-col lg="2">
                    <div style="width: 100%; height: 100%">
                      <div class="not-cvrd">NOT COVERED</div>
                    </div>
                  </v-col>
                  <v-col lg="3">
                    <v-card
                      color="#E0E0E0"
                      class="px-1 py-2 text-center font-weight-bold"
                      width="75px"
                      height="40px"
                    >
                      {{ cov_qoe_ss.not_covered ? cov_qoe_ss.not_covered : 0 }}%
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col lg="4">
              <v-card class="pa-5">
                <div class="text-center mb-1 font-weight-bold text-capitalize">
                  COVERAGE
                </div>
                <div
                  class="text-center mb-10 font-weight-bold text-capitalize"
                  style="border-bottom: 1px solid #c4c4c4"
                >
                  CovPrediction x SIGMON
                </div>
                <v-row v-if="skeleton">
                  <v-col lg="12">
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col lg="3">
                    <div style="width: 100%; height: 100%">
                      <div class="vrt-prm">Signal Strength</div>
                      <div class="vrt-prm">Coverage Prediction</div>
                    </div>
                  </v-col>
                  <v-col lg="6">
                    <v-row>
                      <v-col lg="4">
                        <div style="color: #867e7e">GOOD</div>
                      </v-col>
                      <v-col lg="4">
                        <div style="color: #867e7e">FAIR</div>
                      </v-col>
                      <v-col lg="4">
                        <div style="color: #867e7e">BAD</div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col lg="4">
                        <div class="param-good">BAD</div>
                        <v-card
                          color="#3FC57B"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.good_good ? cov_qoe_dl.good_good : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(63, 197, 123, 0.7)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.good_fair ? cov_qoe_dl.good_fair : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(63, 197, 123, 0.3)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.good_bad ? cov_qoe_dl.good_bad : 0 }}%
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col lg="4">
                        <div class="param-fair">FAIR</div>
                        <v-card
                          color="rgba(236, 175, 85, 0.7)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.fair_good ? cov_qoe_dl.fair_good : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="#ECAF55"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.fair_fair ? cov_qoe_dl.fair_fair : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(236, 175, 85, 0.3)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.fair_bad ? cov_qoe_dl.fair_bad : 0 }}%
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col lg="4">
                        <div class="param-bad">GOOD</div>
                        <v-card
                          color="rgba(216, 76, 58, 0.3)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.bad_good ? cov_qoe_dl.bad_good : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="rgba(216, 76, 58, 0.7)"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.bad_fair ? cov_qoe_dl.bad_fair : 0 }}%
                        </v-card>
                      </v-col>
                      <v-col lg="4">
                        <v-card
                          color="#D84C3A"
                          width="70"
                          height="50"
                          class="d-flex justify-center align-center font-weight-bold"
                        >
                          {{ cov_qoe_dl.bad_bad ? cov_qoe_dl.bad_bad : 0 }}%
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col lg="3"></v-col>
                  <v-col lg="12">
                    <div class="text-center">Speed Test Download SIGMON</div>
                    <div class="text-center">SIGMON</div>
                  </v-col>
                  <v-col lg="2">
                    <div style="width: 100%; height: 100%">
                      <div class="not-cvrd">NOT COVERED</div>
                    </div>
                  </v-col>
                  <v-col lg="3">
                    <v-card
                      color="#E0E0E0"
                      class="px-1 py-2 text-center font-weight-bold"
                      width="75px"
                      height="40px"
                    >
                      {{ cov_qoe_dl.not_covered ? cov_qoe_dl.not_covered : 0 }}%
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>

    <MapsLegend id="mapLegends" />
  </div>
</template>

<script>
// import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";

import JwtServices from "../../services/jwt.services";
import { RESET_FILTER } from "../../store/modules/qoe.module";

// import Geocoder from "ol-geocoder";
import Popup from "ol-popup";
import Map from "ol/Map";
import GeoJSON from "ol/format/GeoJSON";

// import VueApexCharts from "vue-apexcharts";
import { Icon, Style } from "ol/style";
import Point from "ol/geom/Point";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { transform } from "ol/proj";
import Bar from "ol-ext/control/Bar";
import Toggle from "ol-ext/control/Toggle";
// import Select from "ol/interaction/Select";
import ZoomToExtent from "ol/control/ZoomToExtent";
import Rotate from "ol/control/Rotate";
// import FullScreen from "ol/control/FullScreen";
// import Legend from "ol-ext/legend/Legend";
// import ControlLegend from "ol-ext/control/Legend";
import CircleStyle from "ol/style/Circle";
import Feature from "ol/Feature";
import { easeOut } from "ol/easing";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { unByKey } from "ol/Observable";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getVectorContext } from "ol/render";
import { fromLonLat, toLonLat } from "ol/proj";
import LayerSwitcher from "ol-layerswitcher";
import TileLayer from "ol/layer/Tile";
// import Overlay from "ol-ext/control/Overlay";
import Button from "ol-ext/control/Button";

// Icon //
import NearMe from "../../assets/icon/me.png";

import TileWMS from "ol/source/TileWMS";
import LayerGroup from "ol/layer/Group";

import Stamen from "ol/source/Stamen";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from 'ol/source/Vector';

import { GET_OPSEL } from "../../store/modules/opsel.module";
import ApexCharts from "apexcharts";
import moment from "moment";
// import ImageLayer from 'ol/layer/Image';
import Overlay from "ol/Overlay";

import MapsLegend from "../SummaryDashboard/MapComponents/MapsLegend.vue";

export default {
  props: ["height", "id"],
  components: { MapsLegend },
  data: () => ({
    headers_tower_count: [
      {
        text: "Operator",
        align: "left",
        sortable: false,
        value: "cell_operator.secondary_logo",
      },
      {
        text: "4G",
        align: "center",
        sortable: false,
        value: "data.4G",
      },
      {
        text: "3G",
        align: "center",
        sortable: false,
        value: "data.3G",
      },
      {
        text: "2G",
        align: "center",
        sortable: false,
        value: "data.2G",
      },
    ],
    loading_tower_count: false,
    loading_overlay: false,
    tabTechnologyQOS: null,
    tabTechnology: null,
    pmt_url: process.env.VUE_APP_API_URL,
    near_me: 1,
    isLoading: false,
    locations: [],
    selected_location: null,
    search: null,
    detail_location: null,
    location_type: null,

    overlay_search: false,
    overlay_total_tower: false,

    sound: true,
    map: null,
    showAlarm: false,
    markers: [
      {
        id: 1,
        name: "Parumpanai",
        position: [120.996, -2.465343],
      },
      {
        id: 2,
        name: "Manis Mata",
        position: [110.996, -2.465343],
      },
    ],

    layer_location: null,

    wms_source: null,
    wms_layer: null,
    layers: null,
    view: null,
    layers_by_name: [],
    wmts_layer: null,
    logo: null,
    place: [],
    data: [],
    tileLayer: null,
    legend: null,

    ripple: null,
    popup: null,
    showChart: false,
    showChartQOS: false,
    chart_btn: null,
    chart_qos_btn: null,

    series_sigmon: [],

    componentKey4G: [],
    componentKey3G: [],
    componentKey2G: [],

    series_sigmon_2g_download: [],
    series_sigmon_2g_upload: [],
    series_sigmon_2g_signalstrength: [],

    series_sigmon_3g_download: [],
    series_sigmon_3g_upload: [],
    series_sigmon_3g_signalstrength: [],

    series_sigmon_4g_download: [],
    series_sigmon_4g_upload: [],
    series_sigmon_4g_signalstrength: [],

    componentKeyQOS: [],

    series_qos: [],

    series_qos_download: [],
    series_qos_upload: [],
    series_qos_signalstrength_4g: [],
    series_qos_signalstrength_3g: [],
    series_qos_signalstrength_2g: [],

    chart_rendered: [],
    showTicket: false,
    ticket_btn: null,
    ticket: [
      {
        total: [],
      },
    ],
    total_ticket: 0,
    alarm: [],

    interval_alarm: null,
    coverage: [
      {
        title: "Coverage",
        layers: [
          {
            title: "Enpar",
            layers: [
              {
                title: "2G",
                layers: [],
              },
              {
                title: "3G",
                layers: [],
              },
              {
                title: "4G",
                layers: [],
              },
            ],
          },
          {
            title: "Laporan",
            layers: [
              {
                title: "2G",
                layers: [],
              },
              {
                title: "3G",
                layers: [],
              },
              {
                title: "4G",
                layers: [],
              },
            ],
          },
        ],
      },
    ],
    coverage_layer: null,
    coverage_layer_2G: [],
    coverage_layer_3G: [],
    coverage_layer_4G: [],

    coverage_layer_2G_region: [],
    coverage_layer_3G_region: [],
    coverage_layer_4G_region: [],

    bts_layer_2G: [],
    bts_layer_3G: [],
    bts_layer_4G: [],

    fo_layer: [],

    others_layer: [],

    tower_count: [],
    alarm_availability: [],
    show_marker: false,
    show_analysis: false,
    analysis: null,

    date: new Date().toISOString().substr(0, 7),
    selected_opsel_temp: 0,
    menu: false,
    menu2: false,
    height: "700px",
    selected_filter: "",
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    searchProvince: "",
    searchCity: "",
    searchDistrict: "",
    technology: [
      {
        id: 0,
        name: "Technology",
      },
      {
        id: 1,
        name: "2G",
      },
      {
        id: 2,
        name: "3G",
      },
      {
        id: 3,
        name: "4G",
      },
    ],
    parameter: [
      {
        id: 0,
        name: "Parameter",
      },
      {
        id: 1,
        name: "POI",
      },
      {
        id: 2,
        name: "Event",
      },
    ],
    selected_tech: 0,
    selected_param: 0,
    opsel_selected: {},
    technology_selected: "",
    province: "",
    city: "",
    district: "",
    show_data: false,
    selected_data: "",
    filter_selected: true,
    cov_qoe_ss: {},
    cov_qoe_dl: {},
    skeleton: true,
    message: "",
    layerSwitcher: null,
  }),

  computed: {
    opsel: function () {
      return this.$store.getters.getOpsel;
    },

    item_province: function () {
      return this.$store.getters.item_province;
    },

    item_city: function () {
      return this.$store.getters.item_city;
    },

    item_district: function () {
      return this.$store.getters.item_district;
    },

    item_opsel: function () {
      return this.$store.getters.item_opsel;
    },
  },

  watch: {
    opsel(newValue, oldValue) {
      console.log(newValue, oldValue);
      this.addTotalBTS(newValue);
    },

    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },

    search(val) {
      this.searchLocation(val);
    },

    layerSwitcher(value) {
      console.log(value);
    },
  },

  created() {
    this.$store.dispatch(GET_OPSEL);
    this.alarmAvailability();
    this.getOperatorCellular();
  },

  async mounted() {
    this.initializeMap();
    await this.getMapFilter();
    this.addOthersLayer();
    this.addFOLayer();
    this.addCoverageLayer();
    this.addBTSlayer();

    this.addButtonSearch();
    this.addButtonTotalTower();
    this.zoomToLocation();
    this.getTicket();

    // popup
    this.popup = new Popup();
    this.map.addOverlay(this.popup);

    this.map.on("click", (evt) => {
      this.layerSwitcher.on("show", (evt) => {
        console.log("show", evt);
      });

      const feature = this.map.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        }
      );
      if (feature) {
        for (let data of this.alarm) {
          if (feature.get("id") == data.id) {
            this.view.animate({
              center: fromLonLat([
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ]),
              duration: 2000,
              zoom: 16,
            });
          }
          setTimeout(() => {
            this.popup.show(
              feature.getGeometry().getCoordinates(),
              feature.get("name")
            );
          }, 3000);
        }
      }
    });

    this.map.on("singleclick", (evt) => {
      console.log(this.layerSwitcher);

      const viewResolution = /** @type {number} */ (this.view.getResolution());
      this.map.forEachLayerAtPixel(evt.pixel, (layer) => {
        // log the LAYERS param of the WMS source
        let coor = toLonLat(evt.coordinate);
        console.log(coor);
        let lat = coor[1];
        let long = coor[0];

        console.log(layer.get("name"));

        switch (layer.get("name")) {
          case "Provinsi":
            fetch(
              `https://infragis.kominfo.go.id/webapi/popup/wilayah/${long},${lat}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                let show =
                  data[0].nama_prov +
                  ", " +
                  data[0].nama_kabkot +
                  ", " +
                  data[0].nama_kec +
                  ", " +
                  data[0].nama_keldes +
                  ", " +
                  data[0].luas_km;

                this.popup.show(evt.coordinate, show);
              });
            break;
          case "Kota":
            fetch(
              `https://infragis.kominfo.go.id/webapi/popup/wilayah/${long},${lat}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                let show =
                  data[0].nama_prov +
                  ", " +
                  data[0].nama_kabkot +
                  ", " +
                  data[0].nama_kec +
                  ", " +
                  data[0].nama_keldes +
                  ", " +
                  data[0].luas_km;

                this.popup.show(evt.coordinate, show);
              });
            break;
          case "Kecamatan":
            fetch(
              `https://infragis.kominfo.go.id/webapi/popup/wilayah/${long},${lat}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                let show =
                  data[0].nama_prov +
                  ", " +
                  data[0].nama_kabkot +
                  ", " +
                  data[0].nama_kec +
                  ", " +
                  data[0].nama_keldes +
                  ", " +
                  data[0].luas_km;

                this.popup.show(evt.coordinate, show);
              });
            break;
          case "Kelurahan":
            fetch(
              `https://infragis.kominfo.go.id/webapi/popup/wilayah/${long},${lat}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                let show =
                  data[0].nama_prov +
                  ", " +
                  data[0].nama_kabkot +
                  ", " +
                  data[0].nama_kec +
                  ", " +
                  data[0].nama_keldes +
                  ", " +
                  data[0].luas_km;

                this.popup.show(evt.coordinate, show);
              });
            break;
        }

        if (layer.get("title") != "OSM") {
          const url = layer
            .getSource()
            .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:900913", {
              INFO_FORMAT: "application/json",
              FEATURE_COUNT: "1000",
            });

          if (url) {
            fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (data.features.length == 0) {
                  return;
                }
                switch (layer.getSource().getParams().title) {
                  case "coverage":
                    for (let item of data.features) {
                      // console.log(data.features.getGeometry().getCoordinates());
                      let show = item.properties.kls_sign;
                      this.popup.show(evt.coordinate, show);
                    }
                    break;
                  case "BTS":
                    for (let item of data.features) {
                      // console.log(data.features.getGeometry().getCoordinates());
                      let show =
                        item.properties.kdepum +
                        ", " +
                        item.properties.address +
                        ", " +
                        item.properties.transmisi +
                        ", " +
                        item.properties.siteid +
                        ", " +
                        item.properties.sitetype;
                      this.popup.show(evt.coordinate, show);
                    }
                    break;
                  case "FO":
                    for (let item of data.features) {
                      console.log(item.properties.pt);
                      // console.log(data.features.getGeometry().getCoordinates());
                      let show =
                        item.properties.letak +
                        ", " +
                        item.properties.kelas +
                        ", " +
                        item.properties.pt +
                        ", " +
                        item.properties.core +
                        ", " +
                        item.properties.catatan;

                      this.popup.show(evt.coordinate, show);
                    }
                    break;
                  case undefined:
                    console.log(long, lat);
                    fetch(
                      `https://infragis.kominfo.go.id/webapi/popup/wilayah/${long},${lat}`,
                      {
                        method: "GET",
                        headers: {
                          Accept: "application/json",
                        },
                      }
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        console.log(data);
                        let show =
                          data[0].nama_prov +
                          ", " +
                          data[0].nama_kabkot +
                          ", " +
                          data[0].nama_kec +
                          ", " +
                          data[0].nama_keldes +
                          ", " +
                          data[0].luas_km;

                        this.popup.show(evt.coordinate, show);
                      });
                    break;
                }
              });
          }
        }
      });

      this.map.on("change:visible", function () {
        console.log("HELLO");
      });
      // let layer = evt.target.getLayers();
      // console.log(layer.getFeatureInfo);

      // console.log(url);
    });

    // change mouse cursor when over marker
    this.map.on("pointermove", (e) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTarget().style.cursor = hit ? "pointer" : "";
    });

    this.componentKey4G["download"] = 2;
    this.componentKey4G["upload"] = 2;
    this.componentKey4G["signal"] = 2;

    this.componentKey3G["download"] = 3;
    this.componentKey3G["upload"] = 3;
    this.componentKey3G["signal"] = 3;

    this.componentKey2G["download"] = 7;
    this.componentKey2G["upload"] = 7;
    this.componentKey2G["signal"] = 7;
  },

  methods: {
    initializeMap() {
      let self = this;

      this.tileLayer = new TileLayer({
        // A layer must have a title to appear in the layerswitcher
        title: "OSM",
        // Again set this layer as a base layer
        type: "base",
        visible: true,
        source: new OSM(),
      });

      this.layers = new LayerGroup({
        // A layer must have a title to appear in the layerswitcher
        title: "Base maps",
        layers: [
          this.tileLayer,
          // this.coverage_layer,
          new LayerGroup({
            // A layer must have a title to appear in the layerswitcher
            title: "Water color with labels",
            // Setting the layers type to 'base' results
            // in it having a radio button and only one
            // base layer being visibile at a time
            type: "base",
            // Setting combine to true causes sub-layers to be hidden
            // in the layerswitcher, only the parent is shown
            combine: true,
            visible: false,
            layers: [
              new TileLayer({
                source: new Stamen({
                  layer: "watercolor",
                }),
              }),
              new TileLayer({
                source: new Stamen({
                  layer: "terrain-labels",
                }),
              }),
            ],
          }),
          new TileLayer({
            // A layer must have a title to appear in the layerswitcher
            title: "Water color",
            // Again set this layer as a base layer
            type: "base",
            visible: false,
            source: new Stamen({
              layer: "watercolor",
            }),
          }),
        ],
      });

      this.view = new View({
        center: transform([117.996, -2.465343], "EPSG:4326", "EPSG:900913"),
        zoom: 6,
      });

      this.map = new Map({
        layers: [],
        target: this.$refs["map-root"],
        view: this.view,
      });
      this.map.addLayer(this.layers);

      this.layerSwitcher = new LayerSwitcher({
        startActive: false,
        LayerGroupSelectStyle: "Childern",
      });
      this.map.addControl(this.layerSwitcher);

      // Main control bar
      var mainbar = new Bar();
      this.map.addControl(mainbar);

      /* Nested toobar with one control activated at once */
      var nested = new Bar({ toggleOne: true, group: false });
      mainbar.addControl(nested);

      // Add home button
      var home = new Toggle({
        html: '<i class="fa fa-home" ></i>',
        className: "edit",
        title: "Home",
        onToggle: function () {
          window.location.href = "/";
        },
      });
      nested.addControl(home);

      // Add alarm button
      var alarm = new Toggle({
        html: '<i class="fa fa-bullseye" ></i>',
        className: "edit",
        title: "Alarm",
        onToggle: function (active) {
          if (active) {
            console.log(alarm_availability.getActive());
            if (alarm_availability.getActive() == false) {
              self.show_marker = false;
            }
            self.addAlarm();
            // Add interval fetch data alarm
            self.interval_alarm = setInterval(() => {
              // Remove alarm
              self.map
                .getLayers()
                .getArray()
                .slice()
                .forEach((layer) => {
                  console.log(layer);
                  if (layer.get("name") && layer.get("name") == "Marker") {
                    self.map.removeLayer(layer);
                  }
                  clearInterval(self.ripple);
                  self.popup.hide();
                });

              // fetch alarm
              self.addAlarm();
            }, 300000);
          } else {
            // Add clear interval fetch data alarm
            clearInterval(self.interval_alarm);
            self.map
              .getLayers()
              .getArray()
              .slice()
              .forEach((layer) => {
                console.log(layer);
                if (layer.get("name") && layer.get("name") == "Marker") {
                  self.map.removeLayer(layer);
                }
                clearInterval(self.ripple);
                self.popup.hide();
              });
          }
        },
      });
      nested.addControl(alarm);

      var alarm_availability = new Toggle({
        html: '<i class="fa fa-bullseye" ></i>',
        className: "edit",
        title: "Alarm Availibity",
        onToggle: function (active) {
          if (active) {
            if (alarm.getActive() == false) {
              clearInterval(self.interval_alarm);
              self.map
                .getLayers()
                .getArray()
                .slice()
                .forEach((layer) => {
                  console.log(layer);
                  if (layer.get("name") && layer.get("name") == "Marker") {
                    self.map.removeLayer(layer);
                  }
                  clearInterval(self.ripple);
                  self.popup.hide();
                });
            }
            self.show_marker = true;
          } else {
            self.show_marker = false;
          }
        },
      });

      nested.addControl(alarm_availability);

      this.analysis = new Toggle({
        html: '<i class="fa fa-th" ></i>',
        className: "edit",
        title: "Analytic Data",
        onToggle: function (active) {
          if (active) {
            self.show_analysis = true;
          } else {
            self.show_analysis = false;
          }
        },
      });

      nested.addControl(this.analysis);

      //chart button
      this.chart_btn = new Toggle({
        html: '<i class="fas fa-chart-line" ></i>',
        className: "chart_sigmon",
        title: "Chart Sigmon",
        onToggle: function (active) {
          if (active) {
            self.showChart = true;
            self.getDataChartSigmon("4G");
            self.getDataChartSigmon("3G");
            self.getDataChartSigmon("2G");
          } else {
            self.showChart = false;
          }
        },
      });

      nested.addControl(this.chart_btn);

      this.chart_qos_btn = new Toggle({
        html: '<i class="fas fa-chart-bar" ></i>',
        className: "chart_qos",
        title: "Chart QOS",
        onToggle: function (active) {
          if (active) {
            self.showChartQOS = true;
            self.getDataChartQOS();
          } else {
            self.showChartQOS = false;
          }
        },
      });
      nested.addControl(this.chart_qos_btn);

      //ticket button
      this.ticket_btn = new Toggle({
        html: '<i class="fas fa-ticket-alt"></i>',
        className: "ticket",
        title: "Ticket",
        onToggle: function (active) {
          if (active) {
            self.showTicket = true;
          } else {
            self.showTicket = false;
          }
        },
      });
      nested.addControl(this.ticket_btn);

      /* Standard Controls */
      mainbar.addControl(
        new ZoomToExtent({
          extent: [10800580.7606, -1702730.3513, 15460182.0048, 667429.0217],
        })
      );
      mainbar.addControl(new Rotate());

      this.layerSwitcher.on("hide", (evt) => {
        console.log("hide", evt);
      });
      // mainbar.addControl(new FullScreen());

      // Legend
      // this.legend = new Legend({
      //   title: "Legend",
      // });

      // this.map.addControl(
      //   new ControlLegend({
      //     legend: this.legend,
      //     collapsible: true,
      //     collapsed: true,
      //   })
      // );
    },

    addAlarm() {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        status: "open",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: 0,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result);
          this.alarm = result.data.data;
          let data = result.data.data;

          console.log("length", data.length);
          // let iconFeatures = [];
          let markers = [];
          let iconStyle = [];

          for (var i in data) {
            markers.push(
              new Feature({
                geometry: new Point(
                  transform(
                    [
                      parseFloat(data[i].longitude),
                      parseFloat(data[i].latitude),
                    ],
                    "EPSG:4326",
                    "EPSG:3857"
                  )
                ),
                name:
                  data[i].site_name +
                  ", " +
                  data[i].address +
                  ", " +
                  data[i].severity +
                  ", " +
                  data[i].technology,

                id: data[i].id,
              })
            );
            iconStyle.push(
              new Style({
                image: new Icon({
                  src:
                    process.env.VUE_APP_API_URL +
                    data[i].cell_operator.secondary_logo,
                }),
              })
            );
            markers[i].setStyle(iconStyle[i]);

            this.map.addLayer(
              new VectorLayer({
                source: new VectorSource({
                  features: markers,
                }),
                name: "Marker",
              })
            );
          }
          // var marker = new Feature({
          //   geometry: new Point(
          //     transform([106.9407, -6.25807], "EPSG:4326", "EPSG:3857")
          //   ),
          // });
          console.log(markers);
          this.ripple = setInterval(() => {
            for (let i in markers) {
              this.flash(markers[i], 3000);
            }
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addTotalBTS(value) {
      console.log(value);

      for (let data of value) {
        this.legend.addItem({
          title: data.name,
          typeGeom: "Point",
          style: new Style({
            image: new Icon({
              src: process.env.VUE_APP_API_URL + data.secondary_logo,
              scale: 0.8,
            }),
          }),
        });
      }
    },

    getTowerCount() {
      this.loading_tower_count = true;
      // tower_count
      console.log(this.selected_location);

      let code = this.selected_location;
      // if (this.detail_location != null) {
      //   code = this.detail_location.code;
      // }
      let data = {
        connection_type: "",
        code: code,
      };
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/infragis/all-tower-count-obj`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + JwtServices.getToken(),
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            this.$swal("Opps", result.message, "error");
            return;
          }
          this.tower_count = result.data;

          console.log("this.tower_count", this.tower_count);
          this.loading_tower_count = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    flash(feature, duration) {
      let self = this;
      var start = +new Date();
      var flashGeom = feature.getGeometry().clone();
      // for (let i = 0; i < feature.length; i++) {
      //   flashGeom = feature[i].getGeometry().clone();
      // }
      var listenerKey = this.tileLayer.on("postrender", animate);
      // to remove the listener after the duration

      function animate(event) {
        const frameState = event.frameState;
        const elapsed = frameState.time - start;
        if (elapsed >= duration) {
          unByKey(listenerKey);
          return;
        }
        const vectorContext = getVectorContext(event);
        const elapsedRatio = elapsed / duration;
        // radius will be 5 at start and 30 at end.
        const radius = easeOut(elapsedRatio) * 25 + 5;
        const opacity = easeOut(1 - elapsedRatio);

        const style = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: "rgba(255, 0, 0, " + opacity + ")",
              width: 0.25 + opacity,
            }),
          }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        // tell OpenLayers to continue postrender animation
        self.map.render();
      }

      listenerKey = this.map.on("postcompose", animate);
    },

    addButtonSearch() {
      let self = this;
      let btn1 = new Button({
        html: '<i class="fa fa-search" ></i>',
        className: "search-button",
        title: "Search Button",
        handleClick: function () {
          self.overlay_search = true;
        },
      });
      this.map.addControl(btn1);
    },

    addButtonTotalTower() {
      let self = this;
      let btn1 = new Button({
        html: '<i class="fas fa-broadcast-tower" ></i>',
        className: "total-tower-button",
        title: "Total Tower",
        handleClick: function () {
          self.overlay_total_tower = true;
          if (self.tower_count.length == 0) {
            self.getTowerCount();
          }
        },
      });
      this.map.addControl(btn1);
    },

    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },

    searchLocation(val) {
      if (val.length < 3) return;

      this.isLoading = true;

      let data = {
        limit: -1,
        page: 1,
        sort: "asc",
        search: val,
      };

      // Lazily load input items
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/merger`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((res) => res.clone().json())
        .then((res) => {
          if (res.error) {
            return;
          }
          this.tower_count = [];

          this.locations = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },

    text(region) {
      return `${region.name} - ${region.code}`;
    },

    checkLocationByCode() {
      let data = {
        code: this.selected_location,
      };
      console.log(data, "Code Daerah");
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/find/code`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + JwtServices.getToken(),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.detail_location = result.data.data;
          this.location_type = result.data.loc_type;

          let longitude = null;
          let latitude = null;
          if (result.data.data.city != undefined) {
            longitude = result.data.data.city.longitude;
            latitude = result.data.data.city.latitude;

            this.view.animate({
              center: fromLonLat([parseFloat(longitude), parseFloat(latitude)]),
              duration: 2000,
              zoom: 10,
            });
          } else {
            longitude = result.data.data.longitude;
            latitude = result.data.data.latitude;

            this.view.animate({
              center: fromLonLat([parseFloat(longitude), parseFloat(latitude)]),
              duration: 2000,
              zoom: 10,
            });
          }

          console.log(data.code.length);

          const styleProvinsi = new Style({
            fill: new Fill({
              color: "rgba(38, 90, 92, 0.10)",
            }),
            stroke: new Stroke({
              color: "#113C4A",
              width: 1,
            }),
          });

          const styleKota = new Style({
            fill: new Fill({
              color: "rgba(15, 52, 96, 0.10)",
            }),
            stroke: new Stroke({
              color: "#16213E",
              width: 1,
            }),
          });

          const styleKecamatan = new Style({
            fill: new Fill({
              color: "rgba(199, 44, 65, 0.10)",
            }),
            stroke: new Stroke({
              color: "#801336",
              width: 1,
            }),
          });

          const styleKelurahan = new Style({
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
              color: "#000000",
              width: 1,
            }),
          });

          switch (data.code.length) {
            case 2:
              this.map.removeLayer(this.layer_location);
              this.layer_location = new VectorLayer({
                source: new VectorSource({
                  format: new GeoJSON(),
                  url: `https://infragis.kominfo.go.id/geoserver/geonode/wfs?CQL_Filter=kdprov%20LIKE%20%27${data.code}%25%27&service=WFS&version=1.1.0&request=GetFeature&typeName=geonode%3AF_ADM_PROVINSI&maxFeatures=500&outputFormat=application%2Fjson`,
                }),
                style: styleProvinsi,
              });

              this.layer_location.set("name", "Provinsi");
              this.map.addLayer(this.layer_location);
              break;

            case 5:
              this.map.removeLayer(this.layer_location);
              this.layer_location = new VectorLayer({
                source: new VectorSource({
                  format: new GeoJSON(),
                  url: `https://infragis.kominfo.go.id/geoserver/geonode/wfs?CQL_Filter=kdepum%20LIKE%20%27${data.code}%25%27&service=WFS&version=1.1.0&request=GetFeature&typeName=geonode%3AF_ADM_KABUPATEN&maxFeatures=500&outputFormat=application%2Fjson`,
                }),
                style: styleKota,
              });

              this.layer_location.set("name", "Kota");
              this.map.addLayer(this.layer_location);
              break;

            case 8:
              this.map.removeLayer(this.layer_location);
              this.layer_location = new VectorLayer({
                source: new VectorSource({
                  format: new GeoJSON(),
                  url: `https://infragis.kominfo.go.id/geoserver/geonode/wfs?CQL_Filter=kdepum%20LIKE%20%27${data.code}%25%27&service=WFS&version=1.1.0&request=GetFeature&typeName=geonode%3AF_ADM_KECAMATAN&maxFeatures=500&outputFormat=application%2Fjson`,
                }),
                style: styleKecamatan,
              });

              this.layer_location.set("name", "Kecamatan");
              this.map.addLayer(this.layer_location);
              break;

            case 13:
              this.map.removeLayer(this.layer_location);
              this.layer_location = new VectorLayer({
                source: new VectorSource({
                  format: new GeoJSON(),
                  name: "Kelurahan",
                  url: `https://infragis.kominfo.go.id/geoserver/geonode/wfs?CQL_Filter=kdds%20LIKE%20%27${data.code}%25%27&service=WFS&version=1.1.0&request=GetFeature&typeName=geonode%3Aa__83285ONLY&maxFeatures=500&outputFormat=application%2Fjson`,
                }),
                style: styleKelurahan,
              });

              this.layer_location.set("name", "Kelurahan");
              this.map.addLayer(this.layer_location);
              break;
          }

          // let me = new Feature({
          //   geometry: new Point(
          //     fromLonLat([parseFloat(longitude), parseFloat(latitude)])
          //   ),
          //   name: "",
          //   id: self.near_me + 1,
          // });

          // let me_style = new Style({
          //   image: new Icon({
          //     src: NearMe,
          //   }),
          // });

          // me.setStyle(me_style);

          // this.layer_location = new VectorLayer({
          //   source: new VectorSource({
          //     features: [me],
          //   }),
          //   name: "",
          // });
          // this.map.addLayer(this.layer_location);

          this.overlay_search = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    resetSearch() {
      this.detail_location = null;
      this.location_type = null;
      this.search = "";
      this.selected_location = null;
      this.map.removeLayer(this.layer_location);
    },

    zoomToLocation() {
      let longitude = this.$route.query.longitude;
      let latitude = this.$route.query.latitude;
      let self = this;

      if (longitude == undefined || latitude == undefined) {
        return;
      }
      this.view.animate({
        center: fromLonLat([parseFloat(longitude), parseFloat(latitude)]),
        duration: 2000,
        zoom: 18,
      });

      let me = new Feature({
        geometry: new Point(
          fromLonLat([parseFloat(longitude), parseFloat(latitude)])
        ),
        name: "Near Me",
        id: self.near_me + 1,
      });

      let me_style = new Style({
        image: new Icon({
          src: NearMe,
        }),
      });

      me.setStyle(me_style);

      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: [me],
          }),
          name: "Near Me",
        })
      );
    },

    closeChart() {
      this.showChart = false;
      this.chart_btn.setActive(false);
      this.tabTechnology = null;
    },

    closeChartQOS() {
      this.showChartQOS = false;
      this.chart_qos_btn.setActive(false);
      this.tabTechnologyQOS = null;
    },

    getDataChartSigmon(tech) {
      this.series_sigmon_2g_download = [];
      this.series_sigmon_2g_upload = [];
      this.series_sigmon_2g_signalstrength = [];

      this.series_sigmon_3g_download = [];
      this.series_sigmon_3g_upload = [];
      this.series_sigmon_3g_signalstrength = [];

      this.series_sigmon_4g_download = [];
      this.series_sigmon_4g_upload = [];
      this.series_sigmon_4g_signalstrength = [];
      // Fetch data chart
      let code = "";
      if (this.detail_location != null) {
        code = this.detail_location.code;
      }
      let data = {
        connection_type: tech,
        code: code,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/home/chart/qoe`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + JwtServices.getToken(),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            this.$swal("Opps", result.message, "error");
            return;
          }
          this.series_sigmon[tech] = result.data;

          this.mappingDataChartSigmon(tech);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    mappingDataChartSigmon(tech) {
      let categories = [];
      for (const raw of this.series_sigmon[tech]) {
        let data = {};
        let data_download = {
          name: "",
          data: [],
        };
        let data_upload = {
          name: "",
          data: [],
        };
        let data_signalstrength = {
          name: "",
          data: [],
        };
        data.name = raw.cell_operator.name;
        // handle category
        for (const dr of raw.data) {
          if (categories.length <= 11) {
            let x = moment(dr.month).format("MMM YY");
            categories.push(x);
          }
          // handle data
          if (dr.download_speed == undefined) {
            dr.download_speed = null;
          }
          data_download.name = data.name;
          data_download.data.push(dr.download_speed);

          if (dr.upload_speed == undefined) {
            dr.upload_speed = null;
          }
          data_upload.name = data.name;
          data_upload.data.push(dr.upload_speed);

          if (dr.signal_strength == undefined) {
            dr.signal_strength = null;
          }
          data_signalstrength.name = data.name;
          data_signalstrength.data.push(dr.signal_strength);
        }

        switch (tech) {
          case "2G":
            this.series_sigmon_2g_download.push(data_download);
            this.series_sigmon_2g_upload.push(data_upload);
            this.series_sigmon_2g_signalstrength.push(data_signalstrength);
            break;
          case "3G":
            this.series_sigmon_3g_download.push(data_download);
            this.series_sigmon_3g_upload.push(data_upload);
            this.series_sigmon_3g_signalstrength.push(data_signalstrength);
            break;
          case "4G":
            this.series_sigmon_4g_download.push(data_download);
            this.series_sigmon_4g_upload.push(data_upload);
            this.series_sigmon_4g_signalstrength.push(data_signalstrength);
            break;

          default:
            break;
        }
      }
      this.renderChartSigmon(tech, categories);
    },

    renderChartSigmon(tech, categories) {
      switch (tech) {
        case "2G": {
          // Download
          this.componentKey2G["download"] += 7;
          let chart2gdownload = new ApexCharts(this.$refs.sigmon2gdownload, {
            chart: {
              height: 290,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_2g_download,
          });
          // Upload
          this.componentKey2G["upload"] += 7;
          let chart2gupload = new ApexCharts(this.$refs.sigmon2gupload, {
            chart: {
              height: 290,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_2g_upload,
          });
          // Signal Strength
          this.componentKey2G["signal"] += 7;
          let chart2gsignal = new ApexCharts(this.$refs.sigmon2gsignal, {
            chart: {
              height: 280,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_2g_signalstrength,
          });
          chart2gdownload.render();
          chart2gupload.render();
          chart2gsignal.render();
          break;
        }
        case "3G": {
          // Download
          this.componentKey3G["download"] += 3;
          let chart3gdownload = new ApexCharts(this.$refs.sigmon3gdownload, {
            chart: {
              height: 290,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_3g_download,
          });
          // Upload
          this.componentKey3G["upload"] += 3;
          let chart3gupload = new ApexCharts(this.$refs.sigmon3gupload, {
            chart: {
              height: 290,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_3g_upload,
          });
          // Signal Strength
          this.componentKey3G["signal"] += 3;
          let chart3gsignal = new ApexCharts(this.$refs.sigmon3gsignal, {
            chart: {
              height: 280,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_3g_signalstrength,
          });
          chart3gdownload.render();
          chart3gupload.render();
          chart3gsignal.render();
          break;
        }
        case "4G": {
          // Download
          this.componentKey4G["download"] += 2;
          let chart4gdownload = new ApexCharts(this.$refs.sigmon4gdownload, {
            chart: {
              height: 290,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_4g_download,
          });
          // Upload
          this.componentKey4G["upload"] += 2;
          let chart4gupload = new ApexCharts(this.$refs.sigmon4gupload, {
            chart: {
              height: 290,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_4g_upload,
          });
          // Signal Strength
          this.componentKey4G["signal"] += 2;
          let chart4gsignal = new ApexCharts(this.$refs.sigmon4gsignal, {
            chart: {
              height: 280,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "straight",
            },
            colors: [
              "#E04949",
              "#F9E307",
              "#FA739F",
              "#AFAFAF",
              "#0044C8",
              "#FF7232",
            ],
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: categories,
            },
            series: this.series_sigmon_4g_signalstrength,
          });

          chart4gdownload.render();
          chart4gupload.render();
          chart4gsignal.render();
          break;
        }
        default:
          break;
      }
    },

    getDataChartQOS() {
      this.series_qos_download = [];
      this.series_qos_upload = [];
      this.series_qos_signalstrength_4g = [];
      this.series_qos_signalstrength_3g = [];
      this.series_qos_signalstrength_2g = [];

      // Fetch data chart
      let code = "";
      if (this.detail_location != null) {
        code = this.detail_location.code;
      }
      let data = {
        code: code,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/home/chart/qos`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + JwtServices.getToken(),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            this.$swal("Opps", result.message, "error");
            return;
          }
          this.series_qos = result.data;
          this.mappingDataChartQOS();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    closeTicket() {
      this.showTicket = false;
      this.ticket_btn.setActive(false);
    },

    getTicket() {
      const data = {
        start_date: "",
        end_date: "",
        cell_operator_type: 0,
      };

      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/operators`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtServices.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.ticket = result.data;
          let arr = [];
          for (var i = 0; i < result.data.length; i++) {
            arr[i] = [];
            for (let data of result.data[i].data) {
              arr[i].push(data.count);
              this.ticket[i].total = arr[i].reduce((a, b) => a + b, 0);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    mappingDataChartQOS() {
      let categories = [];
      for (const raw of this.series_qos) {
        let data = {};
        let data_download = {
          name: "",
          data: [],
        };
        let data_upload = {
          name: "",
          data: [],
        };
        let data_signalstrength_4g = {
          name: "",
          data: [],
        };
        let data_signalstrength_3g = {
          name: "",
          data: [],
        };
        let data_signalstrength_2g = {
          name: "",
          data: [],
        };

        data.name = raw.cell_operator.name;

        // handle category
        for (const dr of raw.data) {
          if (categories.length <= 11) {
            let x = moment(dr.month).format("MMM YY");
            categories.push(x);
          }
          // handle data
          if (dr.download_speed == undefined) {
            dr.download_speed = null;
          }
          data_download.name = data.name;
          data_download.data.push(dr.download_speed);

          if (dr.upload_speed == undefined) {
            dr.upload_speed = null;
          }
          data_upload.name = data.name;
          data_upload.data.push(dr.upload_speed);

          // ss 4g
          if (dr.signal_strength_4g == undefined) {
            dr.signal_strength_4g = null;
          }
          data_signalstrength_4g.name = data.name;
          data_signalstrength_4g.data.push(dr.signal_strength_4g);

          // ss 3g
          if (dr.signal_strength_3g == undefined) {
            dr.signal_strength_3g = null;
          }
          data_signalstrength_3g.name = data.name;
          data_signalstrength_3g.data.push(dr.signal_strength_3g);

          // ss 2g
          if (dr.signal_strength_2g == undefined) {
            dr.signal_strength_2g = null;
          }
          data_signalstrength_2g.name = data.name;
          data_signalstrength_2g.data.push(dr.signal_strength_2g);
        }

        this.series_qos_download.push(data_download);
        this.series_qos_upload.push(data_upload);
        this.series_qos_signalstrength_4g.push(data_signalstrength_4g);
        this.series_qos_signalstrength_3g.push(data_signalstrength_3g);
        this.series_qos_signalstrength_2g.push(data_signalstrength_2g);
      }
      this.renderChartQOS(categories);
    },

    renderChartQOS(categories) {
      // Download
      this.componentKeyQOS["download"] += 2;
      let chartdownload = new ApexCharts(this.$refs.qosdownload, {
        chart: {
          height: 290,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        colors: [
          "#E04949",
          "#F9E307",
          "#FA739F",
          "#AFAFAF",
          "#0044C8",
          "#FF7232",
        ],
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: categories,
        },
        series: this.series_qos_download,
      });
      // Upload
      this.componentKeyQOS["upload"] += 2;
      let chartupload = new ApexCharts(this.$refs.qosupload, {
        chart: {
          height: 290,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        colors: [
          "#E04949",
          "#F9E307",
          "#FA739F",
          "#AFAFAF",
          "#0044C8",
          "#FF7232",
        ],
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: categories,
        },
        series: this.series_qos_upload,
      });
      // Signal Strength 4g
      this.componentKeyQOS["qossignal4g"] += 2;
      let chart4gsignal = new ApexCharts(this.$refs.qossignal4g, {
        chart: {
          height: 280,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        colors: [
          "#E04949",
          "#F9E307",
          "#FA739F",
          "#AFAFAF",
          "#0044C8",
          "#FF7232",
        ],
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: categories,
        },
        series: this.series_qos_signalstrength_4g,
      });
      // Signal Strength 3g
      this.componentKeyQOS["qossignal3g"] += 2;
      let chart3gsignal = new ApexCharts(this.$refs.qossignal3g, {
        chart: {
          height: 280,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        colors: [
          "#E04949",
          "#F9E307",
          "#FA739F",
          "#AFAFAF",
          "#0044C8",
          "#FF7232",
        ],
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: categories,
        },
        series: this.series_qos_signalstrength_3g,
      });
      // Signal Strength 2g
      this.componentKeyQOS["qossignal2g"] += 2;
      let chart2gsignal = new ApexCharts(this.$refs.qossignal2g, {
        chart: {
          height: 280,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        colors: [
          "#E04949",
          "#F9E307",
          "#FA739F",
          "#AFAFAF",
          "#0044C8",
          "#FF7232",
        ],
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: categories,
        },
        series: this.series_qos_signalstrength_2g,
      });

      if (this.chart_rendered[`qos_download`] == undefined) {
        chartdownload.render();
      } else {
        this.chart_rendered[`qos_download`].updateSeries(
          this.series_qos_download
        );
      }

      if (this.chart_rendered[`qos_upload`] == undefined) {
        chartupload.render();
      } else {
        this.chart_rendered[`qos_upload`].updateSeries(this.series_qos_upload);
      }

      if (this.chart_rendered[`qos_4gsignal`] == undefined) {
        chart4gsignal.render();
      } else {
        this.chart_rendered[`qos_4gsignal`].updateSeries(
          this.series_qos_signalstrength_4g
        );
      }

      if (this.chart_rendered[`qos_3gsignal`] == undefined) {
        chart3gsignal.render();
      } else {
        this.chart_rendered[`qos_3gsignal`].updateSeries(
          this.series_qos_signalstrength_3g
        );
      }

      if (this.chart_rendered[`qos_2gsignal`] == undefined) {
        chart2gsignal.render();
      } else {
        this.chart_rendered[`qos_2gsignal`].updateSeries(
          this.series_qos_signalstrength_2g
        );
      }
    },

    async getMapFilter() {
      await fetch("https://infragis.kominfo.go.id/webapi/geonode/layers")
        .then((response) => response.json())
        .then((result) => {
          for (let item of result.objects) {
            console.log(item.keywords[0]);

            switch (item.keywords[0]) {
              case "coverage":
                this.coverageLayer(item);
                break;
              case "BTS":
                this.btsLayer(item);
                break;
              case "FO":
                this.foLayer(item);
                break;
              case undefined:
                this.othersLayer(item);
                break;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    coverageLayer(value) {
      console.log(value);

      if (value.category__gn_description.includes("Band")) {
        if (value.category__gn_description.includes("2G")) {
          this.coverage_layer_2G.push(
            new TileLayer({
              title: value.title,
              visible: false,
              source: new TileWMS({
                url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
                params: {
                  LAYERS: value.alternate,
                  TILED: true,
                  title: value.keywords[0],
                  transparent: true,
                },
                projection: "EPSG:900913",
                serverType: "geoserver",
              }),
            })
          );
        }
        if (value.category__gn_description.includes("3G")) {
          this.coverage_layer_3G.push(
            new TileLayer({
              title: value.title,
              visible: false,
              source: new TileWMS({
                url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
                params: {
                  LAYERS: value.alternate,
                  TILED: true,
                  title: value.keywords[0],
                  transparent: true,
                },
                projection: "EPSG:900913",
                serverType: "geoserver",
              }),
            })
          );
        }
        if (value.category__gn_description.includes("4G")) {
          this.coverage_layer_4G.push(
            new TileLayer({
              title: value.title,
              visible: false,
              source: new TileWMS({
                url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
                params: {
                  LAYERS: value.alternate,
                  TILED: true,
                  title: value.keywords[0],
                  transparent: true,
                },
                projection: "EPSG:900913",
                serverType: "geoserver",
              }),
            })
          );
        }
      }

      if (value.category__gn_description.includes("Clean")) {
        if (value.category__gn_description.includes("2G")) {
          this.coverage_layer_2G_region.push(
            new TileLayer({
              title: value.title,
              visible: false,
              source: new TileWMS({
                url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
                params: {
                  LAYERS: value.alternate,
                  TILED: true,
                  title: value.keywords[0],
                  transparent: true,
                },
                projection: "EPSG:900913",
                serverType: "geoserver",
              }),
            })
          );
        }
        if (value.category__gn_description.includes("3G")) {
          this.coverage_layer_3G_region.push(
            new TileLayer({
              title: value.title,
              visible: false,
              source: new TileWMS({
                url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
                params: {
                  LAYERS: value.alternate,
                  TILED: true,
                  title: value.keywords[0],
                  transparent: true,
                },
                projection: "EPSG:900913",
                serverType: "geoserver",
              }),
            })
          );
        }
        if (value.category__gn_description.includes("4G")) {
          this.coverage_layer_4G_region.push(
            new TileLayer({
              title: value.title,
              visible: false,
              source: new TileWMS({
                url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
                params: {
                  LAYERS: value.alternate,
                  TILED: true,
                  title: value.keywords[0],
                  transparent: true,
                },
                projection: "EPSG:900913",
                serverType: "geoserver",
              }),
            })
          );
        }
      }
    },

    btsLayer(value) {
      if (value.category__gn_description.includes("2G")) {
        this.bts_layer_2G.push(
          new TileLayer({
            title: value.title,
            visible: false,
            source: new TileWMS({
              url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
              params: {
                LAYERS: value.alternate,
                TILED: true,
                FORMAT: "image/png8",
                title: value.keywords[0],
                transparent: true,
              },
              projection: "EPSG:900913",
              serverType: "geoserver",
            }),
          })
        );
      }

      if (value.category__gn_description.includes("3G")) {
        this.bts_layer_3G.push(
          new TileLayer({
            title: value.title,
            visible: false,
            source: new TileWMS({
              url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
              params: {
                LAYERS: value.alternate,
                TILED: true,
                FORMAT: "image/png8",
                title: value.keywords[0],
                transparent: true,
              },
              projection: "EPSG:900913",
              serverType: "geoserver",
            }),
          })
        );
      }
      if (value.category__gn_description.includes("4G")) {
        this.bts_layer_4G.push(
          new TileLayer({
            title: value.title,
            visible: false,
            source: new TileWMS({
              url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
              params: {
                LAYERS: value.alternate,
                TILED: true,
                FORMAT: "image/png8",
                title: value.keywords[0],
                transparent: true,
              },
              projection: "EPSG:900913",
              serverType: "geoserver",
            }),
          })
        );
      }
    },

    othersLayer(value) {
      if (value.category__gn_description == undefined) {
        this.others_layer.push(
          new TileLayer({
            title: value.title,
            visible: false,
            source: new TileWMS({
              url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
              params: {
                LAYERS: value.alternate,
                TILED: true,
                title: value.keywords[0],
                transparent: true,
              },
              projection: "EPSG:900913",
              serverType: "geoserver",
            }),
          })
        );
      }
    },

    foLayer(value) {
      this.fo_layer.push(
        new TileLayer({
          title: value.title,
          visible: false,
          source: new TileWMS({
            url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
            params: {
              LAYERS: value.alternate,
              TILED: true,
              title: value.keywords[0],
              transparent: true,
            },
            projection: "EPSG:900913",
            serverType: "geoserver",
          }),
        })
      );
    },

    addFOLayer() {
      let foLayer = new LayerGroup({
        title: "FO",
        fold: "close",
        layers: this.fo_layer,
      });
      this.map.addLayer(foLayer);
    },

    addOthersLayer() {
      let otherLayer = new LayerGroup({
        title: "Lainnya",
        fold: "close",
        layers: this.others_layer,
      });
      this.map.addLayer(otherLayer);
    },

    addCoverageLayer() {
      for (let coverage of this.coverage) {
        this.coverage_layer = new LayerGroup({
          title: coverage.title,
          fold: "close",
          layers: [
            new LayerGroup({
              title: coverage.layers[0].title,
              fold: "close",
              layers: [
                new LayerGroup({
                  title: coverage.layers[0].layers[0].title,
                  fold: "close",
                  layers: this.coverage_layer_2G,
                }),
                new LayerGroup({
                  title: coverage.layers[0].layers[1].title,
                  fold: "close",
                  layers: this.coverage_layer_3G,
                }),
                new LayerGroup({
                  title: coverage.layers[0].layers[2].title,
                  fold: "close",
                  layers: this.coverage_layer_4G,
                }),
              ],
            }),
            new LayerGroup({
              title: coverage.layers[1].title,
              fold: "close",
              layers: [
                new LayerGroup({
                  title: coverage.layers[1].layers[0].title,
                  fold: "close",
                  layers: this.coverage_layer_2G_region,
                }),
                new LayerGroup({
                  title: coverage.layers[1].layers[1].title,
                  fold: "close",
                  layers: this.coverage_layer_3G_region,
                }),
                new LayerGroup({
                  title: coverage.layers[1].layers[2].title,
                  fold: "close",
                  layers: this.coverage_layer_4G_region,
                }),
              ],
            }),
          ],
        });
      }

      this.map.addLayer(this.coverage_layer);
    },

    addBTSlayer() {
      let btsLayer = new LayerGroup({
        title: "BTS",
        fold: "close",
        layers: [
          new LayerGroup({
            title: "2G",
            fold: "close",
            layers: this.bts_layer_2G,
          }),
          new LayerGroup({
            title: "3G",
            fold: "close",
            layers: this.bts_layer_3G,
          }),
          new LayerGroup({
            title: "4G",
            fold: "close",
            layers: this.bts_layer_4G,
          }),
        ],
      });

      this.map.addLayer(btsLayer);
    },

    closeDrawerInfo() {
      if (this.tower_count.length == 0) return;
      this.overlay_total_tower = false;
    },

    alarmAvailability() {
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
        start_date: "",
        end_date: "",
        cell_operator_id: 0,
        status: "open",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
        search: "",
      };

      // let place = [];
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          for (let data of result.data.data) {
            this.place.push({
              url:
                process.env.VUE_APP_API_URL + data.cell_operator.secondary_logo,

              position: [
                parseFloat(data.user_information.full_address.longitude),
                parseFloat(data.user_information.full_address.latitude),
              ],
              data: data,
            });
          }

          this.$nextTick(() => {
            for (let key in this.place) {
              console.log(fromLonLat(this.place[key].position));
              this.map.addOverlay(
                new Overlay({
                  position: fromLonLat(this.place[key].position),
                  positioning: "center-center",
                  element: document.getElementById(`marker-${key}`),
                  stopEvent: false,
                })
              );
            }
          });

          // console.log(this.place);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleAlarmDetail(value) {
      this.view.animate({
        center: transform(value.position, "EPSG:4326", "EPSG:900913"),
        duration: 2000,
        zoom: 16,
      });

      setTimeout(() => {
        this.popup.show(
          transform(value.position, "EPSG:4326", "EPSG:900913"),
          value.data.user_information.full_address.address
        );
      }, 3000);
    },

    closeAnalysis() {
      this.show_analysis = false;
      this.analysis.setActive(false);
      this.selected_tech = 0;
      this.selected_opsel_temp = 0;
      this.province = "";
      this.city = "";
      this.district = "";
      this.show_data = false;
      this.filter_selected = true;
      this.selected_opsel_temp = 0;
      this.selected_tech = 0;
      this.selected_city = 0;
      this.selected_province = 0;
      this.selected_district = 0;

      this.message = "";
      this.$store.commit(RESET_FILTER);
    },

    addOpselAnaylysis(value) {
      for (let data of this.item_opsel) {
        if (value == data.id) {
          this.opsel_selected = data;
        }
      }
    },

    applyFilter() {
      this.show_data = true;
      this.filter_selected = false;

      this.skeleton = true;
      console.log(this.detail_location);

      if (this.detail_location.city_id != undefined) {
        this.selected_district = this.detail_location.id;
        this.selected_city = this.detail_location.city.id;
        this.selected_province = this.detail_location.province.id;

        this.district = this.detail_location.name;
        this.province = this.detail_location.province.name;
        this.city = this.detail_location.city.name;
      } else if (this.detail_location.province_id != undefined) {
        this.selected_city = this.detail_location.id;
        this.selected_province = this.detail_location.province.id;

        this.province = this.detail_location.province.name;
        this.city = this.detail_location.name;
      } else {
        this.selected_province = this.detail_location.id;
        this.province = this.detail_location.name;
      }

      this.getCovQoESS();
      this.getCovQoESpeedTest();
    },

    resetFilter() {
      this.show_data = false;
      this.filter_selected = true;
      this.selected_opsel_temp = 0;
      this.selected_tech = 0;

      this.message = "";
      this.$store.commit(RESET_FILTER);
    },

    selectedTech(value) {
      console.log(value);
      for (let item of this.technology) {
        if (value == item.id) {
          this.technology_selected = item.name;
        }
      }
    },

    getCovQoESS() {
      const data = {
        start_date: "",
        end_date: "",
        cell_operator_id: this.selected_opsel_temp,
        connection_type: this.technology_selected,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: 0,
        q_time: "Q4 2020",
      };

      fetch(process.env.VUE_APP_API_URL + `api/v1/id/analysis/cov-qoe-ss`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.data == null) {
            this.filter_selected = true;
          }
          this.cov_qoe_ss = result.data.analysis;
          this.skeleton = false;
          console.log(this.cov_qoe_ss);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCovQoESpeedTest() {
      const data = {
        start_date: "",
        end_date: "",
        cell_operator_id: this.selected_opsel_temp,
        connection_type: this.technology_selected,
        province_id: this.selected_province,
        city_id: this.selected_city,
        district_id: this.selected_district,
        sub_district_id: 0,
        q_time: "Q4 2020",
      };

      fetch(process.env.VUE_APP_API_URL + `api/v1/id/analysis/cov-qoe-dl`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.data == null) {
            this.filter_selected = true;
            this.message = result.message;
          }
          this.cov_qoe_dl = result.data.analysis;
          this.skeleton = false;
          console.log(this.cov_qoe_ss);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="css">
.marker {
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: orange;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(255, 0, 0, 0.4);
  animation: pulse 3s infinite;
}

.marker-1 {
  background: rgb(77, 77, 77) !important;
}

.marker-2 {
  background: rgb(1, 29, 190) !important;
}

.marker-3 {
  background: rgb(253, 249, 4) !important;
}

.marker-5 {
  background: rgb(190, 1, 1) !important;
}

.marker-6 {
  background: rgb(190, 1, 181) !important;
}

.marker:hover {
  animation: none;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
  }

  70% {
    box-shadow: 0 0 0 50px rgba(255, 0, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

.layer-switcher {
  top: 1%;
}

.layer-switcher button {
  float: right;
  z-index: 1;
  width: 38px;
  height: 38px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACE1BMVEX///8A//8AgICA//8AVVVAQID///8rVVVJtttgv98nTmJ2xNgkW1ttyNsmWWZmzNZYxM4gWGgeU2JmzNNr0N1Rwc0eU2VXxdEhV2JqytQeVmMhVmNoydUfVGUgVGQfVGQfVmVqy9hqy9dWw9AfVWRpydVry9YhVmMgVGNUw9BrytchVWRexdGw294gVWQgVmUhVWPd4N6HoaZsy9cfVmQgVGRrytZsy9cgVWQgVWMgVWRsy9YfVWNsy9YgVWVty9YgVWVry9UgVWRsy9Zsy9UfVWRsy9YgVWVty9YgVWRty9Vsy9aM09sgVWRTws/AzM0gVWRtzNYgVWRuy9Zsy9cgVWRGcHxty9bb5ORbxdEgVWRty9bn6OZTws9mydRfxtLX3Nva5eRix9NFcXxOd4JPeINQeIMiVmVUws9Vws9Vw9BXw9BYxNBaxNBbxNBcxdJexdElWWgmWmhjyNRlx9IqXGtoipNpytVqytVryNNrytZsjZUuX210k5t1y9R2zNR3y9V4lp57zth9zdaAnKOGoaeK0NiNpquV09mesrag1tuitbmj1tuj19uktrqr2d2svcCu2d2xwMO63N+7x8nA3uDC3uDFz9DK4eHL4eLN4eIyYnDX5OM5Z3Tb397e4uDf4uHf5uXi5ePi5+Xj5+Xk5+Xm5+Xm6OY6aHXQ19fT4+NfhI1Ww89gx9Nhx9Nsy9ZWw9Dpj2abAAAAWnRSTlMAAQICAwQEBgcIDQ0ODhQZGiAiIyYpKywvNTs+QklPUlNUWWJjaGt0dnd+hIWFh4mNjZCSm6CpsbW2t7nDzNDT1dje5efr7PHy9PT29/j4+Pn5+vr8/f39/f6DPtKwAAABTklEQVR4Xr3QVWPbMBSAUTVFZmZmhhSXMjNvkhwqMzMzMzPDeD+xASvObKePPa+ffHVl8PlsnE0+qPpBuQjVJjno6pZpSKXYl7/bZyFaQxhf98hHDKEppwdWIW1frFnrxSOWHFfWesSEWC6R/P4zOFrix3TzDFLlXRTR8c0fEEJ1/itpo7SVO9Jdr1DVxZ0USyjZsEY5vZfiiAC0UoTGOrm9PZLuRl8X+Dq1HQtoFbJZbv61i+Poblh/97TC7n0neCcK0ETNUrz1/xPHf+DNAW9Ac6t8O8WH3Vp98f5lCaYKAOFZMLyHL4Y0fe319idMNgMMp+zWVSybUed/+/h7I4wRAG1W6XDy4XmjR9HnzvDRZXUAYDFOhC1S/Hh+fIXxen+eO+AKqbs+wAo30zDTDvDxKoJN88sjUzDFAvBzEUGFsnADoIvAJzoh2BZ8sner+Ke/vwECuQAAAABJRU5ErkJggg==)
    /*logo.png*/;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 2px;
  background-color: rgba(0, 60, 136, 0.5);
  color: black;
  border: none;
}

.layer-switcher .panel {
  background-color: rgba(0, 60, 136, 0.5);
  color: white;
  font-size: 16px;
}

.ol-zoom {
  top: 1%;
  left: 0.6%;
  bottom: unset !important;
}

.ol-geocoder.gcd-gl-container {
  top: 6em;
}

.ol-geocoder .gcd-gl-btn {
  position: absolute;
  width: 1.5625em;
  height: 1.5625em;
  top: 0.2em;
  left: 0.2em;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABPUlEQVQoU41SwXHCQAzUHh58eoUOIBWEDkI6oAToIKkg7iAuwakgpAIowXRACcnrzp6BzchjMx4wE/S6kW5XK60gvQghzJIkmVoqSZI9gJ9+/fINS5Cc1HX9QXIlIr/tpwcRyb33b7cIGnAIYQdg4pxbjcfj0nJ1Xc+Px+PGObdN03Q9RIAQwgpAnqbp7FKmjQGgJLlU1d2V7BjjRkQO3vvXIXarkyxVNbsCm2QR2Q0V7XOMMReRmfd+OQQubN6hYgs22ZtbnRcAtiRfLueqqmpJ8ovko6oeBq0KIWQA3gFkzrlmMafTaUEyI/mpqmbhVTRWWbRdbClPbeobQNES5KPRqOxs7DBn8K1DsAOKMZYApiTXqlrcDe4d0XN7jWeCfzt351tVle2iGalTcBd4gGDvvZ/fDe4RmCOFLe8Pr7mvEP2N9PQAAAAASUVORK5CYII=);
  background-repeat: no-repeat;
  background-position: 50%;
}

.search-button {
  position: absolute;
  top: 10rem;
  left: 0.6%;
}

.total-tower-button {
  position: absolute;
  bottom: 2%;
  left: 0.6%;
}

#location-text {
  position: absolute;
  top: 0.7%;
  left: 3%;
  z-index: 2;
}

.ol-overlay.menu {
  width: 30%;
  background: #fff;
  color: #333;
  box-shadow: 0px 0px 5px #000;
  padding: 0.5em;
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
}

.search-button button,
button.ol-zoom-in,
button.ol-zoom-out,
.total-tower-button button,
.layer-switcher button,
.ol-control button {
  height: 70px;
  width: 70px;
  background-color: rgba(0, 60, 136, 0.5) !important;
}

td.text-center,
th.text-center,
th.text-left {
  font-weight: bold !important;
  font-size: x-large !important;
}

.text-header-total-bts {
  font-size: x-large !important;
}

/* On Tablet */
@media only screen and (max-width: 1280px) {
  /* td.text-center,
  th.text-center,
  th.text-left {
    font-weight: bold !important;
    font-size: x-large !important;
  }

  .text-header-total-bts {
    font-size: x-large !important;
  } */

  .search-button button,
  button.ol-zoom-in,
  button.ol-zoom-out,
  .total-tower-button button,
  .layer-switcher button,
  .ol-control button {
    height: 70px;
    width: 70px;
  }
  /*
  .layer-switcher button {
    background-size: cover;
  } */
  .search-button {
    position: absolute;
    top: 10rem;
    left: 0.6%;
  }
}

/* On Mobile */
@media only screen and (max-width: 600px) {
  .ol-overlay.menu {
    width: 100%;
    background: #fff;
    color: #333;
    box-shadow: 0px 0px 5px #000;
    padding: 0.5em;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
  }

  .search-button {
    position: absolute;
    top: 8%;
    left: 0.6%;
  }

  .total-tower-button {
    position: absolute;
    bottom: 1%;
    left: 0.6%;
  }

  .ol-zoom {
    top: 1%;
    left: 0.6%;
  }

  #location-text {
    position: absolute;
    top: 2%;
    left: 40%;
    transform: translateX(-40%);
    z-index: 2;
  }

  .layer-switcher .panel {
    background-color: rgba(0, 60, 136, 0.5);
    color: white;
    font-size: 12px;
    width: 200px;
  }

  .layer-switcher {
    top: 15em;
  }

  #mapLegends {
    position: absolute;
    z-index: 99;
    bottom: 0;
    right: 1%;
  }

  .layer-switcher {
    top: 1%;
  }
}

/* style the close box */
.ol-overlay.menu .ol-closebox {
  color: #369;
  left: 1em;
  top: 0.5em;
}
.ol-overlay.menu .ol-closebox:before {
  content: "\f0c9";
  font-family: FontAwesome;
}
#menu {
  padding-top: 1.5em;
  font-size: 0.9em;
}

/* menu button */
.ol-control.menu {
  top: 1%;
  left: 0.6%;
}

.ol-control.menu i {
  color: #fff;
}

.ol-rotate {
  right: 3em;
}
.ol-touch .ol-rotate {
  right: 3.5em;
}
/**/
.ol-overlay img {
  max-width: 90%;
}
.data,
.data p {
  margin: 0;
  text-align: center;
  font-size: 0.9em;
}

.data {
  height: 120vh;
  overflow-y: auto;
}

.legend-2.ol-control.ol-legend {
  bottom: 0.5em;
  right: 0.5em;
  z-index: 1;
  max-height: 90%;
  max-width: 90%;
  overflow-x: hidden;
  overflow-y: auto;
}

/* popup style */
.ol-popup {
  max-width: 300px;
  min-width: 100px;
  min-height: 1em;
}

/* poppup content */
.ol-popup-content {
  font-size: 12px;
}
/* Image on popup */
.ol-popup img {
  float: left;
  margin: 0 0.5em 0 0;
  max-width: 100px;
  max-height: 100px;
}
/* no image content tooltips */
.ol-popup.tooltips img {
  display: none;
}
/* Custom red style (tips) */
.ol-popup.red > div {
  background-color: red;
}
.ol-popup.red .anchor {
  color: red;
}

/* Custom orange style (tips) */
.ol-popup.tips.orange > div {
  border-color: #da7;
  background-color: #eca;
}
.ol-popup.tips.orange .anchor {
  color: #da7;
}

/* orange style (default) */
.ol-popup.default.orange > div {
  border: 4px solid #f96;
}
.ol-popup.default.orange .anchor {
  margin: -10px 22px;
}
.ol-popup.default.orange .anchor::after {
  margin: 5px -11px;
}
.ol-popup-middle.default.orange .anchor::after {
  margin: -10.5px -27px /*border:4 +2 px */;
}
.ol-popup.default.orange .anchor {
  color: #f96;
}
.ol-popup.default.orange .closeBox {
  background-color: rgba(255, 153, 102, 0.7);
}
.ol-popup.default.orange .closeBox:hover {
  background-color: rgba(255, 153, 102, 1);
}

.v-dialog--fullscreen > .v-card {
  padding: 20px !important;
}

.overlay_search {
  box-shadow: none;
}

#mapLegends {
  position: absolute;
  z-index: 99;
  bottom: 2%;
  right: 1%;
  width: 300px;
}

.score {
  font-size: 48px;
}

.not-cvrd {
  /* NOTCOVERED */

  position: absolute;
  width: 52px;
  height: 24px;
  left: 45px;
  top: 460px;

  /* Mobile/Small */

  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-align: center;

  /* Gray / Very Strong */

  color: #867e7e;

  transform: matrix(0.01, -1, 1, 0.02, 0, 0);
}

.vrt-prm {
  position: absolute;

  left: 0px;
  top: 215px;

  /* Text Input / Normal */

  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;

  color: #000000;

  transform: rotate(-90deg);
}

.param-good {
  position: absolute;
  width: 33px;
  height: 12px;
  left: 109px;
  top: 330px;

  /* Mobile/Small */

  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 12px;
  display: flex;
  align-items: center;

  /* Gray / Very Strong */

  color: #867e7e;

  transform: rotate(-90deg);
}

.param-fair {
  position: absolute;
  width: 33px;
  height: 12px;
  left: 109px;
  top: 255px;

  /* Mobile/Small */

  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 12px;
  display: flex;
  align-items: center;

  /* Gray / Very Strong */

  color: #867e7e;

  transform: rotate(-90deg);
}

.param-bad {
  position: absolute;
  width: 33px;
  height: 12px;
  left: 109px;
  top: 190px;

  /* Mobile/Small */

  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 12px;
  display: flex;
  align-items: center;

  /* Gray / Very Strong */

  color: #867e7e;

  transform: rotate(-90deg);
}
</style>
