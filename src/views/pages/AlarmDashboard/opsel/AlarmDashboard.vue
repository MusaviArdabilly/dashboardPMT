<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <section class="single-page p-0">
    <!-- <NavBar /> -->
    <div class="title mt-5 ml-5">
      <h4>{{ $t("general.menu.alarm_dashboard") }}</h4>
    </div>
    <NavigationCellAndFo
      :link="{
        cellular: '/dashboard/alarm-dashboard',
        fo: '/dashboard/fo/alarm-dashboard',
      }"
      is-page="Operator Cellular"
    />
    <v-row>
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
          width="100%"
          class="text-capitalize white--text"
          color="#1976D2"
          @click="submitFilter"
        >
          {{ $t("ui.button_submit") }}
        </v-btn>
      </v-col>
      <v-col lg="1">
        <v-btn
          elevation="0"
          width="100%"
          class="text-capitalize"
          @click="resetFilter"
          >Reset</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <div class="font-weight-bold text-center" style="font-size: 20px">
          Critical
        </div>
      </v-col>
      <v-col lg="4" v-for="(item, i) in critical" :key="i">
        <v-card class="pa-5" height="100%">
          <div class="font-weight-bold d-flex justify-center align-center">
            <img
              width="50px"
              height="40px"
              :src="pmt_url + item.opsel.logo"
              :alt="item.opsel.name"
            />
            <div class="ml-2">{{ item.opsel.name }}</div>
          </div>
          <apexchart
            type="donut"
            :options="optionsCritical"
            :series="
              item.data == null
                ? [0, 0]
                : [item.data.active_alarm, item.data.closed_alarm]
            "
          ></apexchart>
          <v-card flat outlined class="pa-5 mt-5">
            <v-row>
              <v-col lg="4" class="text-center">
                <div>Hardware</div>
                <div>
                  {{ item.data == null ? 0 : item.data.hardware }}
                </div>
              </v-col>
              <v-col lg="4" class="text-center">
                <div>Transmission</div>
                <div>
                  {{ item.data == null ? 0 : item.data.transmission }}
                </div>
              </v-col>
              <v-col lg="4" class="text-center">
                <div>Power Failure</div>
                <div>
                  {{ item.data == null ? 0 : item.data.power_failure }}
                </div>
              </v-col>
            </v-row>
          </v-card>
          <div
            class="pa-5 text-center cyan--text font-weight-bold details"
            @click="seeDetails(item)"
          >
            {{ $t("ui.button_details") }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <hr />

    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <div class="font-weight-bold text-center" style="font-size: 20px">
          Major
        </div>
      </v-col>
      <v-col lg="4" v-for="(item, i) in major" :key="i">
        <v-card class="pa-5" height="100%">
          <div class="font-weight-bold d-flex justify-center align-center">
            <img
              width="50px"
              height="40px"
              :src="pmt_url + item.opsel.logo"
              :alt="item.opsel.name"
            />
            <div class="ml-2">{{ item.opsel.name }}</div>
          </div>
          <apexchart
            type="donut"
            :options="optionsMajor"
            :series="
              item.data == null
                ? [0, 0]
                : [item.data.active_alarm, item.data.closed_alarm]
            "
          ></apexchart>

          <v-card flat outlined class="pa-5 mt-5">
            <v-row>
              <v-col lg="4" class="text-center">
                <div>Hardware</div>
                <div>
                  {{ item.data == null ? 0 : item.data.hardware }}
                </div>
              </v-col>
              <v-col lg="4" class="text-center">
                <div>Transmission</div>
                <div>
                  {{ item.data == null ? 0 : item.data.transmission }}
                </div>
              </v-col>
              <v-col lg="4" class="text-center">
                <div>Power Failure</div>
                <div>
                  {{ item.data == null ? 0 : item.data.power_failure }}
                </div>
              </v-col>
            </v-row>
          </v-card>
          <div
            class="pa-5 text-center cyan--text font-weight-bold details"
            @click="seeDetails(item)"
          >
            {{ $t("ui.button_details") }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <hr />

    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <div class="font-weight-bold text-center" style="font-size: 20px">
          Minor
        </div>
      </v-col>
      <v-col lg="4" v-for="(item, i) in minor" :key="i">
        <v-card class="pa-5" height="100%">
          <div class="font-weight-bold d-flex justify-center align-center">
            <img
              width="50px"
              height="40px"
              :src="pmt_url + item.opsel.logo"
              :alt="item.opsel.name"
            />
            <div class="ml-2">{{ item.opsel.name }}</div>
          </div>
          <apexchart
            type="donut"
            :options="optionsMinor"
            :series="
              item.data == null
                ? [0, 0]
                : [item.data.active_alarm, item.data.closed_alarm]
            "
          ></apexchart>
          <v-card flat outlined class="pa-5 mt-5">
            <v-row>
              <v-col lg="4" class="text-center">
                <div>Hardware</div>
                <div>
                  {{ item.data == null ? 0 : item.data.hardware }}
                </div>
              </v-col>
              <v-col lg="4" class="text-center">
                <div>Transmission</div>
                <div>
                  {{ item.data == null ? 0 : item.data.transmission }}
                </div>
              </v-col>
              <v-col lg="4" class="text-center">
                <div>Power Failure</div>
                <div>
                  {{ item.data == null ? 0 : item.data.power_failure }}
                </div>
              </v-col>
            </v-row>
          </v-card>
          <div
            class="pa-5 text-center cyan--text font-weight-bold details"
            @click="seeDetails(item)"
          >
            {{ $t("ui.button_details") }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script src="./AlarmDashboard.js"></script>

<style lang="scss" src="./AlarmDashboard.scss" scoped></style>
