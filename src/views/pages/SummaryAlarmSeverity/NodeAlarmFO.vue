<template>
  <div class="qoe">
    <NavbarBigScreen />

    <v-row class="pl-5">
      <v-col cols="2">
        <v-btn
          to="/summary-alarm-operator"
          elevation="0"
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
          color="primary"
          height="50"
          width="100%"
        >
          {{ $t("general.menu.fixed_broadband") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pa-5">
      <v-col v-if="dataAlarm.length > 0" lg="2">
        <v-card height="690px" class="pa-5 bg-alarm text-center">
          <div class="font-weight-bold white--text">Alarm Active</div>
          <div>
            <div class="alarm-summary">
              <div>There are</div>
              <div id="total-alarm">{{ dataAlarm.length }}</div>
              <div>Alarm Active by now</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col v-if="dataAlarm.length == 0" lg="2">
        <v-card height="670px" class="pa-5 bg-alarm-zero text-center">
          <div class="font-weight-bold white--text">Alarm Active</div>
          <div>
            <div class="alarm-summary">
              <div>There are</div>
              <div id="total-alarm">{{ dataAlarm.length }}</div>
              <div>Alarm Active by now</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col lg="10">
        <div class="font-weight-bold mb-5">List of Alarm</div>
        <v-card>
          <v-overlay :absolute="true" :value="loadingAlarmList" opacity="0.1">
            <v-progress-circular
              class="loader"
              :size="50"
              color="primary"
              indeterminate
              v-if="loadingAlarmList != false"
            >
            </v-progress-circular>
          </v-overlay>
          <!-- Alarm Card -->
          <v-row style="height: 700px" class="pa-3">
            <v-carousel
              height="650"
              cycle
              interval="5000"
              :hide-delimiters="true"
              hide-delimiter-background
              v-model="slide.breakpoint"
            >
              <template v-slot:prev="{ on, attrs }">
                <v-icon class="text-h3" v-bind="attrs" v-on="on"
                  >mdi-chevron-left</v-icon
                >
              </template>
              <template v-slot:next="{ on, attrs }">
                <v-icon class="text-h3" v-bind="attrs" v-on="on"
                  >mdi-chevron-right</v-icon
                >
              </template>
              <template v-for="(slide, index) in dataAlarm">
                <v-carousel-item
                  v-if="(index + 1) % columns === 1 || columns === 1"
                  :key="index"
                >
                  <div class="pmt-flex is-row wrap in-center">
                    <template v-for="(n, i) in columns">
                      <template v-if="+index + i < dataAlarm.length">
                        <v-col :key="i">
                          <v-card
                            v-if="+index + i < dataAlarm.length"
                            height="600px"
                            max-width="50vh"
                            class="ma-2 alarm-card"
                          >
                            <div class="pmt-flex wrap is-row operator-name">
                              <v-col cols="2">
                                <div
                                  is="v-avatar"
                                  :color="
                                    avatarBackground(
                                      dataAlarm[+index + i].operator_name
                                    )
                                  "
                                  size="40"
                                >
                                  <span class="white--text">{{
                                    stringInitial(
                                      dataAlarm[+index + i].operator_name
                                    )
                                  }}</span>
                                </div>
                              </v-col>
                              <v-col cols="10">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <p
                                      class="name text-h6 font-weight-bold"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      {{ dataAlarm[+index + i].operator_name }}
                                    </p>
                                  </template>
                                  <span>
                                    {{
                                      dataAlarm[+index + i].operator_name
                                    }}</span
                                  >
                                </v-tooltip>
                              </v-col>
                            </div>
                            <v-divider class="mb-10"></v-divider>
                            <div class="pmt-flex wrap is-column alarm-name">
                              <p style="color: grey">Alarm Name</p>
                              <p class="font-weight-bold">
                                {{ dataAlarm[+index + i].summary }}
                              </p>
                            </div>
                            <div class="pmt-flex wrap is-column severity-wrap">
                              <v-col
                                ><p style="color: grey">Severity</p>

                                <v-chip
                                  style="text-align: center"
                                  :color="
                                    dataAlarm[+index + i].severity === 0
                                      ? '#D9D9D9'
                                      : dataAlarm[+index + i].severity == 1
                                      ? '#D7EFE1'
                                      : dataAlarm[+index + i].severity == 2
                                      ? '#FFF5E1'
                                      : dataAlarm[+index + i].severity == 3
                                      ? '#FFE8D1'
                                      : dataAlarm[+index + i].severity == 4
                                      ? '#FFD9D9'
                                      : '#D9D9D9'
                                  "
                                  ><span class="text-center">{{
                                    dataAlarm[+index + i].severity == 0
                                      ? "Undefined"
                                      : dataAlarm[+index + i].severity == 1
                                      ? "Minor"
                                      : dataAlarm[+index + i].severity == 2
                                      ? "Medium"
                                      : dataAlarm[+index + i].severity == 3
                                      ? "Major"
                                      : dataAlarm[+index + i].severity == 4
                                      ? "Critical"
                                      : "Undefine"
                                  }}</span></v-chip
                                ></v-col
                              >
                            </div>
                            <v-divider class="mt-10 mb-3"></v-divider>
                            <div class="pmt-flex-wrap is-column">
                              <v-col class="ml-3" cols="10" lg="10" xl="10">
                                <div class="alarm-nodes-wrap">
                                  <p style="color: grey">
                                    Jumlah Perangkat Terdampak
                                  </p>
                                  <li
                                    @click="showNodeList(dataAlarm[+index + i])"
                                    style="
                                      color: rgba(22, 156, 214, 1);
                                      cursor: pointer;
                                    "
                                    class="font-weight-bold ml-5"
                                  >
                                    {{
                                      dataAlarm[+index + i].affected_node
                                        ? dataAlarm[+index + i].affected_node
                                            .length
                                        : 0
                                    }}
                                    Nodes
                                  </li>
                                  <p style="color: grey" class="mt-5">
                                    Jumlah Segmen Terdampak
                                  </p>
                                  <li
                                    @click="
                                      showSegmentList(dataAlarm[+index + i])
                                    "
                                    style="
                                      color: rgba(22, 156, 214, 1);
                                      cursor: pointer;
                                    "
                                    class="font-weight-bold ml-5"
                                  >
                                    {{
                                      dataAlarm[+index + i].affected_segment
                                        ? dataAlarm[+index + i].affected_segment
                                            .length
                                        : 0
                                    }}
                                    Segments
                                  </li>
                                </div>
                              </v-col>
                              <v-col class="ml-3" cols="10" lg="10" xl="10">
                                <div class="alarm-nodes-wrap">
                                  <span
                                    class="font-weight-bold text-center ml-8"
                                    style="
                                      color: rgba(22, 156, 214, 1);
                                      cursor: pointer;
                                    "
                                    @click="showDetails(dataAlarm[+index + i])"
                                    >{{ $t("ui.button_details") }}</span
                                  >
                                </div>
                              </v-col>
                            </div>
                          </v-card></v-col
                        >
                      </template>
                    </template>
                  </div>
                </v-carousel-item>
              </template>
            </v-carousel>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialog Node -->
    <v-dialog v-model="nodeDialog" width="500" height="1000" persistent>
      <v-card v-for="(item, index) in selectedNode" :key="index" class="pa-10">
        <v-row class="d-flex justify-space-between">
          <p class="font-weight-bold mt-3">Perangkat Terdampak</p>
          <v-icon @click="nodeDialog = false">mdi-close</v-icon>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <div v-for="(data, index) in item.affected_node" :key="index">
          <div class="d-flex">
            <p class="font-weight-bold mr-5">{{ index + 1 }}.</p>
            <div class="d-flex flex-column">
              <div>
                <span class="font-weight-bold">ID: </span
                ><span>{{ data.id }}</span>
              </div>
              <div>
                <span class="font-weight-bold">Coordinate: </span>
                <span>{{ data.coordinate }}</span>
              </div>
            </div>
          </div>
        </div>

        <v-divider class="my-5"></v-divider>
        <v-row class="d-flex justify-center mt-5">
          <v-btn outlined rounded class="px-10" @click="showDetails(item)"
            >See Alarm Details</v-btn
          >
        </v-row>
      </v-card>
    </v-dialog>
    <!-- Dialog Segment -->
    <v-dialog v-model="segmentDialog" width="500" height="1000" persistent>
      <v-card
        v-for="(item, index) in selectedSegment"
        :key="index"
        class="pa-10"
      >
        <v-row class="d-flex justify-space-between align-center">
          <p class="font-weight-bold mt-3">Segment Terdampak</p>
          <v-icon @click="segmentDialog = false">mdi-close</v-icon>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <div v-for="(data, index) in item.affected_segment" :key="index">
          <div class="d-flex">
            <p class="font-weight-bold mr-5">{{ index + 1 }}.</p>
            <div class="d-flex flex-column">
              <div>
                <span class="font-weight-bold">ID: </span
                ><span>{{ data.id }}</span>
              </div>
              <div>
                <span class="font-weight-bold">Coordinate: </span>
                <span>{{ data.coordinate_fe }}</span>
              </div>
            </div>
          </div>
        </div>
        <v-divider class="my-5"></v-divider>
        <v-row class="d-flex justify-center mt-5">
          <v-btn outlined rounded class="px-10" @click="showDetails(item)"
            >See Alarm Details</v-btn
          >
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Dialog Details -->
    <v-dialog v-model="detailDialog" width="1000" persistent>
      <v-card
        v-for="(item, index) in selectedDetail"
        :key="index"
        class="pa-10"
      >
        <v-row class="d-flex justify-space-between">
          <div class="d-flex justify-center align-center">
            <div
              is="v-avatar"
              :color="avatarBackground(item.operator_name)"
              size="40"
            >
              <span class="white--text">{{
                stringInitial(item.operator_name)
              }}</span>
            </div>
            <p class="font-weight-bold ml-5 mt-3">
              {{ item.operator_name }}
            </p>
          </div>

          <v-icon @click="detailDialog = false">mdi-close</v-icon>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col lg="8">
            <v-row class="d-flex flex-column">
              <v-col>
                <p style="color: grey">Alarm Name</p>
                <p class="font-weight-bold">
                  {{ item.summary }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col lg="4">
                <p style="color: grey">Severity</p>
                <v-chip
                  style="text-align:center; 5.5rem"
                  :color="
                    item.severity === 0
                      ? '#D9D9D9'
                      : item.severity == 1
                      ? '#D7EFE1'
                      : item.severity == 2
                      ? '#FFF5E1'
                      : item.severity == 3
                      ? '#FFE8D1'
                      : item.severity == 4
                      ? '#FFD9D9'
                      : '#D9D9D9'
                  "
                  >{{
                    item.severity == 0
                      ? "Undefined"
                      : item.severity == 1
                      ? "Minor"
                      : item.severity == 2
                      ? "Medium"
                      : item.severity == 3
                      ? "Major"
                      : item.severity == 4
                      ? "Critical"
                      : "Undefine"
                  }}</v-chip
                >
              </v-col>
              <v-col lg="4">
                <p style="color: grey">Created at</p>
                <p class="font-weight-bold">
                  {{ item.created_at | moment }}
                </p>
              </v-col>
              <v-col lg="4">
                <p style="color: grey">Current Porcess</p>
                <p class="font-weight-bold">
                  {{ item.current_process }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col lg="4">
                <p style="color: grey">Target to Resolved</p>
                <div class="d-flex">
                  <p class="font-weight-bold mr-2">
                    {{ item.target_to_resolved }}
                  </p>
                  <span> Jam</span>
                </div>
              </v-col>
              <v-col lg="4">
                <p style="color: grey">Summary</p>
                <p class="font-weight-bold">BLACKOUT</p></v-col
              >
            </v-row>
            <v-divider></v-divider>
            <v-row class="mt-3">
              <v-col lg="6"
                ><p style="color: grey" class="mt-5">
                  Jumlah Perangkat Terdampak
                </p>
                <li
                  @click="showNodeList(item)"
                  style="color: rgba(22, 156, 214, 1); cursor: pointer"
                  class="font-weight-bold ml-5"
                >
                  {{ item.affected_node ? item.affected_node.length : 0 }}
                  Nodes
                </li></v-col
              >
              <v-divider vertical></v-divider>
              <v-col lg="6"
                ><p style="color: grey" class="mt-5">
                  Jumlah Segment Terdampak
                </p>
                <li
                  @click="showSegmentList(item)"
                  style="color: rgba(22, 156, 214, 1); cursor: pointer"
                  class="font-weight-bold ml-5"
                >
                  {{ item.affected_segment ? item.affected_segment.length : 0 }}
                  Segments
                </li></v-col
              >
            </v-row>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col lg="4">
            <p style="color: grey">Description</p>
            <p class="text-h6 font-weight-semibold">
              {{ item.description }}
            </p>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./NodeAlarmFO"></script>

<style scoped src="./NodeAlarmFO.scss" lang="scss"></style>
