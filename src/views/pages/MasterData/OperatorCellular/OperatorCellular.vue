<template>
  <div class="table-content">
    <div class="title">
      <h4>{{ $t("general.menu.network_operator") }}</h4>
    </div>
    <v-card class="mt-5 pa-5">
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        :options="pagination"
        :items-per-page="pagination.rowsPerPage"
        hide-default-footer
        class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-col cols="4" lg="4" xl="4">
              <v-btn
                @click="dialog = true"
                class="text-none mr-4 mb-3 white--text"
                color="#134889"
                >{{ $t("ui.button_add_operator") }}
              </v-btn>
            </v-col>
            <v-col cols="7" lg="7" xl="7">
              <v-text-field
                class="mt-4"
                dense
                v-model="search"
                outlined
                @input="getOperator"
                :placeholder="$t('ui.table_piece.search')"
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
          </v-toolbar>
        </template>
        <template v-slot:item.logo="{ item }">
          <v-img
            :src="baseURL + `${item.logo}`"
            width="100"
            height="100"
          ></v-img>
        </template>
        <template v-slot:item.secondary_logo="{ item }">
          <v-img
            :src="baseURL + `${item.secondary_logo}`"
            width="100"
            height="100"
          ></v-img>
        </template>
        <template v-slot:item.is_active="{ item }">
          <v-chip
            v-if="item.is_active"
            class="ma-2"
            color="green"
            text-color="white"
          >
            Active
          </v-chip>
          <v-chip v-else class="ma-2" color="red" text-color="white">
            Non-Active
          </v-chip>
        </template>
        <template v-slot:item.type="{ item }">
          <v-chip
            v-if="item.type == 1"
            class="ma-2"
            color="orange"
            text-color="white"
          >
            Operator Cellular
          </v-chip>
          <v-chip v-else class="ma-2" color="purple" text-color="white">
            Fixed Broadband
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </div>
        </template>
      </v-data-table>
      <!-- PAGINATION -->
      <v-container class="max-width">
        <v-row justify="end" align="center">
          <v-col cols="2" xl="2">
            <v-select
              :items="pagination.rowsPerPageItems"
              class="item-per-page"
              v-model="pagination.rowsPerPage"
              @change="setRows"
            ></v-select>
          </v-col>
        </v-row>
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :total-visible="7"
          :length="pagination.totalItems"
          @input="initialize"
        ></v-pagination>
      </v-container>

      <!-- LOADING -->
      <v-overlay :value="loading_overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <!-- DIALOG CREATE AND UPDATE -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <div class="pa-5 font-weight-bold d-flex">
            {{ $t("general.menu.network_operator") }}
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <div class="pa-5">
            <v-form lazy-validation :valid="validation" ref="netform">
              <div>Logo</div>
              <v-img
                v-if="selected_logo_url != ''"
                :src="baseURL + selected_logo_url"
                width="100"
                height="100"
                class="my-5 mx-auto"
              ></v-img>
              <v-file-input
                v-if="selected_id != null"
                :rules="rules.logo"
                accept="image/png, image/jpeg, image/bmp, .svg"
                dense
                outlined
                v-model="form.logo"
                prepend-icon="mdi-camera"
                placeholder="Upload logo"
              ></v-file-input>
              <v-file-input
                v-else
                :rules="rules.logo.concat(rules)"
                accept="image/png, image/jpeg, image/bmp, .svg"
                dense
                outlined
                v-model="form.logo"
                prepend-icon="mdi-camera"
                placeholder="Upload logo"
              ></v-file-input>
              <div>Map Marker</div>
              <v-img
                v-if="selected_logo_marker_url != ''"
                :src="baseURL + selected_logo_marker_url"
                width="100"
                height="100"
                class="my-5 mx-auto"
              ></v-img>
              <v-file-input
                v-if="selected_id != null"
                :rules="rules.logo"
                accept="image/png, image/jpeg, image/bmp, .svg"
                dense
                outlined
                v-model="form.secondary_logo"
                prepend-icon="mdi-camera"
                placeholder="Upload logo"
              ></v-file-input>
              <v-file-input
                v-else
                :rules="rules.logo.concat(rules)"
                accept="image/png, image/jpeg, image/bmp, .svg"
                dense
                outlined
                v-model="form.secondary_logo"
                prepend-icon="mdi-camera"
                placeholder="Upload logo"
              ></v-file-input>
              <div>Name</div>
              <v-text-field
                v-model="form.name"
                outlined
                dense
                placeholder="Name"
                :rules="rules.required"
              ></v-text-field>
              <div>Description</div>
              <v-text-field
                v-model="form.description"
                outlined
                dense
                placeholder="Description"
              ></v-text-field>
              <div>Alias</div>
              <v-text-field
                v-model="form.alias"
                outlined
                dense
                placeholder="Alias"
                :rules="rules.required"
                hint="pisahkan alias dengan koma (,) dengan spasi"
              ></v-text-field>
              <div>Email</div>
              <v-text-field
                v-model="form.email"
                outlined
                dense
                placeholder="Email"
                :rules="rules.required"
                hint="pisahkan nama email dengan koma (,) tanpa spasi"
              ></v-text-field>
              <div>Tipe</div>
              <v-radio-group v-model="form.type">
                <v-radio label="Fixed Broadband" :value="2"></v-radio>
                <v-radio label="Cell Operator" :value="1"></v-radio>
              </v-radio-group>
              <div>Status</div>
              <v-switch
                v-if="selected_id == null"
                class="ml-3"
                v-model="form.is_active"
                inset
                :rules="rules.required"
              ></v-switch>
              <v-switch
                v-else
                class="ml-3"
                v-model="form.is_active"
                inset
              ></v-switch>
              <v-btn
                v-if="selected_id == null"
                elevation="0"
                class="text-capitalize white--text"
                width="100%"
                color="#134889"
                @click="createNetworkOperator"
                >Submit</v-btn
              >
              <v-btn
                v-else
                elevation="0"
                class="text-capitalize white--text"
                width="100%"
                color="#134889"
                @click="updateNetworkOperator"
                >Submit</v-btn
              >
            </v-form>
          </div>
        </v-card>
        <v-alert
          :value="alert"
          dense
          type="success"
          transition="scale-transition"
        ></v-alert>
      </v-dialog>
    </v-card>
  </div>
</template>

<script src="./OperatorCellular.js"></script>
