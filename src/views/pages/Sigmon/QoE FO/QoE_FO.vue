<template>
  <div>
    <v-row>
      <router-link to="/dashboard/quality-of-experience">
        <v-icon size="40" class="mt-8" color="black">mdi-chevron-left</v-icon>
      </router-link>

      <v-col>
        <h2 class="mt-6 mb-2 mr-2">
          {{ $t("general.menu.qoe_summary") }} -
          {{ $t("general.menu.qoe_dashboard") }}
        </h2>
      </v-col>
    </v-row>
    <NavigationCellAndFo
      :link="{
        cellular: '/dashboard/quality-of-experience',
        fo: '/dashboard/fo/quality-of-experience',
      }"
      is-page="Fixed Broadband"
    />
    <!-- Filters -->
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

      <v-col lg="2">
        <v-autocomplete
          class="mx-4"
          v-model="select_operator"
          :items="itemOperator"
          item-text="name"
          item-value="id"
          hide-no-data
          hide-details
          dense
          label="Provider"
          outlined
          @change="applyByOperator"
        ></v-autocomplete>
      </v-col>
    </v-row>

    <!-- Card -->
    <v-row>
      <v-col lg="4">
        <!-- Download Speed Test Card -->
        <v-card v-if="select_speed_test == 'download'" height="100%">
          <div class="pa-5 d-flex align-center justify-center">
            <v-icon @click="changeSpeedTest" size="40" color="black"
              >mdi-chevron-left</v-icon
            >
            <div
              v-if="select_speed_test == 'download'"
              class="font-weight-bold"
            >
              Speed Test - Download (Mbps)
            </div>
            <div v-else class="font-weight-bold">
              Speed Test - Upload (Mbps)
            </div>
            <v-icon @click="changeSpeedTest" size="40" color="black"
              >mdi-chevron-right</v-icon
            >
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

          <div v-else class="card-container-qoe-fo">
            <v-row
              v-for="(item, index) in avgSpeedFoDownload.slice(0, 5)"
              :key="index"
            >
              <v-col lg="2" class="d-flex justify-end align-center"
                ><span class="font-weight-bold">{{ index + 1 }}</span></v-col
              >
              <v-col lg="2" class="d-flex justify-center align-center">
                <div
                  is="v-avatar"
                  :color="avatarBackground(item.name)"
                  v-if="item.logo == ''"
                >
                  <span class="white--text">{{
                    stringInitial(item.name)
                  }}</span>
                </div>
                <div is="v-avatar" v-else>
                  <img :src="logo_url + item.logo" :alt="item.name + '-logo'" />
                </div>
              </v-col>
              <v-col lg="8">
                <div class="d-flex">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold"></div>
                </div>
                <div class="d-flex mt-2">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.percentage"
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
                        {{ item.average }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col
              cols="12"
              align-self="center"
              justify="center"
              class="d-flex justify-center align-center mb-4"
            >
              <v-btn
                @click="dialogSpeedTest = !dialogSpeedTest"
                outlined
                elevation="0"
                rounded
                class="text-capitalize"
                width="11rem"
                >Show All</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
        <!-- Upload Speed Test Card-->
        <v-card v-else height="100%" :loading="loadingAvgSpeed">
          <div class="pa-5 d-flex align-center justify-center">
            <v-icon @click="changeSpeedTest" size="40" color="black"
              >mdi-chevron-left</v-icon
            >
            <div
              v-if="select_speed_test == 'download'"
              class="font-weight-bold"
            >
              Speed Test - Download (Mbps)
            </div>
            <div v-else class="font-weight-bold">
              Speed Test - Upload (Mbps)
            </div>
            <v-icon @click="changeSpeedTest" size="40" color="black"
              >mdi-chevron-right</v-icon
            >
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

          <div v-else class="card-container-qoe-fo">
            <v-row
              v-for="(item, index) in avgSpeedFoUpload.slice(0, 5)"
              :key="index"
            >
              <v-col lg="2" class="d-flex justify-end align-center"
                ><span class="font-weight-bold">{{ index + 1 }}</span></v-col
              >
              <v-col lg="2" class="d-flex justify-center align-center">
                <div
                  is="v-avatar"
                  :color="avatarBackground(item.name)"
                  v-if="item.logo == ''"
                >
                  <span class="white--text">{{
                    stringInitial(item.name)
                  }}</span>
                </div>
                <div is="v-avatar" v-else>
                  <img :src="logo_url + item.logo" :alt="item.name + '-logo'" />
                </div>
              </v-col>
              <v-col lg="8">
                <div class="d-flex">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold"></div>
                </div>
                <div class="d-flex mt-2">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.percentage"
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
                        {{ item.average }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-row>
            <v-col
              cols="12"
              align-self="center"
              justify="center"
              class="d-flex justify-center align-center mb-4"
            >
              <v-btn
                @click="dialogSpeedTest = !dialogSpeedTest"
                outlined
                elevation="0"
                rounded
                class="text-capitalize"
                width="11rem"
                >Show All</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Card WebTest -->
      <v-col lg="4">
        <v-card height="100%">
          <div class="pa-5 d-flex align-center justify-center">
            <div class="font-weight-bold py-2">Web Test (Mbps)</div>
          </div>
          <v-divider></v-divider>
          <div
            v-if="loadingAvgWeb"
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

          <div v-else class="card-container-qoe-fo">
            <v-row v-for="(item, index) in avgWebFo.slice(0, 5)" :key="index">
              <v-col lg="2" class="d-flex justify-end align-center"
                ><span class="font-weight-bold">{{ index + 1 }}</span></v-col
              >
              <v-col lg="2" class="d-flex justify-center align-center">
                <div
                  is="v-avatar"
                  :color="avatarBackground(item.name)"
                  v-if="item.logo == ''"
                >
                  <span class="white--text">{{
                    stringInitial(item.name)
                  }}</span>
                </div>
                <div is="v-avatar" v-else>
                  <img :src="logo_url + item.logo" :alt="item.name + '-logo'" />
                </div>
              </v-col>
              <v-col lg="8">
                <div class="d-flex mt-2">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold"></div>
                </div>
                <div class="d-flex">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.percentage"
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
                        {{ item.average }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col
              cols="12"
              align-self="center"
              justify="center"
              class="d-flex justify-center align-center mb-4"
            >
              <v-btn
                outlined
                @click="dialogWebTest = !dialogWebTest"
                elevation="0"
                rounded
                class="text-capitalize"
                width="11rem"
                >Show All</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Card Video Test -->
      <v-col lg="4">
        <v-card height="100%">
          <div class="pa-5 d-flex align-center justify-center">
            <div class="font-weight-bold py-2">Video Test (Mbps)</div>
          </div>
          <v-divider></v-divider>
          <div
            v-if="loadingAvgVideo"
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

          <div v-else class="card-container-qoe-fo">
            <v-row v-for="(item, index) in avgVideoFo.slice(0, 5)" :key="index">
              <v-col lg="2" class="d-flex justify-end align-center"
                ><span class="font-weight-bold">{{ index + 1 }}</span></v-col
              >
              <v-col lg="2" class="d-flex justify-center align-center">
                <div
                  is="v-avatar"
                  :color="avatarBackground(item.name)"
                  v-if="item.logo == ''"
                >
                  <span class="white--text">{{
                    stringInitial(item.name)
                  }}</span>
                </div>
                <div is="v-avatar" v-else>
                  <img :src="logo_url + item.logo" :alt="item.name + '-logo'" />
                </div>
              </v-col>
              <v-col lg="8">
                <div class="d-flex">
                  <div class="text-lg-body-2 text-md-body-2">
                    {{ item.name }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold"></div>
                </div>
                <div class="d-flex mt-2">
                  <v-row>
                    <v-col cols="7">
                      <v-progress-linear
                        :value="item.percentage"
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
                        {{ item.average }}
                      </div>
                      <div class="ml-2 mt-2">({{ item.count }})</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col
              cols="12"
              align-self="center"
              justify="center"
              class="d-flex justify-center align-center mb-4"
            >
              <v-btn
                outlined
                @click="dialogVideoTest = !dialogVideoTest"
                elevation="0"
                rounded
                class="text-capitalize"
                width="11rem"
                >Show All</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card Choice -->
    <v-row class="mt-15 mb-5">
      <v-col lg="4">
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
          <div class="ml-5 mt-2">Speed Test</div>
        </v-card>
      </v-col>
      <v-col lg="4">
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
          <div class="mt-2 ml-5">Video Test</div>
        </v-card>
      </v-col>
      <v-col lg="4">
        <v-card
          @click="changeTable('WebTable')"
          :class="[
            'pa-5 card-test d-flex',
            table == 'WebTable' ? 'active-card' : '',
          ]"
        >
          <v-icon size="40" :color="table == 'WebTable' ? '#169CD6' : '#5E5873'"
            >mdi-web</v-icon
          >
          <div class="ml-5 mt-2">Web Test</div>
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
    <!-- Data Table -->
    <div class="mt-5">
      <component
        :is="table"
        :dateEnd="date.endDate"
        :dateStart="date.startDate"
      />
    </div>

    <!-- Show All Dialog -->
    <SpeedTest
      :avgSpeedFoDownload="avgSpeedFoDownload"
      :avgSpeedFoUpload="avgSpeedFoUpload"
      :dialogSpeedTest="dialogSpeedTest"
      :select_speed_test="select_speed_test"
      :dateCurrent="dateCurrent"
    >
    </SpeedTest>

    <VideoTest
      :avgVideoFo="avgVideoFo"
      :dialogVideoTest="dialogVideoTest"
      :dateCurrent="dateCurrent"
    >
    </VideoTest>

    <WebTest
      :avgWebFo="avgWebFo"
      :dialogWebTest="dialogWebTest"
      :dateCurrent="dateCurrent"
    ></WebTest>
  </div>
</template>
<script src="./QoE_FO"></script>
<style scoped>
.card-container-qoe-fo {
  width: 100%;
  padding: 2rem 2rem;

  display: flex;
  justify-content: center;
  flex-direction: column;
}
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
