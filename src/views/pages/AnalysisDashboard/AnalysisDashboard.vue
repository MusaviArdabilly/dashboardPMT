<template>
  <div>
    <NavbarBigScreen />
    <div class="analysis-dashboard px-10">
      <div class="font-weight-bold mt-5" style="font-size: 24px">
        {{ $t("general.menu.analytics_summary") }}
      </div>

      <v-row class="mt-5">
        <div style="width: 10%" class="mt-3">
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
        </div>
        <v-col lg="1">
          <v-select
            v-model="selectedSignalStrength"
            :items="signalStrength"
            label="Signal Strength Technology"
            outlined
            dense
            hide-details
            placeholder="Signal Strength Technology"
          ></v-select>
        </v-col>
        <v-col lg="1">
          <v-select
            v-model="selectedSpeedTest"
            :items="speedTest"
            label="Speed Test Technology"
            outlined
            dense
            hide-details
            placeholder="Speed Test Technology"
          ></v-select>
        </v-col>
        <v-col lg="1">
          <v-dialog transition="dialog-top-transition" width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                v-model="defaultDate"
                dense
                prepend-inner-icon="mdi-calendar"
                placeholder="Date"
                label="Date"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-tabs v-model="datetab" color="primary accent-4" left>
                  <v-tab class="px-9">Quarter</v-tab>
                  <v-tab class="px-9">Year</v-tab>

                  <v-tab-item>
                    <v-container fluid class="d-flex justify-center">
                      <v-col lg="9">
                        <v-select
                          outlined
                          v-model="selectedQuarter"
                          dense
                          :items="quarterItems"
                        ></v-select>
                      </v-col>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container class="d-flex justify-center" fluid>
                      <v-col lg="9">
                        <v-select
                          outlined
                          dense
                          v-model="selectedYear"
                          :items="yearItems"
                        ></v-select>
                      </v-col>
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
          <v-autocomplete
            @input="selectCity"
            v-model="selected_province"
            :items="item_province"
            :search-input.sync="searchProvince"
            item-text="name"
            item-value="id"
            flat
            hide-no-data
            hide-details
            dense
            :label="$t('ui.field.province')"
            outlined
          ></v-autocomplete>
        </v-col>
        <v-col lg="2">
          <v-autocomplete
            @input="selectDistrict"
            v-model="selected_city"
            :items="item_city"
            :search-input.sync="searchCity"
            item-text="name"
            item-value="id"
            flat
            hide-no-data
            hide-details
            dense
            :label="$t('ui.field.city')"
            outlined
          ></v-autocomplete>
        </v-col>
        <v-col lg="2">
          <v-autocomplete
            @input="selectSubDistrict"
            v-model="selected_district"
            :items="item_district"
            :search-input.sync="searchDistrict"
            item-text="name"
            item-value="id"
            flat
            hide-no-data
            hide-details
            dense
            :label="$t('ui.field.district')"
            outlined
          ></v-autocomplete>
        </v-col>
        <v-col lg="1" class="d-flex">
          <v-btn
            @click="applyFilter()"
            class="mr-1 text-capitalize white--text"
            color="#169CD6"
            >{{ $t("ui.button_apply") }}</v-btn
          >
          <v-btn
            @click="resetFilter()"
            class="text-capitalize ml-3 white--text"
            color="#EA5455"
            >Reset</v-btn
          >
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
              src="../../../assets/image/empty.svg"
              alt="no data"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else class="d-flex justify-center">
        <v-col lg="4" class="mr-10">
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
                      {{ cov_qoe_ss.good_good ? cov_qoe_ss.good_good : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(63, 197, 123, 0.7)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_ss.good_fair ? cov_qoe_ss.good_fair : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(63, 197, 123, 0.3)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_ss.good_bad ? cov_qoe_ss.good_bad : "-" }}%
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
                      {{ cov_qoe_ss.fair_good ? cov_qoe_ss.fair_good : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="#ECAF55"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_ss.fair_fair ? cov_qoe_ss.fair_fair : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(236, 175, 85, 0.3)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_ss.fair_bad ? cov_qoe_ss.fair_bad : "-" }}%
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
                      {{ cov_qoe_ss.bad_good ? cov_qoe_ss.bad_good : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(216, 76, 58, 0.7)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_ss.bad_fair ? cov_qoe_ss.bad_fair : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="#D84C3A"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_ss.bad_bad ? cov_qoe_ss.bad_bad : "-" }}%
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
                  {{ cov_qoe_ss.not_covered ? cov_qoe_ss.not_covered : "-" }}%
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
                      {{ cov_qoe_dl.good_good ? cov_qoe_dl.good_good : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(63, 197, 123, 0.7)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_dl.good_fair ? cov_qoe_dl.good_fair : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(63, 197, 123, 0.3)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_dl.good_bad ? cov_qoe_dl.good_bad : "-" }}%
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
                      {{ cov_qoe_dl.fair_good ? cov_qoe_dl.fair_good : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="#ECAF55"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_dl.fair_fair ? cov_qoe_dl.fair_fair : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(236, 175, 85, 0.3)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_dl.fair_bad ? cov_qoe_dl.fair_bad : "-" }}%
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
                      {{ cov_qoe_dl.bad_good ? cov_qoe_dl.bad_good : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="rgba(216, 76, 58, 0.7)"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_dl.bad_fair ? cov_qoe_dl.bad_fair : "-" }}%
                    </v-card>
                  </v-col>
                  <v-col lg="4">
                    <v-card
                      color="#D84C3A"
                      width="70"
                      height="50"
                      class="d-flex justify-center align-center font-weight-bold"
                    >
                      {{ cov_qoe_dl.bad_bad ? cov_qoe_dl.bad_bad : "-" }}%
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
                  {{ cov_qoe_dl.not_covered ? cov_qoe_dl.not_covered : "-" }}%
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script src="./AnalysisDashboard.js"></script>

<style scoped>
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
