<template>
  <div>
    <!-- Filters -->
    <v-row class="mt-5">
      <v-col lg="2">
        <v-autocomplete
          @input="selectCity()"
          v-model="selected_province"
          :items="item_province"
          :search-input.sync="searchProvice"
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
      </v-col>
      <v-col lg="2">
        <v-autocomplete
          @input="selectDistrict()"
          v-model="selected_city"
          :items="item_city"
          :search-input.sync="searchCity"
          item-text="name"
          item-value="id"
          class="mx-4"
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
          @input="selectSubDistrict()"
          v-model="selected_district"
          :items="item_district"
          :search-input.sync="searchDistrict"
          item-text="name"
          item-value="id"
          class="mx-4"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.district')"
          outlined
        ></v-autocomplete>
      </v-col>
      <v-col lg="2">
        <v-autocomplete
          v-model="selected_sub_district"
          :items="item_sub_district"
          :search-input.sync="searchSubDistrict"
          item-text="name"
          item-value="id"
          class="mx-4"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.sub_district')"
          outlined
        ></v-autocomplete>
      </v-col>

      <v-col lg="4" class="d-flex">
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
              v-model="
                date.default != true ? dateFilter.startDate : date.defaultText
              "
              solo
              dense
              prepend-inner-icon="mdi-calendar"
              placeholder="Start Date"
              :hint="$t('ui.field.start_date')"
              persistent-hint
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            @input="filterDate"
            v-model="date.startDate"
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
              v-model="
                date.default != true ? dateFilter.endDate : date.defaultText
              "
              solo
              dense
              prepend-inner-icon="mdi-calendar"
              placeholder="End Date"
              :hint="$t('ui.field.end_date')"
              persistent-hint
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            @input="filterDate"
            v-model="date.endDate"
          ></v-date-picker>
        </v-menu>
        <v-btn
          elevation="0"
          class="ml-5 mr-5 text-capitalize"
          color="primary"
          rounded
          @click="applyFilterQoe"
        >
          {{ $t("ui.button_apply") }}</v-btn
        >
        <v-btn
          @click="resetFilterQoe"
          elevation="0"
          class="text-capitalize"
          rounded
          color=""
          >Reset</v-btn
        >
      </v-col>
    </v-row>
    <!-- Cards -->
    <v-row>
      <v-col lg="3">
        <v-card height="100%">
          <div class="pa-5 d-flex">
            <div class="font-weight-bold">Speed Test (Mbps)</div>
            <v-spacer></v-spacer>
          </div>
          <v-divider></v-divider>
          <div
            v-if="loadingAvgSpeed"
            class="d-flex justify-center"
            style="padding: 12rem 0"
          >
            <v-progress-circular
              size="70"
              width="7"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else class="pa-5">
            <v-row v-for="item in avg_speed_test" :key="item.index">
              <v-col lg="2">
                <img width="100%" :src="pmt_url + item.logo" :alt="item.name" />
              </v-col>
              <v-col lg="10">
                <div class="d-flex">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold">
                    {{ item.progress }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.payload"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-4"
                      >
                        <div class="white--text font-weight-bold"></div>
                      </v-progress-linear>
                    </v-col>
                    <v-col cols="5" class="d-flex">
                      <div class="font-weight-bold mt-2">
                        {{ item.avg_download_speed }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card height="100%">
          <div class="pa-5 d-flex">
            <div class="font-weight-bold">Web Test (bps)</div>
            <v-spacer></v-spacer>
          </div>
          <v-divider></v-divider>
          <div
            v-if="loadingAvgSpeed"
            class="d-flex justify-center"
            style="padding: 12rem 0"
          >
            <v-progress-circular
              size="70"
              width="7"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else class="pa-5">
            <v-row v-for="item in avg_web_test" :key="item.index">
              <v-col lg="2">
                <img width="100%" :src="pmt_url + item.logo" :alt="item.name" />
              </v-col>
              <v-col lg="10">
                <div class="d-flex mt-2">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold">
                    {{ item.progress }}
                  </div>
                </div>
                <div class="d-flex">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.payload"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-4"
                      >
                        <div class="white--text font-weight-bold"></div>
                      </v-progress-linear>
                    </v-col>
                    <v-col cols="5" class="d-flex">
                      <div class="font-weight-bold mt-2">
                        {{ item.avg_throughput }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card height="100%">
          <div class="pa-5 d-flex">
            <div class="font-weight-bold">Video Test (bps)</div>
            <v-spacer></v-spacer>
          </div>
          <v-divider></v-divider>
          <div
            v-if="loadingAvgSpeed"
            class="d-flex justify-center"
            style="padding: 12rem 0"
          >
            <v-progress-circular
              size="70"
              width="7"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else class="pa-5">
            <v-row v-for="item in avg_video_test" :key="item.index">
              <v-col lg="2">
                <img width="100%" :src="pmt_url + item.logo" :alt="item.name" />
              </v-col>
              <v-col lg="10">
                <div class="d-flex">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold">
                    {{ item.progress }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.payload"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-4"
                      >
                        <div class="white--text font-weight-bold"></div>
                      </v-progress-linear>
                    </v-col>
                    <v-col cols="5" class="d-flex">
                      <div class="font-weight-bold mt-2">
                        {{ item.avg_throughput }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col lg="3">
        <v-card>
          <div class="pa-5 d-flex">
            <div class="font-weight-bold">Rating</div>
            <v-spacer></v-spacer>
          </div>
          <v-divider></v-divider>
          <div
            v-if="loadingAvgSpeed"
            class="d-flex justify-center"
            style="padding: 12rem 0"
          >
            <v-progress-circular
              size="70"
              width="7"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else class="pa-5">
            <v-row v-for="item in avg_rating" :key="item.index">
              <v-col lg="2">
                <img width="100%" :src="pmt_url + item.logo" :alt="item.name" />
              </v-col>
              <v-col lg="10">
                <div class="d-flex">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold">
                    {{ item.progress }}
                  </div>
                </div>
                <div class="d-flex">
                  <v-rating
                    v-model="item.rating"
                    color="yellow darken-3"
                    background-color="yellow darken-3"
                    half-increments
                    readonly
                  ></v-rating>
                  <div class="rating-value font-weight-bold mr-2">
                    ({{ item.rating }})
                  </div>
                  <div class="rating-value mr-2">({{ item.count }})</div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./QoE_Cellular.js"></script>
