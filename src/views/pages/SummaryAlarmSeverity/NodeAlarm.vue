<template>
  <div class="qoe">
    <NavbarBigScreen />
    <!-- Filters -->
    <v-row class="pl-5">
      <v-col cols="2">
        <v-btn
          to="/summary-alarm-operator"
          elevation="0"
          color="primary"
          rounded
          class="text-capitalize"
          height="50"
          width="100%"
        >
          {{ $t("general.menu.operator_cellular") }}
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn
          to="/fo/summary-alarm-operator"
          elevation="0"
          class="text-capitalize"
          rounded
          height="50"
          width="100%"
        >
          {{ $t("general.menu.fixed_broadband") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-5 pl-5 pr-7">
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
      <v-col lg="2">
        <v-autocomplete
          v-model="selected_sub_district"
          :items="item_sub_district"
          :search-input.sync="searchSubDistrict"
          item-text="name"
          item-value="id"
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
          @click="resetFilter()"
          elevation="0"
          class="text-capitalize"
          rounded
          color=""
          >Reset</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="pa-5">
      <!-- Alarm Active -->
      <v-col v-if="active_alarm > 0" lg="2">
        <v-card height="690px" class="pa-5 bg-alarm text-center">
          <div class="font-weight-bold white--text">Alarm Active</div>
          <div>
            <div class="alarm-summary">
              <div>There are</div>
              <div id="total-alarm">{{ active_alarm }}</div>
              <div>Alarm Active by now</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col v-if="active_alarm == 0" lg="2">
        <v-card height="670px" class="pa-5 bg-alarm-zero text-center">
          <div class="font-weight-bold white--text">Alarm Active</div>
          <div>
            <div class="alarm-summary">
              <div>There are</div>
              <div id="total-alarm">{{ active_alarm }}</div>
              <div>Alarm Active by now</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Alarm List -->
      <v-col lg="10">
        <div class="font-weight-bold mb-5">List of Alarm</div>
        <v-row v-if="alarm.length == 0" style="height: 620px">
          <v-col lg="12">
            <v-card class="pa-5 text-center">
              <img
                height="555px"
                src="../../../assets/image/empty.svg"
                alt="no data"
              />
              <div class="text-center">No Data</div>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else style="height: 620px">
          <v-overlay :value="loadingAlarmList" opacity="0.7">
            <v-progress-circular
              class="loader"
              :size="50"
              color="primary"
              indeterminate
              v-if="loadingAlarmList != false"
            >
            </v-progress-circular>
          </v-overlay>
          <v-col lg="4" v-for="item in alarm" :key="item.index">
            <v-card class="pa-5" :height="alarm.length > 3 ? `100%` : '50%'">
              <v-row align="center">
                <v-col lg="2">
                  <img
                    width="100%"
                    :src="pmt_url + item.cell_operator.logo"
                    :alt="item.cell_operator.name"
                  />
                </v-col>
                <v-col lg="10">
                  {{ item.cell_operator.name }}
                </v-col>
              </v-row>
              <v-row>
                <v-col lg="7">
                  <div class="grey--text mb-5" style="font-size: 14px">
                    Alarm Name
                  </div>
                  <div class="">{{ item.site_name }}</div>
                  <v-row class="mt-5">
                    <v-col lg="6">
                      <div class="grey--text mb-2" style="font-size: 14px">
                        Severity
                      </div>
                      <v-chip
                        :color="
                          item.severity == `Critical` ? `#ffe3e3` : `f4e0cd`
                        "
                      >
                        <div
                          :style="
                            item.severity == `Critical`
                              ? `color: #e04949`
                              : `color: #ea8426`
                          "
                        >
                          {{ item.severity }}
                        </div>
                      </v-chip>
                    </v-col>
                    <v-col lg="6">
                      <div class="grey--text mb-2" style="font-size: 14px">
                        Category
                      </div>
                      <div>
                        {{
                          item.alarm_category ? item.alarm_category.name : `-`
                        }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col lg="5">
                  <div class="grey--text mb-5" style="font-size: 14px">
                    Description
                  </div>
                  <small>{{ item.description }}</small>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-pagination
          v-show="alarm.length != 0"
          v-model="pagination.currentPage"
          :length="pagination.totalPage"
          circle
          class="mt-15"
          @input="nextPage"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./NodeAlarm.js"></script>

<style scoped>
.qoe {
  height: 100%;
}

.bg-alarm {
  background-image: url("../../../assets/image/bg-alarm.svg");
  background-size: cover;
  object-fit: fill;
  border-radius: 40px !important;
  background-position: center;
}

.bg-alarm-zero {
  background-image: url("../../../assets/image/alarm_zero.svg");
  background-size: cover;
  object-fit: fill;
  border-radius: 40px !important;
  background-position: center;
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

.alarm-summary {
  position: relative;
  top: 330px;
  color: #fff !important;
}

#total-alarm {
  font-weight: bold;
  font-size: 64px;
}

.detail-alarm {
  cursor: pointer;
}
</style>
