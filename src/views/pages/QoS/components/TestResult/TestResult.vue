<template>
  <div class="qos-test-result">
    <v-row class="mt-5">
      <v-col lg="12">
        <v-card class="text-center pa-3">
          <div class="font-weight-bold pb-7">FTP Test (Mbps)</div>
          <v-row justify="center" align="center">
            <v-col lg="6" class="ftp-download pa-5">
              <div class="font-weight-bold">{{ $t("ui.button_download") }}</div>
              <DownloadChart
                :data="download"
                :categories="download_categories"
              />
            </v-col>
            <v-col lg="6" class="ftp-upload pa-5">
              <div class="font-weight-bold">Upload</div>
              <UploadChart :data="upload" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="12">
        <v-card class="text-center pa-3">
          <div class="font-weight-bold pb-7">
            Web Test/Browsing Speed (Mbps)
          </div>
          <WebTestChart :data="web_chart" />
        </v-card>
      </v-col>
      <v-col lg="12">
        <v-card class="text-center pa-3">
          <div class="font-weight-bold pb-7">Capacity/Speed Test (Mbps)</div>
          <v-row justify="center" align="center">
            <v-col lg="6" class="ftp-download pa-5">
              <div class="font-weight-bold">{{ $t("ui.button_download") }}</div>
              <DownloadTest :data="capacity_speed_chart_download" />
            </v-col>
            <v-col lg="6" class="ftp-upload pa-5">
              <div class="font-weight-bold">Upload</div>
              <UploadTest :data="capacity_speed_chart_upload" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="6">
        <v-card class="pa-5">
          <div class="font-weight-bold text-center mb-5">Ping Test</div>
          <v-row>
            <v-col lg="6" class="text-center">
              <div class="font-weight-bold">Package Loss</div>
              <v-row class="mt-5" v-for="item in ping_pl" :key="item.index">
                <v-col lg="2">
                  <img width="100%" :src="item.logo" alt="Telkomsel" />
                </v-col>
                <v-col lg="10">
                  <div class="text-left">
                    {{ item.name.substring(0, 25) + "..." }}
                  </div>
                  <v-row>
                    <v-col lg="9">
                      <v-progress-linear
                        :value="convertValue(item.value)"
                        height="12px"
                        rounded
                        color="#C9C9C9"
                        class="mt-2"
                      >
                      </v-progress-linear>
                    </v-col>
                    <v-col lg="3">
                      <div
                        :class="[
                          `font-weight-bold`,
                          item.value == null ? 'small-text' : '',
                        ]"
                      >
                        {{ item.value == null ? "No Data" : item.value + "%" }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <!-- average delay -->
            <v-col lg="6" class="text-center">
              <div class="font-weight-bold">Average Delay</div>
              <v-row class="mt-5" v-for="item in ping_ad" :key="item.index">
                <v-col lg="2">
                  <img width="100%" :src="item.logo" alt="Telkomsel" />
                </v-col>
                <v-col lg="10">
                  <div class="text-left">
                    {{ item.name.substring(0, 25) + "..." }}
                  </div>
                  <v-row>
                    <v-col lg="9">
                      <v-progress-linear
                        :value="convertValue(item.value)"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-2"
                      >
                      </v-progress-linear>
                    </v-col>
                    <v-col lg="3">
                      <div
                        :class="[
                          `font-weight-bold`,
                          item.value == null ? 'small-text' : '',
                        ]"
                      >
                        {{ item.value == null ? "No Data" : item.value }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="6">
        <v-card class="pa-5">
          <div class="font-weight-bold text-center">Youtube</div>
          <v-row>
            <v-col lg="12" class="text-center">
              <div class="font-weight-bold">Avg Visual Quality</div>
              <v-row class="mt-5" v-for="item in youtube" :key="item.index">
                <v-col lg="2">
                  <img width="42.5%" :src="item.logo" alt="Telkomsel" />
                </v-col>
                <v-col lg="10">
                  <div class="text-left">{{ item.name }}</div>
                  <v-row>
                    <v-col lg="9">
                      <v-progress-linear
                        :value="item.value"
                        height="12px"
                        rounded
                        color="#74B8F6"
                        class="mt-2"
                      >
                      </v-progress-linear>
                    </v-col>
                    <v-col lg="3">
                      <div class="font-weight-bold">
                        {{ item.value == null ? "No Data" : item.value }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="12">
        <v-card class="pa-5">
          <div class="font-weight-bold">Whatsapp</div>
          <v-row>
            <v-col lg="6">
              <div class="font-weight-bold text-center mb-5">Call Test</div>
              <v-row>
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">Avg. Voice Quality</div>
                  <v-row
                    class="mt-5"
                    v-for="item in wa_voice_quality"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">Success Call</div>
                  <v-row
                    class="mt-5"
                    v-for="item in wa_voice_sc"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div class="font-weight-bold">
                            <div
                              :class="[
                                `font-weight-bold`,
                                item.value == null ? 'small-text' : '',
                              ]"
                            >
                              {{
                                item.value == null
                                  ? "No Data"
                                  : `${item.value}%`
                              }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col lg="6">
              <div class="font-weight-bold text-center mb-5">Message Test</div>
              <v-row>
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">Avg Duration</div>
                  <v-row
                    class="mt-5"
                    v-for="item in wa_mt_avg"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- success send -->
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">Success Send</div>
                  <v-row
                    class="mt-5"
                    v-for="item in wa_mt_ss"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- SMS-->
      <v-col lg="12">
        <v-card class="pa-5">
          <div class="font-weight-bold">SMS</div>
          <v-row>
            <v-col lg="6">
              <div class="font-weight-bold text-center mb-5">ON-net</div>
              <v-row>
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">Total SMS</div>
                  <v-row
                    class="mt-5"
                    v-for="item in sms_total_on_net"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">
                    Total SMS Recived Under 1 Minutes
                  </div>
                  <v-row
                    class="mt-5"
                    v-for="item in sms_total_under_on_net"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <v-col lg="6">
              <div class="font-weight-bold text-center mb-5">OFF-net</div>
              <v-row>
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">Total SMS</div>
                  <v-row
                    class="mt-5"
                    v-for="item in sms_total_off_net"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="6" class="text-center">
                  <div class="font-weight-bold">
                    Total SMS Recived Under 1 Minutes
                  </div>
                  <v-row
                    class="mt-5"
                    v-for="item in sms_total_under_off_net"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Voice Call -->
      <v-col lg="12">
        <v-card class="pa-5">
          <div class="font-weight-bold">Voice Call</div>
          <v-row>
            <v-col lg="12">
              <div class="font-weight-bold text-center mb-5">ON-net</div>
              <v-row>
                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Avg Voice Quality</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_on_net_avg"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Total Call Attempts</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_on_net_total_call"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Blocked Call</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_on_net_blocked_call"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Dropped Call</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_on_net_dropped_call"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col lg="12">
              <v-divider></v-divider>
              <div class="font-weight-bold text-center mt-5 mb-5">OFF-net</div>
              <v-divider></v-divider>

              <v-row class="mt-5">
                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Avg Voice Quality</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_off_net_avg"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Total Call Attempts</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_off_net_total_call"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Blocked Call</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_off_net_blocked_call"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Success Call -->
                <v-col lg="3" class="text-center">
                  <div class="font-weight-bold">Dropped Call</div>
                  <v-row
                    class="mt-5"
                    v-for="item in voice_off_net_dropped_call"
                    :key="item.index"
                  >
                    <v-col lg="2">
                      <img width="100%" :src="item.logo" alt="Telkomsel" />
                    </v-col>
                    <v-col lg="10">
                      <div class="text-left">
                        {{ item.name.substring(0, 25) + "..." }}
                      </div>
                      <v-row>
                        <v-col lg="9">
                          <v-progress-linear
                            :value="convertValue(item.value)"
                            height="12px"
                            rounded
                            color="#74B8F6"
                            class="mt-2"
                          >
                          </v-progress-linear>
                        </v-col>
                        <v-col lg="3">
                          <div
                            :class="[
                              `font-weight-bold`,
                              item.value == null ? 'small-text' : '',
                            ]"
                          >
                            {{ item.value == null ? "No Data" : item.value }}
                          </div>
                        </v-col>
                      </v-row>
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
</template>

<script src="./TestResult.js"></script>

<style scoped>
.ftp-download {
  border-top: 1px solid #c4c4c4;
  border-right: 1px solid #c4c4c4;
}

.ftp-upload {
  border-top: 1px solid #c4c4c4;
}

.small-text {
  font-size: 12px;
}
</style>
