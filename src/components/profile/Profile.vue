<template>
  <v-row>
    <v-form style="width: 100%">
      <v-row class="pa-3">
        <v-col lg="12">
          <div class="field-name">Avatar</div>
          <v-row>
            <v-col cols="1">
              <v-avatar>
                <v-img
                  height="100%"
                  :src="pmt_url + user_data.avatar"
                  :alt="user_data.name"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="11">
              <v-file-input
                class="profile"
                :rules="logo_rules"
                accept="image/png, image/jpeg, image/bmp, .svg"
                dense
                outlined
                v-model="user_pict"
                prepend-icon="mdi-camera"
                placeholder="Change avatar"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="field-name">First name</div>
          <v-text-field
            v-model="firstname"
            class="mt-2"
            placeholder="First Name"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="field-name">Last name</div>
          <v-text-field
            v-model="lastname"
            class="mt-2"
            placeholder="Last Name"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="field-name">Institution</div>
          <v-select
            v-model="selected_department"
            :items="department"
            :disabled="true"
            item-value="seleceted_department"
            item-text="department"
            class="mt-2"
            placeholder="Institution"
            outlined
          ></v-select>
        </v-col>
        <!-- <v-col lg="6">
          <div class="field-name">Position</div>
          <v-text-field
            v-model="position"
            :disabled="true"
            class="mt-2"
            placeholder="Position"
            outlined
          ></v-text-field>
        </v-col> -->

        <v-col cols="12" lg="6">
          <div class="field-name">Role</div>
          <v-select
            v-model="selected_role"
            :items="roles"
            :disabled="true"
            item-value="selected_role"
            item-text="roles"
            class="mt-2"
            placeholder="Role"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="field-name">Email</div>
          <v-text-field
            class="mt-2"
            v-model="email"
            :disabled="true"
            placeholder="Email"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="12">
          <v-btn
            @click="saveProfile"
            class="mr-5 upld-btn text-none"
            elevation="0"
            >{{ $t("ui.button_save") }}</v-btn
          >
          <!-- <v-btn class="text-none dscrd-btn" elevation="0">Discard</v-btn> -->
        </v-col>
      </v-row>
    </v-form>
    <v-overlay :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>
import JwtService from "../../services/jwt.services";
import { SET_AUTH } from "../../store/modules/auth.module.js";

export default {
  data: () => ({
    loading_overlay: false,
    user: null,
    user_token: null,
    pmt_url: process.env.VUE_APP_API_URL,
    firstname: "",
    lastname: "",
    user_data: {},
    department: ["Kominfo", "Non-Kominfo"],
    selected_department: "",
    selected_role: "",
    position: "",
    email: "",
    roles: ["admin", "operator"],
    image_file: null,
    user_pict: null,
    logo_rules: [
      (value) =>
        !value ||
        value.size < 5000000 ||
        "Ukuran logo harus dibawah dari 2 MB!",
    ],
  }),

  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.selected_department = this.user.department;

    console.log(this.selected_department);
  },

  created() {
    const data = JwtService.getUser();
    this.user_data = data;
    this.firstname = data.first_name;
    this.lastname = data.last_name;
    this.position = data.position;
    this.email = data.email;
    this.selected_role = data.role;
  },

  methods: {
    uploadImage() {
      this.$refs.file.click();
    },
    inputImage(event) {
      const picture = event.target.files[0];
      this.image_file = event.target.files[0];
      this.user_pict = URL.createObjectURL(picture);
    },

    saveProfile() {
      this.loading_overlay = true;

      let formData = new FormData();

      formData.append("first_name", this.firstname);
      formData.append("last_name", this.lastname);
      if (this.user_pict != null) {
        formData.append("avatar", this.user_pict);
      }
      formData.append("current_avatar", this.user_data.avatar);

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/account/update-profile`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ` + this.user_token,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.loading_overlay = false;
          if (result.error == true) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            return;
          } else {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
            this.$store.commit(SET_AUTH, result.data);
            location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
/* @import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-layouts/styles/material.css"; */
#element {
  display: block;
  width: 300px;
  margin: 100px auto;
  border-radius: 3px;
}

.e-avatar {
  background-image: url("../../assets/image/ridwan.jpg");
}

.upld-btn {
  background-color: #106bff !important;
  color: #ffffff !important;
}

.rst-btn {
  background-color: #ffffff !important;
  color: #9e9e9e !important;
  border: 1px solid #9e9e9e !important;
}

.field-name {
  color: #5e5873;
}

.dscrd-btn {
  background-color: #ffffff !important;
  color: #ea5455 !important;
  border: 1px solid #ea5455 !important;
}

.profile .v-input__prepend-outer {
  display: none;
}
</style>
