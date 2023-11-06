<template>
  <v-navigation-drawer v-model="drawer" width="400" absolute right>
    <div class="pa-10 d-flex">
      <h3>Informasi</h3>
      <v-spacer></v-spacer>
      <v-btn @click="closeDrawerInfo" text
        ><v-icon class="close-ic">mdi-close</v-icon></v-btn
      >
    </div>
    <div class="text-center">
      <v-pagination
        v-if="info.features"
        v-model="page"
        :total-visible="5"
        :length="info.features.length"
      ></v-pagination>
    </div>
    <!-- {{ info.features[page - 1].properties }} -->

    <!-- DETAIL FROM FEATURES -->
    <v-container v-if="info.features">
      <!-- Coverage Info -->
      <v-row v-if="info.features[page - 1].properties.kls_sign != null">
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].id"
            label="ID"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.kdepum"
            label="Kode Desa"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.luas"
            label="Luas Wilayah"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.kls_sign"
            label="Kualitas Sinyal"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmpr"
            label="Provinsi"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmkk"
            label="Kota/Kabupaten"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmkc"
            label="Kecamatan"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.namobj"
            label="Kelurahan/Desa"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>

      <!-- BTS Info -->
      <v-row
        v-if="
          info.features[page - 1].properties.ossbtsidna != null ||
          info.features[page - 1].properties.oss_nodeb != null ||
          info.features[page - 1].properties.ossnodebid != null ||
          info.features[page - 1].properties.no_ != null ||
          info.features[page - 1].properties.osslteenod != null
        "
      >
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].id"
            label="ID"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.siteid"
            label="Site ID"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.longitude"
            label="Longitude"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.latitude"
            label="Latitude"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.azimuth"
            label="Azimuth"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.antennahei"
            label="Tinggi Antena"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.antennapow"
            label="Power Antena"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.neid"
            label="NE ID"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.sitetype"
            label="Site Type"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="info.features[page - 1].properties.address"
            label="Alamat"
            outlined
            readonly
          >
          </v-textarea>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.kabupaten"
            label="Kota/Kabupaten"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.kecamatan"
            label="Kecamatan"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.backuppowe"
            label="Backup Power"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.transmisi"
            label="Transmisi"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.statussite"
            label="Status Site"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Batas Wilayah -->
      <v-row v-if="info.features[page - 1].properties.fid != null">
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmpr"
            label="Provinsi"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmkk"
            label="Kota/Kabupaten"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmkc"
            label="Kecamatan"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.namobj"
            label="Kelurahan/Desa"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Fixed Broadband -->
      <v-row v-if="info.features[page - 1].properties.pt != null">
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.pt"
            label="PT"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.letak"
            label="Letak"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.panjang"
            label="Panjang"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.cut_off"
            label="Cut Off"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.sumber"
            label="Sumber"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmpr"
            label="Provinsi"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmkk"
            label="Kota/Kabupaten"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.wadmkc"
            label="Kecamatan"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.namobj"
            label="Kelurahan/Desa"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Kontur -->
      <v-row v-if="info.features[page - 1].properties.shape_leng != null">
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.remark"
            label="Remark"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.shape_leng"
            label="Shape Length"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Toponimi -->
      <v-row v-if="info.features[page - 1].properties.is_approve != null">
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.namobj"
            label="Daerah"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.features[page - 1].properties.remark"
            label="Remark"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <!-- DETAIL FROM ALARM -->
    <v-container v-else-if="info.severity">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="info.cell_operator.name"
            label="Network Operator"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.site_id"
            label="Site ID"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.site_name"
            label="Site Name"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="info.address" label="Alamat" outlined readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="info.device" label="Device" outlined readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.technology"
            label="Technology"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.description"
            label="Description"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.latitude"
            label="Latitude"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.longitude"
            label="Longitude"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.severity"
            label="Severity"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="info.status" label="Status" outlined readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.category"
            label="Category"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.start_at"
            label="Created Time"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <!-- DETAIL FROM QOE -->
    <v-container v-else>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="info.username"
            label="Username"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.user_information.email"
            label="Email"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.cell_operator.name"
            label="Network Operator"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.user_information.mcc"
            label="MCC"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.user_information.mnc"
            label="MNC"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.user_information.full_address.latitude"
            label="Latitude"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="info.user_information.full_address.longitude"
            label="Longitude"
            outlined
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { SET_INFO_DRAWER } from "../../../store/modules/maps.module";

export default {
  data: () => ({
    page: 1,
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.getters.getInfoDrawer;
      },
      set(val) {
        return val;
      },
    },
    info: {
      get() {
        return this.$store.getters.getInfo;
      },
      set(val) {
        return val;
      },
    },
  },
  watch: {
    drawer() {},
    info() {
      this.page = 1;
      console.log(this.$store.getters.getInfo);
    },
  },
  methods: {
    closeDrawerInfo() {
      this.$store.commit(SET_INFO_DRAWER, false);
    },
  },
};
</script>

<style></style>
