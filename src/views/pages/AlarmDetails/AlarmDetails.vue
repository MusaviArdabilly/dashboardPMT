<template>
  <section class="single-page p-0">
    <div class="pmt-flex wrap at-end">
      <v-col cols="3" md="4" xl="3" v-if="isViewer != true">
        <download-excel
          class="btn btn-default"
          :data="data"
          :fields="printOutHeader"
          worksheet="My Worksheet"
          name="alarm_details_cell_operator.xls"
        >
          <v-btn block elevation="1" color="white">
            <div class="mr-2 text-capitalize">
              {{ $t("ui.button_download") }}
            </div>
            <v-icon>mdi-file-download-outline</v-icon>
          </v-btn>
        </download-excel>
      </v-col>
    </div>
    <v-card class="pa-5 mt-5">
      <v-data-table
        :headers="headers"
        :items="data"
        sort-by="calories"
        class="elevation-0"
      >
        <template v-slot:item.severity="{ item }">
          <v-chip
            :class="[
              item.severity == 'Major'
                ? `ma-2 red--text font-weight-bold`
                : `ma-2 orange--text font-weight-bold`,
            ]"
            :color="item.severity == 'Major' ? '#EDC2C2' : '#F4E0CD'"
          >
            {{ item.severity }}
          </v-chip>
        </template>
        <template v-slot:item.start_at="{ item }">
          <div>{{ item.start_at | moment }}</div>
        </template>
        <template v-slot:item.close_at="{ item }">
          <div>{{ item.close_at | moment }}</div>
        </template>
        <template v-slot:item.latitude="{ item }">
          <p>Latitude : {{ item.latitude }}</p>
          <p>Longitude : {{ item.longitude }}</p>
        </template>
        <template v-slot:item.id="{ item }">
          <a
            is="v-btn"
            class="font-weight-bold text-capitalize"
            :href="`${directToMap}?latitude=${item.latitude}&longitude=${item.longitude}`"
            text
            color="#134889"
            >{{ $t("ui.button_see_map") }}</a
          >
        </template>
        <!-- <template v-slot:item.actions="{ item }">
        <v-btn outlined @click="editItem(item)">View</v-btn>
      </template> -->
        <template v-slot:no-data>
          <div class="pa-5">
            <img
              height="300px"
              src="../../../assets/image/empty.svg"
              alt="no data"
            />
            <div>No Data</div>
            <!-- <v-btn color="primary" @click="getRating"> Reset </v-btn> -->
          </div>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script src="./AlarmDetails.js"></script>

<style></style>
