<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <div>
    <v-row>
      <router-link to="/dashboard/potensi-desa">
        <v-icon size="40" class="mt-8" color="black">mdi-chevron-left</v-icon>
      </router-link>
      <v-col>
        <h1 v-if="isEdit == true" class="my-4">
          {{ $t("general.menu.sub_district_potential_details") }}
        </h1>
        <h1 v-else class="my-4">
          {{ $t("general.menu.sub_district_potential_edit") }}
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="10" md="10" lg="9" xl="9">
        <!-- Profil Desa -->
        <CardProfilDesa :isEdit="isEdit" :filter="filter" />
        <!-- Dynamic Field  -->
        <v-expansion-panels multiple v-model="panel">
          <v-expansion-panel
            v-for="data in fieldData"
            :key="data.id"
            ref="formData"
          >
            <v-expansion-panel-header
              class="font-weight-bold"
              :id="data.category_id"
            >
              {{ data.name }}</v-expansion-panel-header
            >

            <v-expansion-panel-content>
              <div
                class="mt-2 mx-9 d-flex justify-start align-center flex-wrap"
              >
                <div v-for="(item, index) in data.fields" :key="index">
                  <v-text-field
                    v-if="
                      item.is_calculated == false && item.data_type != 'select'
                    "
                    :loading="fieldLoading"
                    v-model="valueData[item.id]"
                    :value="valueData[item.id]"
                    :id="item.id"
                    class="input-field text-h6"
                    :readonly="isEdit"
                    outlined
                    :color="isEdit ? 'grey' : 'primary'"
                    dense
                    :rules="
                      item.data_type == 'integer'
                        ? integerRules
                        : item.data_type == 'decimal'
                        ? decimalRules
                        : noRules
                    "
                    :label="item.name"
                    :append-icon="item.unit"
                  >
                    <template slot="append">
                      <span class="data-unit">{{ item.unit }}</span>
                    </template></v-text-field
                  >
                  <!-- If data type select show v-select -->
                  <v-select
                    v-if="item.data_type == 'select'"
                    class="input-field text-h6"
                    dense
                    outlined
                    v-model="valueData[item.id]"
                    :id="item.id"
                    :value="item.value"
                    :items="item.option"
                    :label="item.name"
                    :readonly="isEdit"
                  >
                  </v-select>
                  <v-text-field
                    v-if="
                      item.is_calculated == true &&
                      item.is_used_by_calculation == true
                    "
                    :loading="fieldLoading"
                    v-model="valueData[item.id]"
                    :value="valueData[item.id]"
                    :id="item.id"
                    class="input-field text-h6"
                    disabled
                    outlined
                    :color="isEdit ? 'grey' : 'primary'"
                    dense
                    :rules="
                      item.data_type == 'integer'
                        ? integerRules
                        : item.data_type == 'decimal'
                        ? decimalRules
                        : noRules
                    "
                    :label="item.name"
                    :append-icon="item.unit"
                  >
                    <template slot="append">
                      <span class="data-unit">{{ item.unit }}</span>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon color="#169CD6" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        {{ item.description }}
                      </v-tooltip>
                    </template></v-text-field
                  >
                </div>
                <div
                  class="mb-5"
                  style="
                    height: 1px;
                    width: 100%;
                    background-color: #169cd6;
                    border-radius: 5px;
                  "
                ></div>
                <div class="d-flex flex-wrap">
                  <div v-for="(item, index) in data.fields" :key="index">
                    <v-text-field
                      style="color: #169cd6"
                      v-if="
                        item.is_calculated == true &&
                        item.is_used_by_calculation == false
                      "
                      v-model="valueData[item.id]"
                      :value="valueData[item.id]"
                      :id="item.id"
                      class="input-field text-h6"
                      dense
                      disabled
                      :label="item.name"
                      :append-icon="item.unit"
                    >
                      <template slot="append">
                        <span class="data-unit">{{ item.unit }}</span>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon color="#169CD6" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          {{ item.description }}
                        </v-tooltip>
                      </template>
                      <template slot="label">
                        <span style="color: black" class="text-h7">{{
                          item.name
                        }}</span>
                      </template>
                    </v-text-field>
                  </div>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <!-- Activity log section -->
      <v-col cols="2" md="2" lg="3" xl="3">
        <div class="pmt-timeline">
          <div class="timeline-title">
            <h4>{{ $t("ui.table_piece.last_update") }}</h4>
            <router-link :to="`/settings/activity-log?log=${log.url}`">{{
              $t("ui.button_details")
            }}</router-link>
          </div>
          <div class="timeline">
            <div
              class="timeline-item"
              :style="
                index == 0 ? '--circleColor: #169cd6' : '--circleColor: #c9c9c9'
              "
              v-for="(item, index) in log.updated"
              :key="index"
            >
              <span class="timeline-item-title"
                >Updated by {{ item.user.name }}</span
              ><span class="timeline-item-time">{{
                item.created_at | moment
              }}</span>
            </div>
            <div class="timeline-item" style="--circleColor: #c9c9c9">
              <span class="timeline-item-title">...</span>
            </div>
            <div
              class="timeline-item"
              :style="
                index == 0 ? '--circleColor: #169cd6' : '--circleColor: #c9c9c9'
              "
              v-for="(item, index) in log.created"
              :key="index"
            >
              <span class="timeline-item-title"
                >Created by {{ item.user.name }}</span
              ><span class="timeline-item-time">{{
                item.created_at | moment
              }}</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- floating bottom navigation -->
    <v-bottom-navigation
      app
      color="white"
      height="5rem"
      fixed
      v-if="isViewer == false"
    >
      <div class="bottom-navigation" v-if="isEdit === true">
        <button @click="editData" class="edit-button" :disabled="disallowEdit">
          {{ $t("ui.button_edit") }}
        </button>
      </div>
      <div class="bottom-navigation" v-else>
        <button @click="cancelEdit" class="cancel-button">
          {{ $t("ui.button_cancel") }}
        </button>
        <button @click="saveData" class="save-button">
          {{ $t("ui.button_save") }}
        </button>
      </div>
    </v-bottom-navigation>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script src="./PotensiDesaDetails.js"></script>
<style lang="scss" src="./PotensiDesaDetails.scss" scoped></style>
