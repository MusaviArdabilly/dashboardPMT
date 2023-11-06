<template>
  <v-expansion-panels class="my-3" multiple v-model="panel">
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
            v-if="loadingSubDistrict == true"
          >
          </v-progress-circular>
          <span>Please wait...</span>
        </v-overlay>
        <div class="ma-2">
          <v-row class="mt-2 mx-3">
            <v-col lg="6">
              <v-autocomplete
                :color="isEdit ? 'grey' : 'primary'"
                :readonly="isEdit"
                class="ml-2"
                @input="getCity()"
                v-model="filter.province"
                :items="itemProvince"
                item-text="name"
                item-value="id"
                flat
                hide-no-data
                hide-details
                dense
                :loading="loading"
                outlined
                :rules="rules"
                :label="$t('ui.field.province')"
              ></v-autocomplete>
            </v-col>
            <v-col lg="6">
              <v-autocomplete
                :color="isEdit ? 'grey' : 'primary'"
                :readonly="isEdit"
                class="ml-2"
                @input="getDistrict()"
                v-model="filter.city"
                :items="itemCity"
                item-text="name"
                item-value="id"
                flat
                hide-no-data
                hide-details
                :loading="loading"
                dense
                outlined
                :label="$t('ui.field.city')"
                :rules="rules"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="mt-2 mx-3">
            <v-col lg="6">
              <v-autocomplete
                :color="isEdit ? 'grey' : 'primary'"
                :readonly="isEdit"
                class="ml-2"
                @input="getSubDistrict()"
                v-model="filter.district"
                :items="itemDistrict"
                item-text="name"
                item-value="id"
                :loading="loading"
                flat
                hide-no-data
                hide-details
                dense
                outlined
                :label="$t('ui.field.district')"
                :rules="rules"
              >
              </v-autocomplete>
            </v-col>
            <v-col lg="6">
              <v-autocomplete
                :color="isEdit ? 'grey' : 'primary'"
                :readonly="isEdit"
                class="ml-2"
                @change="checkIfExist"
                v-model="filter.subDistrict"
                :items="itemSubDistrict"
                item-text="name"
                item-value="id"
                :loading="loading"
                flat
                hide-no-data
                hide-details
                dense
                outlined
                label="Sub-District"
                :rules="rules"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="mx-3">
            <v-col lg="6">
              <v-text-field
                color="grey"
                readonly
                class="ml-2"
                dense
                flat
                v-model="filter.subDistrict"
                hide-no-data
                hide-details
                outlined
                label="Sub-District Code"
              ></v-text-field>
            </v-col>

            <v-col lg="2">
              <v-btn class="ml-2" :disabled="isEdit" @click="reset"
                >Reset</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: ["isEdit", "filter"],
  data() {
    return {
      panel: [0],
      rules: [(value) => !!value || "Required"],
      loadingSubDistrict: false,
    };
  },
  computed: {
    itemProvince() {
      return this.$store.getters.province;
    },
    itemCity() {
      return this.$store.getters.city;
    },
    itemDistrict() {
      return this.$store.getters.district;
    },
    itemSubDistrict() {
      return this.$store.getters.item_sub_district;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  methods: {
    getCity() {
      this.filter.selectCity = false;
      if (this.filter.province == 0) {
        this.$store.dispatch("getCity", this.filter.province);
      } else {
        this.filter.city = 0;
        this.filter.district = 0;
        this.filter.subDistrict = 0;
        this.$store.dispatch("getSubDistrict", 0);
        this.$store.dispatch("getCity", this.filter.province);
      }
    },
    getDistrict() {
      this.filter.selectDistrict = false;
      this.$store.dispatch("getSubDistrict", 0);
      this.$store.dispatch("getDistrict", this.filter.city);
    },
    getSubDistrict() {
      this.filter.selectSubDistrict = false;
      this.$store.dispatch("getSubDistrict", this.filter.district);
    },
    checkIfExist() {
      this.loadingSubDistrict = true;
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/id/sdp/exist?sub_district_id=${this.filter.subDistrict}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$parent.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.data != true) {
            this.$swal({
              title: result.message,
              icon: "success",
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              confirmButtonText: "Ok",
            }).then(() => (this.loadingSubDistrict = false));
          } else {
            this.$swal({
              title: result.message,
              icon: "error",
              showCloseButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              confirmButtonText: "Ok",
            }).then((response) => {
              if (response.isConfirmed) {
                this.filter.subDistrict = this.$parent.selectedSubdistrict;
                this.loadingSubDistrict = false;
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    reset() {
      this.filter.province = 0;
      this.filter.city = 0;
      this.filter.district = 0;
      this.filter.subDistrict = 0;
      this.filter.searchProvice = "";
      this.filter.searchCity = "All City";
      this.filter.searchDistrict = "All District";
      this.filter.searchSubDistrict = "All Sub District";
      this.filter.selectCity = true;
      this.filter.selectDistrict = true;
      this.filter.selectSubDistrict = true;
    },
  },
};
</script>
