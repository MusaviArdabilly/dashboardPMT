<template>
  <section class="single-page">
    <v-overlay :absolute="false" :value="foLoading">
      <v-progress-circular
        class="loader"
        :size="50"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
    </v-overlay>
    <NavbarBigScreen />
    <NavigationCellAndFo
      :link="{ cellular: '/summary-qoe', fo: '/fo/summary-qoe' }"
      is-page="Fixed Broadband"
    />
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-red" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">Speed Test - Upload (Mbps)</h4>
              <span class="summary-count">{{ avgCards.upload_speed }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-orange" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">Speed Test - Download (Mbps)</h4>
              <span class="summary-count">{{ avgCards.download_speed }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-green" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">Web Test (Mbps)</h4>
              <span class="summary-count">{{ avgCards.web_test }}</span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" xl="3">
          <v-card class="pmt-card summary color-blue" elevation="0">
            <div class="summary-wrap">
              <h4 class="summary-title">Video Test (Mbps)</h4>
              <span class="summary-count">{{ avgCards.video_test }}</span>
            </div>
          </v-card>
        </v-col>
      </div>
    </div>
    <div class="page-section">
      <div class="pmt-flex wrap is-row">
        <v-col cols="6" xl="6">
          <div class="pmt-flex wrap at-start">
            <v-col cols="3" xl="3">
              <v-select
                v-model="filter.testUnit.value"
                :items="items.testUnit"
                item-text="name"
                item-value="value"
                dense
                placeholder="Speed Test"
                outlined
                rounded
                @input="changeSummary"
                :disabled="input.isDisabled"
              ></v-select>
            </v-col>
            <v-col cols="3" xl="3">
              <v-select
                v-model="filter.orderAverage.value"
                :items="items.orderAverage"
                item-text="name"
                item-value="value"
                dense
                placeholder="Average"
                outlined
                rounded
                @input="changeSummary"
                :disabled="input.isDisabled"
              ></v-select>
            </v-col>
            <v-col cols="3" xl="3">
              <v-autocomplete
                v-model="filter.orderOperator.value"
                :items="itemOperator"
                :search-input.sync="filter.orderOperator.searchOperator"
                item-text="name"
                item-value="id"
                dense
                hide-no-data
                hide-details
                placeholder="Operator"
                outlined
                rounded
                @input="changeSummaryOnlyOperator"
              ></v-autocomplete>
            </v-col>
          </div>
        </v-col>
        <v-col cols="6" xl="6">
          <div class="pmt-flex wrap at-end">
            <v-col cols="3" xl="3">
              <v-menu
                v-model="filter.picker.datepicker1"
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
                    prepend-inner-icon="mdi-calendar-range-outline"
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
            </v-col>
            <v-col cols="3" xl="3">
              <v-menu
                class="ml-5"
                v-model="filter.picker.datepicker2"
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
                    prepend-inner-icon="mdi-calendar-range-outline"
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
            <v-col cols="3" xl="3">
              <v-btn
                elevation="0"
                class="text-capitalize white--text"
                color="#134889"
                width="100%"
                @click="changeSummaryClick"
                :disabled="input.isDisabled"
                >{{ $t("ui.button_apply") }}</v-btn
              >
            </v-col>
          </div>
        </v-col>
      </div>
      <v-card class="pmt-card" outlined elevation="0">
        <v-overlay :absolute="true" :value="loadingSummary">
          <v-progress-circular
            class="loader"
            :size="50"
            color="primary"
            indeterminate
          >
          </v-progress-circular>
        </v-overlay>
        <h4 class="card-title pt-3">Nasional</h4>
        <v-card-text>
          <v-carousel
            class="pmt-carousel"
            height="550"
            :cycle="slide.cycle.all"
            interval="5000"
            hide-delimiter-background
            delimiter-icon="mdi-checkbox-blank-circle"
            v-model="slide.breakpoint"
          >
            <template v-slot:prev="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-chevron-left</v-icon>
            </template>
            <template v-slot:next="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-chevron-right</v-icon>
            </template>
            <v-carousel-item class="pa-10" v-for="(slide, i) in slideItem">
              <div class="pmt-progress-wrap" v-for="item in slide">
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
                  <img
                    :src="item.logo_url + item.logo"
                    :alt="item.name + '-logo'"
                  />
                </div>

                <div class="bar-wrap" is="v-col" cols="10" xl="10">
                  <label>{{ item.name }}</label>
                  <div class="pmt-flex wrap row">
                    <div class="pt-2" is="v-col" cols="10" xl="10">
                      <v-progress-linear
                        :value="item.percentage"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-4"
                      ></v-progress-linear>
                    </div>
                    <div class="bar-label">
                      {{ item.average }}
                      <div class="font-weight-regular">({{ item.count }})</div>
                    </div>
                  </div>
                </div>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </div>
    <div class="page-section">
      <v-col cols="3" xl="3">
        <v-autocomplete
          class="ml-2"
          v-model="filter.location.province"
          :items="itemProvince"
          :search-input.sync="filter.location.searchProvince"
          item-text="name"
          item-value="id"
          flat
          hide-no-data
          hide-details
          dense
          clearable
          outlined
          :label="$t('ui.field.province')"
          rounded
          @input="changeSummaryByProvince"
          :disabled="input.isDisabled"
        >
        </v-autocomplete>
      </v-col>
      <v-card class="pmt-card" elevation="0">
        <v-overlay :absolute="true" :value="loadingSummaryFoProvince">
          <v-progress-circular
            class="loader"
            :size="50"
            color="primary"
            indeterminate
          >
          </v-progress-circular>
          <span>{{ $t("ui.message.prepare_data") }}</span>
        </v-overlay>
        <v-carousel
          height="550"
          :cycle="slide.cycle.province"
          interval="5000"
          :hide-delimiters="true"
          hide-delimeters-background
          :show-arrows-on-hover="true"
          v-model="slide.breakpointProvince"
        >
          <template v-for="(item, index) in slideProvince">
            <v-carousel-item
              v-if="(index + 1) % columns === 1 || columns === 1"
              :key="index"
            >
              <div class="pmt-flex is-row wrap at-center">
                <template v-for="(n, i) in columns">
                  <template v-if="+index + i < slideProvince.length">
                    <v-col :key="i">
                      <v-card
                        v-if="+index + i < slideProvince.length"
                        class="ma-4 pmt-card"
                        outlined
                        elevation="0"
                        width="500"
                        height="500"
                      >
                        <h4 class="card-title pt-3">
                          {{ slideProvince[+index + i].province_name }}
                        </h4>
                        <v-card-text class="pa-5">
                          <div
                            class="pmt-progress-wrap"
                            v-for="item in slideProvince[+index + i].data"
                          >
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
                              <img
                                :src="item.logo_url + item.logo"
                                :alt="item.name + '-logo'"
                              />
                            </div>
                            <div class="bar-wrap" is="v-col" cols="10" xl="10">
                              <label>{{ item.name }}</label>
                              <div class="pmt-flex wrap row">
                                <div class="pt-2" is="v-col" cols="10" xl="10">
                                  <v-progress-linear
                                    :value="item.percentage"
                                    height="12px"
                                    rounded
                                    color="#74B8F6"
                                    class="mt-4"
                                  ></v-progress-linear>
                                </div>
                                <div class="bar-label">
                                  {{ item.average }}
                                  <div class="font-weight-regular">
                                    ({{ item.count }})
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                </template>
              </div>
            </v-carousel-item>
          </template>
        </v-carousel>
      </v-card>
      <!-- <v-slide-group class="mt-5" v-model="slide.province">
        <v-slide-item v-for="(slide, i) in slideExample">
          <v-card
            class="ma-4 pmt-card"
            outlined
            elevation="0"
            width="500"
            height="600"
          >
            <h4 class="card-title pt-3">Nama provinsi</h4>
            <v-card-text class="pa-5">
              <div class="pmt-progress-wrap" v-for="item in slide">
                <div
                  class="icon"
                  :style="'--backgroundIcon:' + avatarBackground(item.name)"
                >
                  <span>{{ item.name.substr(0, 1) }}</span>
                </div>
                <div class="bar-wrap" is="v-col" cols="10" xl="10">
                  <label>{{ item.name }}</label>
                  <div class="pmt-flex wrap row">
                    <div class="pt-2" is="v-col" cols="10" xl="10">
                      <v-progress-linear
                        :value="item.percentage"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-4"
                      ></v-progress-linear>
                    </div>
                    <div class="bar-label">
                      {{ item.range }}
                      <div class="font-weight-regular">
                        ({{ item.total_test }})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-slide-item>
      </v-slide-group> -->
    </div>
  </section>
</template>

<script src="./SigmonV2.js"></script>

<style lang="scss" src="./SigmonV2.scss"></style>
