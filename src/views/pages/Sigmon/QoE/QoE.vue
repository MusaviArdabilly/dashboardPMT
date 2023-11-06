<template>
  <div class="qoe">
    <div ref="qoereport">
      <h2 class="ml-5 mt-2 mb-2">
        {{ $t("general.menu.qoe_summary") }} -
        {{ $t("general.menu.qoe_dashboard") }}
      </h2>
      <NavigationCellAndFo
        :link="{
          cellular: '/dashboard/quality-of-experience',
          fo: '/dashboard/fo/quality-of-experience',
        }"
        is-page="Operator Cellular"
      />
      <div v-if="show_opsel">
        <div>
          <v-row class="mt-5">
            <v-col lg="2">
              <v-autocomplete
                @input="selectCity"
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
                @input="selectDistrict"
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
                @input="selectSubDistrict"
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

            <v-col lg="2">
              <v-btn
                elevation="0"
                class="mr-5 text-capitalize"
                color="primary"
                rounded
                @click="applyFilter"
                >{{ $t("ui.button_apply") }}</v-btn
              >
              <v-btn
                @click="resetFilter"
                elevation="0"
                class="text-capitalize"
                rounded
                color=""
                >Reset</v-btn
              >
            </v-col>

            <!-- <v-col lg="2">
              <v-btn
                width="100%"
                @click="printScreen"
                height="100%"
                style="color: #5e5873"
                color="white"
              >
                <div class="mr-2 text-capitalize">Export Data</div>
                <v-icon>mdi-file-download-outline</v-icon>
              </v-btn>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col cols="6" lg="6" xl="3">
              <v-card height="100%">
                <div class="pa-5 d-flex">
                  <div class="font-weight-bold">Speed Test (Mbps)</div>
                  <v-spacer></v-spacer>
                </div>
                <v-divider></v-divider>
                <div class="pa-5">
                  <div
                    class="pmt-progress-wrap mb-4"
                    v-for="item in avg_speed_test"
                  >
                    <div is="v-avatar">
                      <img :alt="item.name" :src="pmt_url + item.logo" />
                    </div>
                    <div class="bar-wrap" is="v-col" cols="8" xl="8">
                      <label class="font-weight-regular">{{ item.name }}</label>
                      <div class="pmt-flex wrap row">
                        <div class="pt-2" is="v-col" cols="8" xl="8">
                          <v-progress-linear
                            :value="item.payload"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-4"
                          ></v-progress-linear>
                        </div>
                        <div class="bar-label">
                          {{ item.avg_download_speed }}
                          <div class="font-weight-regular">
                            ({{ item.count }})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" lg="6" xl="3">
              <v-card height="100%">
                <div class="pa-5 d-flex">
                  <div class="font-weight-bold">Web Test (Mbps)</div>
                  <v-spacer></v-spacer>
                </div>
                <v-divider></v-divider>
                <div class="pa-5">
                  <div
                    class="pmt-progress-wrap mb-4"
                    v-for="item in avg_web_test"
                  >
                    <div is="v-avatar">
                      <img :alt="item.name" :src="pmt_url + item.logo" />
                    </div>
                    <div class="bar-wrap" is="v-col" cols="8" xl="8">
                      <label class="font-weight-regular">{{ item.name }}</label>
                      <div class="pmt-flex wrap row">
                        <div class="pt-2" is="v-col" cols="8" xl="8">
                          <v-progress-linear
                            :value="item.payload"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-4"
                          ></v-progress-linear>
                        </div>
                        <div class="bar-label">
                          {{ item.avg_throughput }}
                          <div class="font-weight-regular">
                            ({{ item.count }})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" lg="6" xl="3">
              <v-card height="100%">
                <div class="pa-5 d-flex">
                  <div class="font-weight-bold">Video Test (Mbps)</div>
                  <v-spacer></v-spacer>
                </div>
                <v-divider></v-divider>
                <div class="pa-5">
                  <div
                    class="pmt-progress-wrap mb-4"
                    v-for="item in avg_video_test"
                  >
                    <div is="v-avatar">
                      <img :alt="item.name" :src="pmt_url + item.logo" />
                    </div>
                    <div class="bar-wrap" is="v-col" cols="8" xl="8">
                      <label class="font-weight-regular">{{ item.name }}</label>
                      <div class="pmt-flex wrap row">
                        <div class="pt-2" is="v-col" cols="8" xl="8">
                          <v-progress-linear
                            :value="item.payload"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-4"
                          ></v-progress-linear>
                        </div>
                        <div class="bar-label">
                          {{ item.avg_throughput }}
                          <div class="font-weight-regular">
                            ({{ item.count }})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" lg="6" xl="3">
              <v-card>
                <div class="pa-5 d-flex">
                  <div class="font-weight-bold">Rating</div>
                  <v-spacer></v-spacer>
                </div>
                <v-divider></v-divider>
                <div class="pa-5">
                  <div
                    class="pmt-progress-wrap mb-8"
                    v-for="item in avg_rating"
                  >
                    <div is="v-avatar">
                      <img :alt="item.name" :src="pmt_url + item.logo" />
                    </div>
                    <div class="bar-wrap" is="v-col" cols="8" xl="8">
                      <label class="font-weight-regular">{{ item.name }}</label>
                      <div class="pmt-flex wrap row">
                        <div class="pt-2" is="v-col" cols="10" xl="10">
                          <v-rating
                            class="ma-2"
                            v-model="item.rating"
                            color="yellow darken-3"
                            background-color="yellow darken-3"
                            half-increments
                            readonly
                          ></v-rating>
                        </div>
                        <div class="bar-label">
                          {{ item.rating }}
                          <div class="font-weight-regular">
                            ({{ item.count }})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <v-row class="mt-15 mb-5">
          <v-col lg="3">
            <v-card
              @click="changeTable('SpeedTable')"
              :class="[
                'pa-5 card-test d-flex',
                table == 'SpeedTable' ? 'active-card' : '',
              ]"
            >
              <v-icon
                size="40"
                :color="table == 'SpeedTable' ? '#169CD6' : '#5E5873'"
                >mdi-gauge</v-icon
              >
              <div class="ml-5 mt-2">Speed test</div>
            </v-card>
          </v-col>
          <v-col lg="3">
            <v-card
              @click="changeTable('VideoTable')"
              :class="[
                'pa-5 card-test d-flex',
                table == 'VideoTable' ? 'active-card' : '',
              ]"
            >
              <v-icon
                size="40"
                :color="table == 'VideoTable' ? '#169CD6' : '#5E5873'"
                >mdi-television-play</v-icon
              >
              <div class="mt-2 ml-5">Video test</div>
            </v-card>
          </v-col>
          <v-col lg="3">
            <v-card
              @click="changeTable('WebTable')"
              :class="[
                'pa-5 card-test d-flex',
                table == 'WebTable' ? 'active-card' : '',
              ]"
            >
              <v-icon
                size="40"
                :color="table == 'WebTable' ? '#169CD6' : '#5E5873'"
                >mdi-web</v-icon
              >
              <div class="ml-5 mt-2">Web test</div>
            </v-card>
          </v-col>
          <v-col lg="3">
            <v-card
              @click="changeTable('RatingTable')"
              :class="[
                'pa-5 card-test d-flex',
                table == 'RatingTable' ? 'active-card' : '',
              ]"
            >
              <v-icon
                size="40"
                :color="table == 'RatingTable' ? '#169CD6' : '#5E5873'"
                >mdi-star</v-icon
              >
              <div class="ml-5 mt-2">Rating</div>
            </v-card>
          </v-col>
        </v-row>

        <div>
          <v-alert
            class="pmt-alert pr-5"
            v-model="isAlertShow"
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
                  {{ $t("general.message.alert_sigmon.title") }}
                </h4>
                <span> {{ $t("general.message.alert_sigmon.message") }}</span>
              </v-col>
            </div>
          </v-alert>
        </div>
        <div class="mt-5">
          <component :is="table" />
        </div>
      </div>
    </div>
    <div v-if="show_fo">
      <FixedbroadBand />
    </div>
  </div>
</template>

<script src="./QoE.js"></script>

<style scoped>
.qoe {
  height: 100%;
}

.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}

.v-progress-linear--rounded {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

.v-sheet.v-card {
  border-radius: 10px;
}

.active-card {
  border: 1px solid #169cd6;
  box-shadow: rgba(3, 150, 248, 0.24) 0px 3px 8px !important;
  color: #169cd6 !important;
}

.active-btn {
  background-image: linear-gradient(
    109.6deg,
    rgba(45, 116, 213, 1) 11.2%,
    rgba(121, 137, 212, 1) 91.2%
  );
  color: white !important;
}

.rating-value {
  margin-top: 10px;
}
</style>
