<template>
  <v-expansion-panels class="my-3" multiple v-model="panelParent">
    <v-expansion-panel>
      <v-expansion-panel-header class="font-weight-bold">
        Profil Desa
      </v-expansion-panel-header>
      <v-divider></v-divider>
      <v-expansion-panel-content>
        <v-overlay :absolute="true" :value="loadingSubDistrict">
          <v-progress-circular
            class="loader"
            :size="50"
            color="primary"
            indeterminate
            v-if="loadingSubDistrict != false"
          >
          </v-progress-circular>
          <span>Please wait...</span>
        </v-overlay>
        <div class="ma-2">
          <v-row class="mt-2 mx-3">
            <v-col lg="6">
              <v-autocomplete
                class="ml-2"
                @input="getCity()"
                v-model="filter.province"
                :items="itemProvince"
                :search-input.sync="filter.searchProvince"
                item-text="name"
                item-value="id"
                flat
                hide-no-data
                dense
                clearable
                :loading="loading"
                outlined
                :rules="rules"
                :label="$t('ui.field.province')"
              ></v-autocomplete>
            </v-col>
            <v-col lg="6">
              <v-autocomplete
                class="ml-2"
                @input="getDistrict()"
                v-model="filter.city"
                :items="itemCity"
                :search-input.sync="filter.searchCity"
                item-text="name"
                item-value="id"
                flat
                hide-no-data
                :loading="loading"
                dense
                clearable
                :disabled="filter.selectCity"
                outlined
                :label="$t('ui.field.city')"
                :rules="rules"
              >
              </v-autocomplete>
            </v-col>
            <v-col lg="6">
              <v-autocomplete
                class="ml-2"
                @input="getSubDistrict()"
                v-model="filter.district"
                :items="itemDistrict"
                :search-input.sync="filter.searchDistrict"
                item-text="name"
                item-value="id"
                :loading="loading"
                flat
                hide-no-data
                dense
                clearable
                :disabled="filter.selectDistrict"
                outlined
                :label="$t('ui.field.district')"
                :rules="rules"
              >
              </v-autocomplete>
            </v-col>
            <v-col lg="6">
              <v-autocomplete
                class="ml-2"
                v-model="filter.subDistrict"
                :items="itemSubDistrict"
                :search-input.sync="filter.searchSubDistrict"
                item-text="name"
                item-value="id"
                :loading="loading"
                flat
                hide-no-data
                dense
                clearable
                :disabled="filter.selectSubDistrict"
                outlined
                label="Sub-District"
                :rules="rules"
                @change="checkIfExist"
              >
              </v-autocomplete>
            </v-col>
            <v-col lg="6">
              <v-text-field
                class="ml-2"
                dense
                flat
                color="grey"
                v-model="filter.subDistrict"
                hide-no-data
                readonly
                persistent-hint
                outlined
                label="Sub-District Code"
              >
              </v-text-field>
            </v-col>
            <v-col lg="2">
              <v-btn class="ml-2" @click="reset">Reset</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script src="./CardProfilDesa.js"></script>
