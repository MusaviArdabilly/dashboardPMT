<template>
  <div class="activity-log">
    <!-- <NavBar /> -->
    <div class="mt-5 font-weight-bold">
      {{ $t("general.menu.site_settings") }}
    </div>
    <v-card class="mt-5 pa-5">
      <!-- <v-row>
        <v-col cols="2">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            placeholder="Search"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row> -->
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        class="elevation-0"
        hide-default-footer
        :items-per-page="rowsPerPage"
      >
        <template v-slot:item.value="{ item }">
          <v-btn
            v-if="item.name == 'link_download_ios'"
            target="_blank"
            :href="item.value"
            >{{ $t("ui.button_download") }}</v-btn
          >
          <p v-else>{{ item.value }}</p>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
        </template>
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </div>
        </template>
      </v-data-table>
      <!-- DIALOG UPDATE -->
      <v-dialog v-model="dialog_update" max-width="500px">
        <v-card>
          <div class="pa-5 font-weight-bold d-flex">
            Update Setting
            <v-spacer></v-spacer>
            <v-icon @click="dialog_update = false">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <div class="pa-5">
            <v-form @submit="updateUser">
              <div>Name</div>
              <v-text-field
                v-model="form_update.name"
                outlined
                dense
                disabled
                placeholder="Name"
                :rules="rules"
              ></v-text-field>
              <div>Description</div>
              <v-text-field
                v-model="form_update.description"
                outlined
                dense
                placeholder="Description"
                :rules="rules"
              ></v-text-field>
              <div>Value</div>
              <v-text-field
                v-model="form_update.value"
                outlined
                dense
                placeholder="Value"
                :rules="rules"
              ></v-text-field>
              <v-btn
                @click="updateUser"
                elevation="0"
                class="text-capitalize white--text"
                width="100%"
                color="#134889"
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

<script src="./SiteSettings.js"></script>
