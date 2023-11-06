<template>
  <div class="qos-bad-spot">
    <v-card class="pa-5 mt-5">
      <v-toolbar elevation="0">
        <v-col cols="2" xl="2">
          <v-select
            class="mt-6"
            v-model="selected_opsel_temp"
            :items="item_opsel"
            item-text="name"
            item-value="id"
            solo
            dense
            placeholder="Network Operator"
          ></v-select>
        </v-col>
        <!-- <v-col cols="2">
          <v-select
            v-model="selected_tech"
            :items="technology"
            item-text="name"
            item-value="name"
            solo
            dense
          ></v-select>
        </v-col> -->

        <v-col cols="1" xl="1">
          <v-btn
            elevation="0"
            class="mr-5 text-capitalize"
            color="primary"
            rounded
            block
            @click="filterOperator"
            >{{ $t("ui.button_apply") }}</v-btn
          >
        </v-col>
        <v-col cols="1" xl="1">
          <v-btn
            elevation="0"
            class="text-capitalize"
            rounded
            color=""
            block
            @click="reset"
            >Reset</v-btn
          >
        </v-col>
        <v-spacer></v-spacer>
        <!-- <v-col cols="2">
          <v-btn
            width="100%"
            style="color: #5e5873"
            color="white"
            @click="setupCreateTicket()"
            :disabled="selected.length == 0 || selected_opsel == 0"
          >
            <div class="mr-2 text-capitalize">{{$t("ui.button_create_ticket")}}</div>
            <v-icon>mdi-email-send-outline</v-icon>
          </v-btn>
        </v-col> -->

        <!-- <v-col cols="2">
        <download-excel
          class="btn btn-default"
          :data="qos_test.data"
          :fields="json_fields"
          worksheet="My Worksheet"
          name="qos_test_result_matrix.xls"
        >
          <v-btn width="100%" style="color: #5e5873" color="white">
            <div class="mr-2 text-capitalize">{{$t("ui.button_download")}}</div>
            <v-icon>mdi-file-download-outline</v-icon>
          </v-btn>
        </download-excel>
      </v-col> -->
      </v-toolbar>
      <v-data-table
        v-model="selected"
        :loading="loading"
        :headers="headers"
        :items="qos_test.data"
        :single-select="singleSelect"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
        hide-default-footer
        item-key="name"
        show-select
        class="elevation-0 mt-5"
      >
        <template v-slot:item.test_date="{ item }">
          <div>{{ item.test_date | moment }}</div>
        </template>
        <template v-slot:item.district="{ item }">
          <div>{{ item.district == null ? "-" : item.district.name }}</div>
        </template>

        <template v-slot:item.test_result_data="{ item }">
          <v-btn
            outlined
            elevation="0"
            class="mr-5 text-capitalize grey--text"
            color="white"
            @click="viewModal(item)"
            >View</v-btn
          >
        </template>

        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
          </div>
        </template>
      </v-data-table>
      <v-container class="max-width">
        <v-row justify="end" align="center">
          <v-col cols="2">
            <v-select
              :items="pagination.rowsPerPageItems"
              class="item-per-page"
              v-model="pagination.rowsPerPage"
              @change="setTableLimit"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="setTable"
        ></v-pagination>
      </v-container>
      <v-dialog width="1800" v-model="dialog" style="z-index: 1999">
        <v-card>
          <div class="d-flex pa-5" style="background-color: black">
            <v-spacer></v-spacer>
            <v-icon color="#fff" @click="dialog = false">mdi-close</v-icon>
          </div>
          <div class="pa-5">
            <v-row>
              <v-col lg="12">
                <v-row>
                  <v-col lg="9" class="font-weight-bold"> Test Profile </v-col>
                  <v-col lg="3">
                    <v-card class="px-5 py-2" v-if="selected_item != null"
                      >Last update:
                      {{
                        selected_item.created_at == undefined
                          ? ""
                          : selected_item.created_at | moment
                      }}</v-card
                    >
                  </v-col>
                </v-row>
                <v-simple-table class="modal-tb mt-3">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Tanggal Pengetesan</th>
                        <th class="text-left">Provinsi</th>
                        <th class="text-left">Kota/Kab.</th>
                        <th class="text-left">Kecamatan</th>
                        <th class="text-left">POI</th>
                        <th class="text-left">Location</th>
                        <th class="text-left">Event</th>
                        <th class="text-left">Operator</th>
                        <th class="text-left">Test Type</th>
                        <th class="text-left">Evidence File</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ selected_item.test_date | moment }}</td>
                        <td>{{ selected_item.province.name }}</td>
                        <td>{{ selected_item.city.name }}</td>
                        <td>
                          {{
                            selected_item.district == null
                              ? "-"
                              : selected_item.district.name
                          }}
                        </td>
                        <td>{{ selected_item.poi }}</td>
                        <td>{{ selected_item.location }}</td>
                        <td>{{ selected_item.event }}</td>
                        <td>{{ selected_item.cell_operator.name }}</td>
                        <td>{{ selected_item.test_type }}</td>
                        <td>
                          <v-btn
                            v-if="isViewer != true"
                            outlined
                            elevation="0"
                            class="mr-5 text-capitalize grey--text"
                            color="white"
                            @click="downloadFile(selected_item.file)"
                            >{{ $t("ui.button_download") }}</v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col lg="12">
                <div class="font-weight-bold mb-5">Test Result Data</div>
                <v-card flat height="600" class="overflow-y-auto">
                  <v-row class="px-3 mt-2">
                    <v-col lg="12" class="modal-tb">
                      <div class="font-weight-bold mb-3">
                        Signal Strength & Signal Quality
                      </div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <div class="font-weight-bold">Signal Strength</div>
                          <v-row class="mt-5">
                            <v-col lg="6">
                              <div>4G Average RSRP</div>
                              <div>3G Average RSCP</div>
                              <div>2G Average Rx Level</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_sq_test.ss_4g_avg_rsrp }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.ss_3g_avg_rscp }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sq_test
                                    .ss_2g_avg_rx_level == null
                                    ? "-"
                                    : selected_item.qos_sq_test
                                        .ss_2g_avg_rx_level
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="6">
                          <div class="font-weight-bold">Signal Quality</div>
                          <v-row class="mt-5">
                            <v-col lg="6">
                              <div>4G Average RSRQ</div>
                              <div>3G Average ECIO</div>
                              <div>2G Average Rx Qual</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_sq_test.sq_4g_avg_rsrq }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.sq_3g_avg_ecio }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sq_test.sq_2g_avg_rx_qual ==
                                  null
                                    ? "-"
                                    : selected_item.qos_sq_test
                                        .sq_2g_avg_rx_qual
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <div class="font-weight-bold">
                            Bad Signal Strength
                          </div>
                          <v-row class="mt-5">
                            <v-col lg="6">
                              <div>4G Total</div>
                              <div>4G Sample</div>
                              <div>3G Total</div>
                              <div>3G Sample</div>
                              <div>2G Total</div>
                              <div>2G Sample</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_sq_test.bss_4g_total }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.bss_4g_sample }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.bss_3g_total }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.bss_3g_sample }}
                              </div>

                              <div>
                                :
                                {{
                                  selected_item.qos_sq_test.bss_2g_total == null
                                    ? "-"
                                    : selected_item.qos_sq_test.bss_2g_total
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sq_test.bss_2g_sample ==
                                  null
                                    ? "-"
                                    : selected_item.qos_sq_test.bss_2g_sample
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="6">
                          <div class="font-weight-bold">Bad Signal Quality</div>
                          <v-row class="mt-5">
                            <v-col lg="6">
                              <div>4G Total</div>
                              <div>4G Sample</div>
                              <div>3G Total</div>
                              <div>3G Sample</div>
                              <div>2G Total</div>
                              <div>2G Sample</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_sq_test.bsq_4g_total }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.bsq_4g_sample }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.bsq_3g_total }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sq_test.bsq_3g_sample }}
                              </div>

                              <div>
                                :
                                {{
                                  selected_item.qos_sq_test.bsq_2g_total == null
                                    ? "-"
                                    : selected_item.qos_sq_test.bsq_2g_total
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sq_test.bss_2g_sample ==
                                  null
                                    ? "-"
                                    : selected_item.qos_sq_test.bss_2g_sample
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- FTP RESULT-->
                    <v-col lg="12" class="modal-tb mt-5">
                      <div class="font-weight-bold mb-3">FTP Test</div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Average Download Speed</div>
                              <div>Max Download Speed</div>
                              <div>Min Download Speed</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_ftp_test.avg_dl_speed }}
                              </div>
                              <div>
                                : {{ selected_item.qos_ftp_test.max_dl_speed }}
                              </div>
                              <div>
                                :
                                {{ selected_item.qos_ftp_test.min_dl_speed }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Average Upload Speed</div>
                              <div>Max Upload Speed</div>
                              <div>Min Upload Speed</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_ftp_test.avg_ul_speed }}
                              </div>
                              <div>
                                : {{ selected_item.qos_ftp_test.max_ul_speed }}
                              </div>
                              <div>
                                :
                                {{ selected_item.qos_ftp_test.min_ul_speed }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- Browsing Test RESULT-->
                    <v-col lg="12" class="modal-tb mt-5">
                      <div class="font-weight-bold mb-3">Browsing Test</div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Average Browsing Speed</div>
                              <div>Max Browsing Speed</div>
                              <div>Min Browsing Speed</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_web_test.avg_browsing_speed
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_web_test.max_browsing_speed
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_web_test.min_browsing_speed
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- Capacity & Speed Test RESULT-->
                    <v-col lg="12" class="modal-tb mt-5">
                      <div class="font-weight-bold mb-3">
                        Capacity & Speed Test
                      </div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Avg Download Trhoughput</div>
                              <div>Max Download Trhoughput</div>
                              <div>Min Download Trhoughput</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_capacity_test
                                    .avg_dl_throughput
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_capacity_test
                                    .max_dl_throughput
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_capacity_test
                                    .min_dl_throughput
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Average Upload Speed</div>
                              <div>Max Upload Speed</div>
                              <div>Min Upload Speed</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_capacity_test
                                    .avg_ul_throughput
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_capacity_test
                                    .max_ul_throughput
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_capacity_test
                                    .min_ul_throughput
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- Ping, Youtube, Whatsapp Test RESULT-->
                    <v-col lg="12" class="modal-tb mt-5">
                      <div class="font-weight-bold mb-3">
                        Ping, Youtube, Whatsapp Test
                      </div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="4">
                          <v-row>
                            <v-col lg="6">
                              <div>Ping Package Loss</div>
                              <div>Ping Average Loss</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{ selected_item.qos_sub_test.ping_avg_delay }}
                              </div>
                              <div>
                                : {{ selected_item.qos_sub_test.ping_pkg_loss }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="4">
                          <v-row>
                            <v-col lg="6">
                              <div>Youtube Average Quality</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_sub_test.youtube_avg_quality
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="4">
                          <v-row>
                            <v-col lg="8">
                              <div>Whatsapp Call Quality Average</div>
                              <div>Whatsapp Call Success</div>
                              <div>Whatsapp Message Duration Average</div>
                              <div>Whatsapp Message Success</div>
                            </v-col>
                            <v-col lg="4" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_sub_test
                                    .wa_call_avg_voice_quality
                                }}
                              </div>
                              <div>
                                :
                                {{ selected_item.qos_sub_test.wa_call_success }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sub_test.wa_msg_avg_duration
                                }}
                              </div>
                              <div>
                                :
                                {{ selected_item.qos_sub_test.wa_msg_success }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- SMS Test RESULT-->
                    <v-col lg="12" class="modal-tb mt-5">
                      <div class="font-weight-bold mb-3">SMS Test</div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>On Net Total</div>
                              <div>On Net Total Under 1 Minute</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_sms_test.on_net_total }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sms_test
                                    .on_net_total_underx_minute
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Off Net Total</div>
                              <div>Off Net Total Under 1 Minute</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                : {{ selected_item.qos_sms_test.off_net_total }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_sms_test
                                    .off_net_total_underx_minute
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- Voice Call Test RESULT-->
                    <v-col lg="12" class="modal-tb mt-5">
                      <div class="font-weight-bold mb-3">Voice Call Test</div>
                      <v-divider></v-divider>
                      <v-row class="mt-2 mb-5">
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>On Net Average Quality</div>
                              <div>On Net Total Call</div>
                              <div>On Net Blocked Call</div>
                              <div>On Net Dropped Call</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .on_net_avg_quality
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .on_net_total_call
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .on_net_blocked_call
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .on_net_dropped_call
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col lg="6">
                          <v-row>
                            <v-col lg="6">
                              <div>Off Net Average Quality</div>
                              <div>Off Net Total Call</div>
                              <div>Off Net Blocked Call</div>
                              <div>Off Net Dropped Call</div>
                            </v-col>
                            <v-col lg="6" v-if="selected_item != null">
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .off_net_avg_quality
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .off_net_total_call
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .off_net_blocked_call
                                }}
                              </div>
                              <div>
                                :
                                {{
                                  selected_item.qos_voice_call_test
                                    .off_net_dropped_call
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-dialog>

      <!-- <v-dialog width="670" v-model="dialogQuality">
        <v-card>
          <div class="d-flex pa-5" style="background-color: black">
            <div class="white--text">Signal Quality</div>
            <v-spacer></v-spacer>
            <v-icon color="#fff" @click="dialogQuality = false"
              >mdi-close</v-icon
            >
          </div>
          <div class="pa-5">
            <img src="../../assets/image/signal_quality.png" alt="signal" />
          </div>
        </v-card>
      </v-dialog> -->
    </v-card>
  </div>
</template>

<script src="./BadSpot.js"></script>

<style scoped>
.modal-tb {
  border: 1px solid #c9c9c9;
  border-radius: 10px;
}
</style>
