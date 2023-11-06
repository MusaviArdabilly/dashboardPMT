<template>
  <div class="table-content">
    <v-overlay :value="loadingData">
      <v-progress-circular
        class="loader"
        :size="50"
        color="primary"
        indeterminate
        v-if="loadingData != false"
      >
      </v-progress-circular>
    </v-overlay>
    <div class="title">
      <h4>Data {{ $t("general.menu.sub_district_potential") }}</h4>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="dataItems"
        class="elevation-1 pl-3 pr-3 pmt-table"
        hide-default-footer
        @click:row="toDetails"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
      >
        <template v-slot:top>
          <div class="pmt-flex wrap is-row at-between">
            <v-col cols="3" xl="4">
              <h4 class="pt-3 pl-4 pb-2">
                Table data {{ $t("general.menu.sub_district_potential") }}
              </h4>
            </v-col>
            <v-col cols="7" lg="7" xl="8">
              <div class="pmt-flex wrap is-row at-end">
                <v-card class="pmt-card small mt-3 mb-2" elevation="2">
                  <v-card-text class="p-1">
                    <span class="bold"
                      >{{ $t("ui.table_piece.last_update") }}
                      {{ dataLastUpdated | moment }}</span
                    >
                  </v-card-text>
                </v-card>
                <v-col
                  cols="4"
                  lg="3"
                  xl="4"
                  v-if="(isOperator || isExecutive || isViewer) == false"
                >
                  <v-btn
                    class="m-1 pmt-button text-capitalize"
                    block
                    outlined
                    tile
                    color="#134889"
                    to="potensi-desa/create"
                  >
                    {{ $t("ui.button_create") }}
                  </v-btn>
                </v-col>

                <v-col cols="4" lg="3" xl="4" v-if="isViewer != true">
                  <v-btn
                    block
                    class="text-none white--text ml-1 pmt-button text-capitalize"
                    color="#134889"
                    @click="dialogDownloadPotensiDesa = true"
                  >
                    {{ $t("ui.button_download") }}
                  </v-btn>
                </v-col>
              </div>
            </v-col>
          </div>
          <v-toolbar class="pt-3" flat extended>
            <div class="pmt-flex wrap is-row">
              <v-col lg="2">
                <v-autocomplete
                  class="ml-2"
                  @input="getCity"
                  v-model="filter.province"
                  :items="itemProvince"
                  :loading="loadingField"
                  :search-input.sync="filter.searchProvince"
                  item-text="name"
                  item-value="id"
                  flat
                  hide-no-data
                  hide-details
                  dense
                  clearable
                  outlined
                  :label="$t('ui.field.province')"
                ></v-autocomplete>
              </v-col>
              <v-col lg="2">
                <v-autocomplete
                  class="ml-2"
                  @input="getDistrict"
                  v-model="filter.city"
                  :items="itemCity"
                  :loading="loadingField"
                  :search-input.sync="filter.searchCity"
                  item-text="name"
                  item-value="id"
                  flat
                  hide-no-data
                  hide-details
                  dense
                  clearable
                  :disabled="filter.selectCity"
                  outlined
                  :label="$t('ui.field.city')"
                >
                </v-autocomplete>
              </v-col>
              <v-col lg="2">
                <v-autocomplete
                  class="ml-2"
                  @input="getSubDistrict"
                  v-model="filter.district"
                  :items="itemDistrict"
                  :loading="loadingField"
                  :search-input.sync="filter.searchDistrict"
                  item-text="name"
                  item-value="id"
                  flat
                  hide-no-data
                  hide-details
                  dense
                  clearable
                  :disabled="filter.selectDistrict"
                  outlined
                  :label="$t('ui.field.district')"
                >
                </v-autocomplete>
              </v-col>
              <v-col lg="2">
                <v-autocomplete
                  class="ml-2"
                  v-model="filter.subDistrict"
                  :items="itemSubDistrict"
                  :loading="loadingField"
                  :search-input.sync="filter.searchSubDistrict"
                  item-text="name"
                  item-value="id"
                  flat
                  hide-no-data
                  hide-details
                  dense
                  clearable
                  :disabled="filter.selectSubDistrict"
                  outlined
                  :label="$t('ui.field.sub_district')"
                >
                </v-autocomplete>
              </v-col>
              <v-col lg="1">
                <v-btn
                  class="m-1 pmt-button small"
                  block
                  small
                  tile
                  color="primary"
                  @click="locationFilter"
                >
                  {{ $t("ui.button_apply") }}
                </v-btn>
              </v-col>
              <v-col lg="1">
                <v-btn
                  class="m-1 pmt-button small"
                  block
                  small
                  tile
                  color="#eff0ef"
                  @click="reset()"
                >
                  {{ $t("ui.button_reset") }}
                </v-btn>
              </v-col>
            </div>
          </v-toolbar>
          <!-- Download dialog -->
          <v-dialog
            v-model="dialogDownloadPotensiDesa"
            max-width="1900"
            transition="dialog-top-transition"
            open-delay="300"
            persistent
          >
            <v-overlay :absolute="true" :value="loadingDownload">
              <v-progress-circular
                class="loader"
                :size="50"
                color="primary"
                indeterminate
                v-if="loadingDownload != false"
              >
              </v-progress-circular>
              <span>{{ $t("ui.message.prepare_data") }}</span>
            </v-overlay>
            <v-form @submit.prevent="downloadPotensiDesa">
              <v-card class="pmt-card">
                <v-card-title class="pmt-flex wrap is-row">
                  <span class="title">Download Data</span>
                  <v-spacer></v-spacer>
                  <v-icon @click="dialogDownloadPotensiDesa = false"
                    >mdi-close</v-icon
                  >
                </v-card-title>
                <v-card-text>
                  <div class="form-wrap">
                    <label class="form-title">Daerah</label>
                    <div class="pmt-flex wrap is-row">
                      <v-col lg="3">
                        <v-autocomplete
                          class="ml-2"
                          @input="getCity()"
                          v-model="filterDownload.province"
                          :items="itemProvince"
                          :loading="loadingField"
                          :search-input.sync="filterDownload.searchProvince"
                          item-text="name"
                          item-value="id"
                          flat
                          hide-no-data
                          hide-details
                          dense
                          clearable
                          outlined
                          :label="$t('ui.field.province')"
                          :rules="[rules.required]"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col lg="3">
                        <v-autocomplete
                          class="ml-2"
                          @input="getDistrict()"
                          v-model="filterDownload.city"
                          :items="itemCity"
                          :loading="loadingField"
                          :search-input.sync="filterDownload.searchCity"
                          item-text="name"
                          item-value="id"
                          flat
                          hide-no-data
                          hide-details
                          dense
                          clearable
                          :rules="[rules.required]"
                          :disabled="filterDownload.selectCity"
                          outlined
                          :label="$t('ui.field.city')"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col lg="3">
                        <v-autocomplete
                          class="ml-2"
                          @input="getSubDistrict()"
                          v-model="filterDownload.district"
                          :items="itemDistrict"
                          :loading="loadingField"
                          :search-input.sync="filterDownload.searchDistrict"
                          item-text="name"
                          item-value="id"
                          flat
                          hide-no-data
                          hide-details
                          dense
                          clearable
                          required
                          :disabled="filterDownload.selectDistrict"
                          outlined
                          :label="$t('ui.field.district')"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col lg="3">
                        <v-autocomplete
                          class="ml-2"
                          v-model="filterDownload.subDistrict"
                          :loading="loadingField"
                          :items="itemSubDistrict"
                          :search-input.sync="filterDownload.searchSubDistrict"
                          item-text="name"
                          item-value="id"
                          flat
                          hide-no-data
                          hide-details
                          dense
                          clearable
                          :rules="[rules.required]"
                          :disabled="filterDownload.selectSubDistrict"
                          outlined
                          :label="$t('ui.field.sub_district')"
                        >
                        </v-autocomplete>
                      </v-col>
                    </div>
                  </div>
                  <div class="form-wrap overflows" id="filterDialog">
                    <label class="form-title">Category & Sub-Category</label>
                    <div class="dynamic-field">
                      <div
                        class="pmt-flex wrap is-row"
                        v-for="(field, index) in dynamicfield"
                      >
                        <v-col lg="3">
                          <div
                            class="pmt-combobox"
                            is="v-combobox"
                            :items="itemCategorySettle"
                            item-text="name"
                            @input="getSubCategory(index)"
                            item-value="id"
                            v-model="field['code_category']"
                            filled
                            solo
                            hide-no-data
                            hide-details
                            label="Category"
                            :readonly="field.selectReadonly"
                          ></div>
                        </v-col>
                        <v-col lg="7">
                          <div
                            is="v-autocomplete"
                            multiple
                            :rules="[rules.required]"
                            :items="field.subcategory"
                            item-text="name"
                            item-value="id"
                            v-model="field['code_subcategory']"
                            filled
                            solo
                            hide-no-data
                            hide-details
                            label="Sub Category"
                            :disabled="field.selectCategory"
                          >
                            <template v-slot:selection="{ item }">
                              <v-chip class="pmt-chip" color="#404043" outlined>
                                {{ item.name }}
                              </v-chip>
                            </template>
                          </div>
                        </v-col>
                        <v-col lg="2">
                          <v-btn
                            :disabled="disabledRemoveField"
                            class="action"
                            outlined
                            small
                            elevation="2"
                            v-on:click="removeField(index)"
                          >
                            <v-icon>mdi-trash-can-outline</v-icon>
                          </v-btn>
                        </v-col>
                      </div>
                      <v-btn
                        :disabled="disableAddField"
                        class="action float"
                        elevation="2"
                        small
                        outlined
                        @click="addField()"
                        >+</v-btn
                      >
                    </div>
                  </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-action>
                  <div class="pmt-flex is-row wrap at-end pb-4 pt-5 pr-5">
                    <v-btn
                      color="#134889"
                      outlined
                      @click="dialogDownloadPotensiDesa = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      :disabled="submitToDownload"
                      type="submit"
                      class="text-none white--text ml-9"
                      color="#134889"
                      >Download
                    </v-btn>
                  </div>
                </v-card-action>
              </v-card>
            </v-form>
          </v-dialog>
          <!-- Download dialog -->
          <v-overlay :absolute="true" :value="loadingTable">
            <v-progress-circular
              class="loader"
              :size="50"
              color="primary"
              indeterminate
              v-if="loadingTable != false"
            >
            </v-progress-circular>
          </v-overlay>
        </template>
        <template v-slot:[`item.object_id`]="{ item }">
          <td>
            <v-menu
              left
              :close-on-click="dropdown.closeOnClick"
              nudge-left="35"
              nudge-top="15"
              light
              ><template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on"
                  >mdi mdi-dots-horizontal</v-icon
                >
              </template>
              <div class="option-menu">
                <a
                  href="javascript:void(0)"
                  class="option-list"
                  @click="toEdit(item.sub_district_id)"
                  >{{ $t("ui.button_edit") }}</a
                ><a
                  href="javascript:void(0)"
                  class="option-list"
                  @click="deleteItem(item.sub_district_id)"
                  >{{ $t("ui.button_delete") }}</a
                >
              </div>
            </v-menu>
          </td>
        </template>
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn @click="resetData">Reset </v-btn>
          </div> </template
        ><template v-slot:footer>
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
              :length="paginationType.totalItems"
              @input="setTable"
            ></v-pagination>
          </v-container> </template
      ></v-data-table>
    </v-card>
  </div>
</template>
<script src="./PotensiDesa.js"></script>
<style lang="scss">
div[role="menu"] {
  border-radius: 1rem;

  .option-menu {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 1rem;
    background: #ffffff;

    .option-list {
      color: #56545c;
      font-weight: 600;

      &::after {
        content: " ";
        width: 5px;
        height: 10px;
        margin: 0.5rem;
        border-left: 2px solid #56545c;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
