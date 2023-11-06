<template>
  <v-dialog v-model="dialogAction" max-width="100rem" persistent>
    <v-card class="pmt-card">
      <div is="v-card-title" class="pt-2 pr-2 pb-1 pl-2">
        <v-spacer></v-spacer>
        <v-icon @click="dialogAction = false">mdi-close</v-icon>
      </div>
      <div is="v-card-text" class="pt-6 pr-6 pb-0 pl-6">
        <div class="pmt-flex is-column">
          <div class="summary-container pl-3 pr-3" with-border-bottom>
            <h2 class="ml-4">
              {{ $t("ui.menu_title.ticketing_summary_all") }}
            </h2>
            <div class="pmt-flex wrap is-row">
              <v-col cols="6" md="6" xl="">
                <v-card class="pmt-card summary color-red" elevation="0">
                  <div class="summary-wrap">
                    <h4 class="summary-title">
                      {{ $t("ui.summary_card.ticket_total") }}
                    </h4>
                    <span class="summary-count">{{
                      summaryAll.total_ticket
                    }}</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" md="6" xl="3">
                <v-card class="pmt-card summary color-orange" elevation="0">
                  <div class="summary-wrap">
                    <h4 class="summary-title">
                      {{ $t("ui.summary_card.ticket_open") }}
                    </h4>
                    <span class="summary-count">{{
                      summaryAll.open_ticket
                    }}</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" md="6" xl="3">
                <v-card class="pmt-card summary color-green" elevation="0">
                  <div class="summary-wrap">
                    <h4 class="summary-title">
                      {{ $t("ui.summary_card.ticket_progress") }}
                    </h4>
                    <span class="summary-count">{{
                      summaryAll.progress_ticket
                    }}</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" md="6" xl="3">
                <v-card class="pmt-card summary color-blue" elevation="0">
                  <div class="summary-wrap">
                    <h4 class="summary-title">
                      {{ $t("ui.summary_card.ticket_closed") }}
                    </h4>
                    <span class="summary-count">{{
                      summaryAll.close_ticket
                    }}</span>
                  </div>
                </v-card>
              </v-col>
            </div>
          </div>
          <div class="pmt-flex is-row" v-if="summary.length != 0">
            <div
              is="v-col"
              cols="6"
              xl="6"
              with-border-right
              v-if="loadedSummaryCell == false"
            >
              <div class="summary-container">
                <h2 class="ml-4">
                  {{ $t("ui.menu_title.ticketing_summary_cell") }}
                </h2>
                <div class="pmt-flex wrap is-row">
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-red" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_total") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[0].total_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-orange" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_open") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[0].open_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-green" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_progress") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[0].progress_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-blue" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_closed") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[0].close_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                </div>
              </div>
            </div>
            <div is="v-col" cols="6" xl="6" v-if="loadedSummaryFo == false">
              <div class="summary-container">
                <h2 class="ml-4">
                  {{ $t("ui.menu_title.ticketing_summary_fo") }}
                </h2>
                <div class="pmt-flex wrap is-row">
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-red" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_total") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[1].total_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-orange" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_open") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[1].open_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-green" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_progress") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[1].progress_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="12" xl="6">
                    <v-card class="pmt-card summary color-blue" elevation="0">
                      <div class="summary-wrap">
                        <h4 class="summary-title">
                          {{ $t("ui.summary_card.ticket_closed") }}
                        </h4>
                        <span class="summary-count">{{
                          summary[1].close_ticket
                        }}</span>
                      </div>
                    </v-card>
                  </v-col>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script src="./TicketingSummaryDialog.js"></script>
<style lang="scss">
.summary-container {
  padding: 1.5rem 0;
  h2,
  h3,
  h4 {
    margin-bottom: 1rem;
  }
}
[with-border-bottom] {
  border-bottom: 1px solid #c9c9c9;
}
[with-border-left] {
  border-left: 1px solid #c9c9c9;
}
[with-border-right] {
  border-right: 1px solid #c9c9c9;
}
[with-border-top] {
  border-top: 1px solid #c9c9c9;
}
</style>
