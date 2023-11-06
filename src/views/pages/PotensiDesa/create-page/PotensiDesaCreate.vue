<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <div>
    <v-row>
      <router-link to="/dashboard/potensi-desa">
        <v-icon size="40" class="mt-8" color="black">mdi-chevron-left</v-icon>
      </router-link>
      <v-col
        ><h1 class="my-4">
          {{ $t("general.menu.sub_district_potential_create") }}
        </h1></v-col
      >
    </v-row>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="10">
        <!-- Profil Desa -->
        <CardProfilDesa :filter="filter" />
        <!-- Dynamic Field  -->
        <v-expansion-panels multiple v-model="panel" :disabled="panelDisabled">
          <v-expansion-panel
            v-for="data in fieldList"
            :key="data"
            ref="formData"
          >
            <v-expansion-panel-header
              class="font-weight-bold"
              :id="data.category_id"
              ref="category"
            >
              {{ data.name }}</v-expansion-panel-header
            >

            <v-expansion-panel-content>
              <div
                class="mt-2 mx-9 d-flex justify-start align-center flex-wrap"
              >
                <div v-for="(item, index) in data.fields" :key="index">
                  <!-- If data is calculated show hint -->
                  <v-text-field
                    v-if="
                      item.is_calculated == false && item.data_type != 'select'
                    "
                    v-model="item.value"
                    :id="item.id"
                    :value="item.value"
                    class="input-field text-h6"
                    dense
                    outlined
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
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-if="
                      item.is_calculated == true &&
                      item.is_used_by_calculation == true
                    "
                    v-model="item.value"
                    :id="item.id"
                    :value="item.value"
                    class="input-field text-h6"
                    dense
                    outlined
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
                  </v-text-field>
                  <!-- If data type select show v-select -->
                  <v-select
                    v-if="item.data_type == 'select'"
                    class="input-field text-h6"
                    dense
                    outlined
                    :id="item.id"
                    :value="item.value"
                    :items="item.option"
                    :label="item.name"
                  >
                  </v-select>
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
                      v-if="
                        item.is_calculated == true &&
                        item.is_used_by_calculation == false
                      "
                      :id="item.id"
                      disabled
                      :value="''"
                      class="input-field text-h6"
                      dense
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
                    </v-text-field>
                  </div>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-bottom-navigation app color="white" height="5rem" fixed>
      <div class="bottom-navigation">
        <button @click="cancelCreateData" class="cancel-button" to>
          {{ $t("ui.button_cancel") }}
        </button>
        <button @click="submitData" class="create-button">
          {{ $t("ui.button_create_data") }}
        </button>
      </div>
    </v-bottom-navigation>
  </div>
</template>

<script src="./PotensiDesaCreate"></script>

<style scoped>
.bottom-navigation {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.input-field {
  width: 41rem;
  padding: 0 1rem;
}
.create-button {
  width: 200px;
  height: 36px;
  border-radius: 5px;
  padding: 6px, 16px, 6px, 16px;
  margin-right: 4rem;
  background-color: rgba(19, 72, 137, 1);
}
.cancel-button {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #000000;
  width: 200px !important;
  height: 36px;
  border-radius: 5px;
  padding: 6px, 16px, 6px, 16px;
  margin-right: 4rem;
  background-color: rgb(255, 255, 255);
  border: 1px solid #134889;
}
.create-button:hover {
  background-color: rgba(19, 72, 137, 0.78);
}
.cancel-button:hover {
  background-color: rgba(8, 95, 202, 0.1);
}
.category {
  max-width: 120rem;
}
.check-icon {
  font-size: 7rem !important;
}
.cancel-icon {
  font-size: 2rem;
}
.data-unit {
  color: gray;
}
</style>
