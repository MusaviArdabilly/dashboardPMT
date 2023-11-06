<template>
  <v-dialog v-model="coverage" width="500" persistent>
    <v-card class="pa-5">
      <v-row>
        <v-col lg="11">
          <div class="text-center font-weight-bold">Filter</div>
        </v-col>
        <v-col lg="1">
          <v-icon @click="closeCoverage" class="close-ic">mdi-close</v-icon>
        </v-col>
      </v-row>
      <div class="mt-5 mb-5">Wilayah</div>
      <v-select
        v-model="selected_province"
        :items="province"
        item-text="name"
        item-value="id"
        @input="getCity(selected_province)"
        dense
        outlined
        rounded
        placeholder="National/Province"
      ></v-select>
      <v-select
        v-model="selected_city"
        :items="city"
        item-text="name"
        item-value="id"
        @input="getDistrict(selected_city)"
        dense
        outlined
        rounded
        placeholder="City"
      ></v-select>
      <v-select
        v-model="selected_district"
        :items="district"
        item-text="name"
        item-value="id"
        @input="getSubDistrict(selected_district)"
        dense
        outlined
        rounded
        placeholder="District"
      ></v-select>
      <v-select
        v-model="selected_sub_district"
        :items="sub_district"
        item-text="name"
        item-value="id"
        dense
        outlined
        rounded
        placeholder="Subdistrict"
      ></v-select>
      <!-- <div class="mt-5 mb-5">Klarifikasi Sinyal</div>
      <v-select dense outlined rounded placeholder="Technology"></v-select>
      <v-select dense outlined rounded placeholder="Operator"></v-select>
      <v-select
        dense
        outlined
        rounded
        placeholder="Signal Strenght Class"
      ></v-select>
      <v-select dense outlined rounded placeholder="Subdistrict"></v-select> -->
      <div class="mt-5 d-flex justify-center">
        <v-btn
          elevation="0"
          color="#106BFF"
          class="mr-5 text-capitalize white--text"
          width="220"
          @click="closeCoverage"
          >{{ $t("ui.button_apply") }}</v-btn
        >
        <v-btn
          elevation="0"
          color="#EA5455"
          class="text-capitalize white--text"
          width="220"
          @click="resetField"
          >Reset</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import JwtService from "../../../services/jwt.services";

export default {
  props: ["coverage"],
  data: () => ({
    province: [],
    city: [],
    district: [],
    sub_district: [],
    selected_province: 0,
    selected_city: 0,
    selected_district: 0,
    selected_sub_district: 0,
  }),

  mounted() {
    this.user_token = JwtService.getToken();
    this.initialize();
  },
  methods: {
    closeCoverage() {
      this.$emit("closeCoverage", false);
    },
    initialize() {
      this.getProvince();
      this.getCity();
      this.getDistrict();
      this.getSubDistrict();
    },

    getProvince() {
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/province`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.error == false) {
            this.province = result.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCity(value) {
      console.log(value);
      if (value == undefined) {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          province_id: this.selected_data.province_id,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.error == false) {
              this.city = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          province_id: value,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/city`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.error == false) {
              this.city = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getDistrict(value) {
      if (value == undefined) {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          city_id: this.selected_data.city_id,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.error == false) {
              this.district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          city_id: value,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.error == false) {
              this.district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getSubDistrict(value) {
      if (value == undefined) {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          district_id: this.selected_data.district_id,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.error == false) {
              this.sub_district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const data = {
          limit: 100,
          page: 1,
          sort: "asc",
          start_date: "",
          end_date: "",
          search: "",
          district_id: value,
        };
        fetch(process.env.VUE_APP_API_URL + `api/v1/id/location/sub_district`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.error == false) {
              this.sub_district = result.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    resetField() {
      this.selected_province = 0;
      this.selected_city = 0;
      this.selected_district = 0;
      this.selected_sub_district = 0;
    },
  },
};
</script>

<style scoped></style>
