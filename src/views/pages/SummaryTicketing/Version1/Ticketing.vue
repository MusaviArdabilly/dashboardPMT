<template>
  <div class="ticketing-summary">
    <NavbarBigScreen />
    <NavigationCellAndFo
      :link="{ cellular: '/summary-ticketing', fo: '/fo/summary-ticketing' }"
      is-page="Operator Cellular"
    />
    <v-row class="pl-5 pr-5">
      <v-col lg="2">
        <div class="ticketing-title font-weight-bold">
          {{ $t("general.menu.ticketing_summary") }}
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col lg="3" class="d-flex mt-2">
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
            v-model="filter.date.startDate"
            @input="filterDate"
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
            v-model="filter.date.endDate"
            @input="filterDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col lg="1" class="mt-2">
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
    <!-- <v-row class="mt-5">
      <v-col lg="2">
        <v-autocomplete
          @input="selectCity"
          v-model="selected_province"
          :items="item_province"
          :search-input.sync="searchProvice"
          item-text="name"
          item-value="id"
          class="mx-4 elevation-2"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.province')"
          background-color=""
          solo
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
          class="mx-4 elevation-2"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.city')"
          background-color="#fff"
          solo
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
          class="mx-4 elevation-2"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.district')"
          background-color="#fff"
          solo
        ></v-autocomplete>
      </v-col>
      <v-col lg="2">
        <v-autocomplete
          v-model="selected_sub_district"
          :items="item_sub_district"
          :search-input.sync="searchSubDistrict"
          item-text="name"
          item-value="id"
          class="mx-4 elevation-2"
          flat
          hide-no-data
          hide-details
          dense
          :label="$t('ui.field.sub_district')"
          background-color="#fff"
          solo
        ></v-autocomplete>
      </v-col>

      <v-col lg="1">
        <v-btn
          elevation="0"
          class="mr-5 text-capitalize"
          color="primary"
          rounded
          width="100%"
          @click="applyFilter"
          >{{$t("ui.button_apply")}}</v-btn
        >
      </v-col>
      <v-col lg="1">
        <v-btn
          @click="resetFilter"
          elevation="0"
          class="text-capitalize"
          rounded
          width="100%"
          color="#fff"
          >Reset</v-btn
        >
      </v-col>
    </v-row> -->
    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <v-carousel
          height="700"
          cycle
          hide-delimiter-background
          show-arrows-on-hover
        >
          <template v-slot:prev="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </template>
          <template v-slot:next="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </template>
          <v-carousel-item v-for="item in ticket_summary" :key="item.index">
            <v-sheet class="pl-5 pr-5">
              <div class="d-flex pa-5 justify-center align-center">
                <img
                  width="75px"
                  height="75px"
                  :src="pmt_url + item.logo"
                  alt="logo"
                />
                <div :class="[' ml-5 font-weight-bold', `${item.name}`]">
                  {{ item.name }}
                </div>
              </div>
              <v-divider></v-divider>
              <v-row class="mt-5">
                <v-col lg="4">
                  <div class="font-weight-bold text-center">Whole Ticket</div>
                  <apexchart
                    class="pa-10"
                    type="donut"
                    :options="chartOptions"
                    :series="item.data"
                  ></apexchart>
                </v-col>
                <v-divider vertical class="mb-7"></v-divider>
                <v-col lg="8">
                  <div class="font-weight-bold text-center">Source Detail</div>
                  <v-row class="mt-5">
                    <v-col lg="4">
                      <div class="font-weight-bold text-center">MonTel</div>
                      <apexchart
                        class="pa-10"
                        type="donut"
                        :options="sourceOptions"
                        :series="
                          item.montel.some((v) => v !== item.montel[0])
                            ? item.montel
                            : []
                        "
                      ></apexchart>
                    </v-col>
                    <v-divider vertical class="mb-7"></v-divider>

                    <v-col lg="4">
                      <div class="font-weight-bold text-center">QoE</div>
                      <apexchart
                        class="pa-10"
                        type="donut"
                        :options="sourceOptions"
                        :series="
                          item.qoe.some((v) => v !== item.qoe[0])
                            ? item.qoe
                            : []
                        "
                      ></apexchart>
                    </v-col>
                    <v-divider vertical class="mb-7"></v-divider>
                    <v-col lg="4">
                      <div class="font-weight-bold text-center">QoS</div>
                      <apexchart
                        class="pa-10"
                        type="donut"
                        :options="sourceOptions"
                        :series="
                          item.qos.some((v) => v !== item.qos[0])
                            ? item.qos
                            : []
                        "
                      ></apexchart>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./Ticketing.js"></script>

<style scoped>
.ticketing-summary {
  padding: 0px 20px;
  background: #f6f6f6 !important;
  height: 100%;
}

.ticketing-title {
  font-size: 24px;
}

.refresh-btn {
  border-radius: 20px !important;
}
.v-progress-linear--rounded {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

.crd-coverage {
  border: 1px solid black !important;
  /* border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important; */
}

.Telkomsel {
  margin-top: 25px;
}

.Indosat {
  margin-top: 30px;
  padding-bottom: 27px;
}

.XL {
  margin-top: 30px;
}

.H3I {
  margin-top: 25px;
}

.Smartfren {
  margin-top: 25px;
}

.STI {
  margin-top: 30px;
}

.card-items {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
}

.ticketing-card {
  border-radius: 25px;
}
</style>
