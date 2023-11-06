<template>
  <div class="table-content">
    <div class="title">
      <h4>{{ $t("general.menu.list_application") }}</h4>
    </div>
    <v-card class="pa-5 mt-5">
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        sort-by="calories"
        class="elevation-0"
        hide-default-footer
      >
        <template v-slot:item.is_active="{ item }">
          <div>{{ item.is_active ? "Active" : "Inactive" }}</div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
    </v-card>
  </div>
</template>

<script src="./ListApplication.js"></script>
