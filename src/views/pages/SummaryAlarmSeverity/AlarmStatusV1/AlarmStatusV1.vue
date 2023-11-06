<template>
  <div class="alarm-severity">
    <NavbarBigScreen />
    <NavigationCellAndFo
      :link="{
        cellular: '/summary-alarm-severity',
        fo: '/fo/summary-alarm-severity',
      }"
      is-page="Operator Cellular"
    />
    <!-- Major -->
    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <div class="font-weight-bold text-center">Major</div>
      </v-col>
      <v-col>
        <v-slide-group v-model="onboarding" class="pa-4" show-arrows>
          <v-slide-item v-for="(item, i) in alarm_major" :key="i">
            <v-card class="pa-5 ma-5" width="100%">
              <div class="font-weight-bold text-center">
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
                :options="criticalOptions"
                :series="
                  item.data == null
                    ? [0, 0]
                    : [item.data.active_alarm, item.data.closed_alarm]
                "
              ></apexchart>

              <v-card flat outlined class="pa-5 mt-5">
                <v-row>
                  <v-col lg="4" class="text-center">
                    <small>Hardware</small>
                    <div>{{ item.data == null ? 0 : item.data.hardware }}</div>
                  </v-col>
                  <v-col lg="4" class="text-center">
                    <small>Transmission</small>
                    <div>
                      {{ item.data == null ? 0 : item.data.transmission }}
                    </div>
                  </v-col>
                  <v-col lg="4" class="text-center">
                    <small>Power Failure</small>
                    <div>
                      {{ item.data == null ? 0 : item.data.power_failure }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <!-- Critical -->
    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <div class="font-weight-bold text-center">Critical</div>
      </v-col>
      <v-col>
        <v-slide-group v-model="onboarding" class="pa-4" show-arrows>
          <v-slide-item v-for="(item, i) in alarm_critical" :key="i">
            <v-card class="pa-5 ma-5" width="100%">
              <div class="font-weight-bold text-center">
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
                :options="majorOptions"
                :series="
                  item.data == null
                    ? [0, 0]
                    : [item.data.active_alarm, item.data.closed_alarm]
                "
              ></apexchart>

              <v-card flat outlined class="pa-5 mt-5">
                <v-row>
                  <v-col lg="4" class="text-center">
                    <small>Hardware</small>
                    <div>{{ item.data == null ? 0 : item.data.hardware }}</div>
                  </v-col>
                  <v-col lg="4" class="text-center">
                    <small>Transmission</small>
                    <div>
                      {{ item.data == null ? 0 : item.data.transmission }}
                    </div>
                  </v-col>
                  <v-col lg="4" class="text-center">
                    <small>Power Failure</small>
                    <div>
                      {{ item.data == null ? 0 : item.data.power_failure }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <!-- Minor -->
    <v-row class="mt-10 pa-5">
      <v-col lg="12">
        <div class="font-weight-bold text-center">Minor</div>
      </v-col>
      <v-col>
        <v-slide-group v-model="onboarding" class="pa-4" show-arrows>
          <v-slide-item v-for="(item, i) in alarm_minor" :key="i">
            <v-card class="pa-5 ma-5" width="100%">
              <div class="font-weight-bold text-center">
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
                :options="minorOptions"
                :series="
                  item.data == null
                    ? [0, 0]
                    : [item.data.active_alarm, item.data.closed_alarm]
                "
              ></apexchart>

              <v-card flat outlined class="pa-5 mt-5">
                <v-row>
                  <v-col lg="4" class="text-center">
                    <small>Hardware</small>
                    <div>{{ item.data == null ? 0 : item.data.hardware }}</div>
                  </v-col>
                  <v-col lg="4" class="text-center">
                    <small>Transmission</small>
                    <div>
                      {{ item.data == null ? 0 : item.data.transmission }}
                    </div>
                  </v-col>
                  <v-col lg="4" class="text-center">
                    <small>Power Failure</small>
                    <div>
                      {{ item.data == null ? 0 : item.data.power_failure }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./AlarmStatusV1.js"></script>

<style></style>
