<template>
  <div class="activity-log">
    <!-- <NavBar /> -->
    <div class="mt-5 font-weight-bold">{{ $t("general.menu.backup") }}</div>
    <v-row class="mt-5">
      <v-col cols="2">
        <v-btn
          @click="createBackup"
          rounded
          color="#1976D2"
          class="text-capitalize mb-5"
        >
          <div class="white--text">Backup</div>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="data"
      class="elevation-1 pa-5"
      :loading="loading"
      hide-default-footer
    >
      <!-- <template v-slot:item.day="{ item }">
        
      </template> -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          rounded
          color="#1976D2"
          @click="downloadFileBackup(item.file_path, item.name)"
          class="text-capitalize"
        >
          <v-icon color="white">mdi-cloud-download-outline</v-icon>
          <div class="white--text ml-5">{{ $t("ui.button_download") }}</div>
        </v-btn>
      </template>
      <template v-slot:item.created_at="{ item }">
        <div>{{ item.created_at | moment }}</div>
      </template>
      <template v-slot:no-data>
        <div class="pa-5">
          <img
            height="300px"
            src="../../../assets/image/empty.svg"
            alt="no data"
          />
          <div class="my-5">No Data</div>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-overlay :z-index="999" :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script src="./Backup.js"></script>
