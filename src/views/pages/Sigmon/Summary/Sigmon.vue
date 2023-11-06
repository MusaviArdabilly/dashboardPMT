<template>
  <div class="coverage">
    <NavbarBigScreen />
    <NavigationCellAndFo
      :link="{ cellular: '/summary-qoe', fo: '/fo/summary-qoe' }"
      is-page="Operator Cellular"
    />
    <v-row class="pl-5 pr-5">
      <v-col lg="2">
        <v-select
          @input="changeNational"
          v-model="selected_qoe"
          :items="qoe_item"
          item-text="name"
          item-value="id"
          dense
          placeholder="Test"
          outlined
          rounded
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col lg="3" class="d-flex">
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
                filter.date.default != true
                  ? filterComputed.preview.startDate
                  : filter.date.defaultText
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
            v-model="filter.date.startDate"
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
                filter.date.default != true
                  ? filterComputed.preview.endDate
                  : filter.date.defaultText
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
            v-model="filter.date.endDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col lg="1">
        <v-btn
          elevation="0"
          class="text-capitalize white--text"
          color="#1976D2"
          width="100%"
          @click="submitFilter"
          >{{ $t("ui.button_apply") }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col lg="12">
        <v-card class="pa-5 text-center national">
          <div class="font-weight-bold mb-3">National</div>
          <v-row v-for="item in summary" :key="item.index">
            <v-col lg="2">
              <img width="20%" :src="pmt_url + item.logo" :alt="item.name" />
            </v-col>
            <v-col lg="10">
              <div class="d-flex">
                <div class="text-lg-body-2 text-md-body-2">
                  {{ item.name }}
                </div>
                <v-spacer></v-spacer>
                <div class="font-weight-bold">{{ item.progress }}</div>
              </div>
              <div class="d-flex mt-2">
                <v-row>
                  <v-col cols="10">
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
                  <v-col cols="2" class="d-flex">
                    <div class="font-weight-bold mt-2">
                      {{
                        item.avg_download_speed == undefined
                          ? item.avg_throughput
                          : item.avg_download_speed
                      }}
                    </div>
                    <div class="ml-2 mt-2">({{ item.count }})</div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- top 3 card -->

      <v-col lg="2">
        <v-autocomplete
          @input="selectCity"
          v-model="selected_province"
          :items="province"
          :search-input.sync="searchProvince"
          item-text="name"
          item-value="id"
          class="mx-4"
          flat
          hide-no-data
          hide-details
          dense
          label="Search Province"
          outlined
        ></v-autocomplete>
      </v-col>
    </v-row>

    <v-slide-group v-model="onboarding" class="pa-4 mt-10" show-arrows>
      <v-slide-item v-for="items in summary_province" :key="items.index">
        <v-card
          color="white"
          class="ma-4 pa-5 text-center national"
          height="600"
          width="700"
        >
          <div class="font-weight-bold mb-3">{{ items.province_name }}</div>
          <v-row v-for="item in items.data" :key="item.index">
            <v-col lg="2">
              <img width="50%" :src="pmt_url + item.logo" :alt="item.name" />
            </v-col>
            <v-col lg="10">
              <div class="d-flex">
                <div class="text-lg-body-2 text-md-body-2">
                  {{ item.name }}
                </div>
                <v-spacer></v-spacer>
                <div class="font-weight-bold">{{ item.progress }}</div>
              </div>
              <div class="d-flex mt-2">
                <v-row>
                  <v-col cols="10">
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
                  <v-col cols="2" class="d-flex">
                    <div class="font-weight-bold mt-2">
                      {{
                        item.avg_download_speed == undefined
                          ? item.avg_throughput
                          : item.avg_download_speed
                      }}
                    </div>
                    <div class="ml-2 mt-2">({{ item.count }})</div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>
<script src="./Sigmon.js"></script>

<style src="./Sigmon.css" scoped></style>
