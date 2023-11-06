<template>
  <div class="table-content">
    <div class="title">
      <h4>
        {{ $t("general.menu.sub_district_potential_sub-category") }}
      </h4>
    </div>
    <v-card>
      <v-overlay :absolute="true" :value="loadingTable">
        <v-progress-circular
          class="loader"
          :size="50"
          color="primary"
          indeterminate
        >
        </v-progress-circular>
      </v-overlay>
      <v-data-table
        class="pa-2"
        :headers="headers"
        :items="dataSubCategory"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
        :loading="isLoading"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-row class="mt-7">
              <v-col lg="2">
                <v-btn
                  @click="openAddDialog"
                  class="text-none white--text"
                  color="#134889"
                >
                  {{ $t("ui.button_create") }}
                </v-btn>
              </v-col>
              <v-col lg="3">
                <v-text-field
                  class="ml-5"
                  outlined
                  prepend-inner-icon="mdi-magnify"
                  :placeholder="$t('ui.table_piece.search')"
                  @input="getDataByFilter"
                  dense
                  v-model="search"
                >
                </v-text-field>
              </v-col>
              <v-col lg="3">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Category"
                  clearable
                  v-model="selectedCategory"
                  :items="select_category_items"
                  @input="getDataByFilter"
                  item-text="name"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col lg="2">
                <v-select
                  dense
                  outlined
                  placeholder="Need Formula"
                  v-model="is_calculated"
                  :items="itemsNeedFormula"
                  @input="getDataByFilter"
                  item-text="text"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col lg="2">
                <v-select
                  outlined
                  dense
                  placeholder="Need on Calculation"
                  v-model="is_used_by_calculation"
                  :items="itemsNeedCalculation"
                  @input="getDataByFilter"
                  item-text="text"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot:[`item.is_on_table`]="{ item }">
          <v-row justify="center">
            <v-icon cols="12" v-if="item.is_on_table == true" color="green">
              mdi-check-bold
            </v-icon>
            <v-icon class="mx-auto" v-else color="red">
              mdi-close-thick
            </v-icon>
          </v-row>
        </template>
        <template v-slot:[`item.is_calculated`]="{ item }">
          <v-row justify="center">
            <v-icon cols="12" v-if="item.is_calculated == true" color="green">
              mdi-check-bold
            </v-icon>
            <v-icon class="mx-auto" v-else color="red">
              mdi-close-thick
            </v-icon>
          </v-row>
        </template>
        <template v-slot:[`item.is_used_by_calculation`]="{ item }">
          <v-row justify="center">
            <v-icon
              cols="12"
              v-if="item.is_used_by_calculation == true"
              color="green"
            >
              mdi-check-bold
            </v-icon>
            <v-icon class="mx-auto" v-else color="red">
              mdi-close-thick
            </v-icon>
          </v-row>
        </template>
        <template v-slot:[`item.is_show_on_pop_up`]="{ item }">
          <v-row justify="center">
            <v-icon
              cols="12"
              v-if="item.is_show_on_pop_up == true"
              color="green"
            >
              mdi-check-bold
            </v-icon>
            <v-icon class="mx-auto" v-else color="red">
              mdi-close-thick
            </v-icon>
          </v-row>
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <v-row justify="start">
            <v-col cols="2">
              <v-icon @click="getDataSubcategoryById(item)"
                >mdi-square-edit-outline</v-icon
              >
            </v-col>
            <v-col cols="2" class="ml-2">
              <v-icon @click="deleteData(item)">mdi-delete-outline</v-icon>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          <div>{{ item.created_at | moment }}</div>
        </template>
        <template v-slot:[`item.updated_at`]="{ item }">
          <div>{{ item.created_at | moment }}</div>
        </template>
        <!-- Handle data error -->
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn color="primary" @click="resetData"> Reset </v-btn>
          </div>
        </template>
      </v-data-table>
      <!-- Pagination -->
      <v-container class="max-width">
        <v-row justify="end" align="center">
          <v-col cols="2">
            <v-select
              :items="pagination.rowsPerPageItems"
              class="item-per-page"
              v-model="pagination.rowsPerPage"
              @change="getDataSubcategoryByLimit"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="paginationType.totalItems"
          @input="setSubCategoryTable"
        ></v-pagination>
      </v-container>
      <!-- Add Item Dialog -->
      <v-dialog persistent v-model="isAddDialog" max-width="550px">
        <v-card>
          <v-overlay :absolute="true" :value="isLoading">
            <v-progress-circular
              class="loader"
              :size="50"
              color="primary"
              indeterminate
            >
            </v-progress-circular>
            <span>Mohon tunggu, kami kirimin datanya dulu ke server... </span>
          </v-overlay>
          <div class="pa-5 font-weight-bold d-flex">
            Add Sub-category
            <v-spacer></v-spacer>
            <v-icon @click="closeAddDialog">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <div class="pa-5">
            <v-form>
              <label>Name</label>
              <v-text-field
                placeholder="Name"
                v-model="formSubmit.name"
                outlined
                dense
              ></v-text-field>
              <label>Description</label>
              <v-text-field
                placeholder="Description"
                v-model="formSubmit.description"
                outlined
                dense
              >
              </v-text-field>
              <label>Unit</label>
              <v-text-field
                placeholder="Unit"
                v-model="formSubmit.unit"
                outlined
                dense
              ></v-text-field>
              <label>Category</label>
              <v-select
                v-model="formSubmit.category_id"
                outlined
                dense
                placeholder="Category"
                :items="select_category_items"
                item-text="name"
                item-value="id"
              ></v-select>
              <label>Data Types</label>
              <v-select
                v-model="formSubmit.data_type"
                outlined
                dense
                placeholder="Data Types"
                :items="select_data_type_items"
                item-text="name"
                item-value="name"
              ></v-select>
              <div
                class="if_the_type_select"
                v-if="is_type_was_select != false"
              >
                <label>Option Value</label>
                <div>
                  <v-row
                    class=""
                    v-for="(field, index) in dynamicField"
                    :key="index"
                  >
                    <v-col cols="9" v-if="index != 0">
                      <v-text-field
                        placeholder="Option value"
                        v-model="field['value']"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="9" v-else>
                      <v-text-field
                        placeholder="Option value"
                        v-model="field['value']"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col cols="4">
											<v-select
												:items="weightItems"
												v-model="field['weight']"
												item-text="text"
												item-value="value"
												placeholder="weight"
												dense
												outlined
											></v-select>
										</v-col> -->

                    <v-col cols="2" v-if="index != 0">
                      <v-btn
                        class="action pa-5"
                        small
                        outlined
                        @click="removeField('create', index)"
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-center mb-5" style="width: 100%">
                    <v-btn
                      class="action pa-5"
                      small
                      outlined
                      @click="addField('create')"
                    >
                      +
                    </v-btn>
                    <p class="ml-3 pt-3">Add other options</p>
                  </div>
                </div>
              </div>
              <v-divider class="mb-3"></v-divider>
              <label>Show On Table</label>
              <v-switch
                class="my-3"
                v-model="formSubmit.is_on_table"
                :label="`${formSubmit.is_on_table ? 'Yes' : 'No'}`"
              >
              </v-switch>
              <label>Show On Map Detail</label>
              <v-switch
                class="my-3"
                v-model="formSubmit.is_show_on_pop_up"
                :label="`${formSubmit.is_show_on_pop_up ? 'Yes' : 'No'}`"
              >
              </v-switch>
            </v-form>

            <v-btn
              color="#134889"
              width="100%"
              class="white--text"
              :loading="isLoading"
              :disabled="isLoading"
              @click="submitAddData"
            >
              {{ $t("ui.button_submit") }}
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- Edit Item Dialog -->
      <v-dialog persistent v-model="isEditDialog" max-width="550px">
        <v-card>
          <v-overlay :absolute="true" :value="isLoadingContent">
            <v-progress-circular
              class="loader"
              :size="50"
              color="primary"
              indeterminate
            >
            </v-progress-circular>
            <span style="left: calc(50% - 6rem) !important"
              >Data sedang kami periksa...
            </span>
          </v-overlay>
          <div class="pa-5 font-weight-bold d-flex">
            Edit Sub-category
            <v-spacer></v-spacer>
            <v-icon @click="closeEditDialog">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <div class="pa-5">
            <v-form>
              <label>Name</label>
              <v-text-field
                placeholder="Name"
                v-model="formUpdate.name"
                outlined
                dense
              ></v-text-field>
              <label>Description</label>
              <v-text-field
                placeholder="Description"
                v-model="formUpdate.description"
                outlined
                dense
              >
              </v-text-field>
              <label>Unit</label>
              <v-text-field
                placeholder="Unit"
                v-model="formUpdate.unit"
                outlined
                dense
              ></v-text-field>
              <label>Category</label>
              <v-select
                v-model="formUpdate.category_id"
                outlined
                dense
                placeholder="Category"
                :items="select_category_items"
                item-text="name"
                item-value="id"
              ></v-select>
              <label>Data Types</label>
              <v-select
                v-model="formUpdate.data_type"
                outlined
                dense
                placeholder="Data Types"
                :items="select_data_type_items"
                :disabled="
                  formUpdate.is_calculated == true ||
                  formUpdate.is_used_by_calculation == true
                    ? true
                    : true
                "
                item-text="name"
                item-value="name"
              ></v-select>
              <div class="if_the_type_select" v-if="is_type_was_select == true">
                <label>Option Value</label>
                <div class="pmt-flex wrap is-row">
                  <v-row
                    class="pmt-flex wrap is-row"
                    v-for="(field, index) in formUpdate.dynamicField"
                    :key="index"
                  >
                    <v-col cols="5" v-if="field['oldValue'] != ''">
                      <v-text-field
                        placeholder="Option value"
                        v-model="field['value']"
                        outlined
                        dense
                        :disabled="field['isDisabled']"
                      >
                        <v-icon
                          v-if="field['isDisabled'] == true"
                          slot="append"
                          @click="field['isDisabled'] = false"
                        >
                          mdi-square-edit-outline
                        </v-icon>
                        <v-icon
                          v-else
                          slot="append"
                          @click="field['isDisabled'] = true"
                        >
                          mdi-close
                        </v-icon>
                      </v-text-field>
                    </v-col>
                    <v-col cols="5" v-else>
                      <v-text-field
                        placeholder="Option value"
                        v-model="field['value']"
                        outlined
                        dense
                        :disabled="field['isDisabled']"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3" v-if="formUpdate.is_used_by_calculation">
                      <v-select
                        :items="weightItems"
                        v-model="field['weight']"
                        outlined
                        dense
                        item-text="text"
                        item-value="value"
                        placeholder="Weigth"
                      ></v-select>
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        class="action pa-5"
                        small
                        outlined
                        :disabled="
                          formUpdate.is_calculated == true ||
                          formUpdate.is_used_by_calculation == true
                            ? true
                            : false
                        "
                        @click="
                          removeField('update', {
                            index: index,
                            id: formUpdate.id,
                            text: field['value'],
                          })
                        "
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="2"
                      v-if="
                        field['isDisabled'] != true && field['oldValue'] != ''
                      "
                    >
                      <v-btn
                        class="action pa-5"
                        small
                        outlined
                        @click="
                          optionUpdate({
                            id: formUpdate.id,
                            old_value: field['oldValue'],
                            new_value: field['value'],
                          })
                        "
                      >
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <div
                    class="d-flex justify-center mb-5 align-center"
                    style="width: 100%"
                  >
                    <v-btn
                      class="action pa-5"
                      small
                      outlined
                      @click="addField('update')"
                    >
                      +
                    </v-btn>
                    <p class="mt-4 ml-5">Add other options</p>
                  </div>
                </div>
              </div>
              <v-divider class="mb-3"></v-divider>
              <label>Show On Table</label>
              <v-switch
                class="my-3"
                v-model="formUpdate.is_on_table"
                :label="`${formUpdate.is_on_table ? 'Yes' : 'No'}`"
              >
              </v-switch>

              <label>Show On Map Detail</label>
              <v-switch
                class="my-3"
                v-model="formUpdate.is_show_on_pop_up"
                :label="`${formUpdate.is_show_on_pop_up ? 'Yes' : 'No'}`"
              >
              </v-switch>
            </v-form>

            <v-btn
              color="#134889"
              width="100%"
              class="white--text"
              :loading="isLoading"
              :disabled="isLoading"
              @click="submitUpdateData"
              >Update</v-btn
            >
          </div>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
<script src="./PotensiDesaSubcategory.js"></script>

<style lang="scss" scoped src="./PotensiDesaSubcategory.scss"></style>
