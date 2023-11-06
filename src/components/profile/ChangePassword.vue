<template>
  <div class="psswrd-field">
    <v-form @submit="changePassword">
      <v-row>
        <v-col lg="6">
          <div class="mb-5">
            {{ $t("ui.profile_page.change_password_label.current_password") }}
          </div>
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            outlined
            single-line
            placeholder="Password"
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
        <v-col lg="6">
          <div class="mb-5">
            {{ $t("ui.profile_page.change_password_label.new_password") }}
          </div>
          <v-text-field
            v-model="new_password"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            outlined
            single-line
            placeholder="Password"
            @click:append="show2 = !show2"
          ></v-text-field>
        </v-col>
        <div class="ml-3 mb-5">
          <v-btn
            @click="changePassword"
            class="mr-5 upld-btn text-none"
            elevation="0"
            >{{ $t("ui.button_save") }}</v-btn
          >
          <v-btn class="text-none dscrd-btn" elevation="0">{{
            $t("ui.button_cancel")
          }}</v-btn>
        </div>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import JwtService from "../../services/jwt.services";

export default {
  data: () => ({
    show1: false,
    show2: false,
    password: null,
    new_password: null,
    username: "",
    id: "",
  }),

  created() {
    const data = JwtService.getUser();
    console.log(data);
    this.id = data.id;
    this.username = data.username;
    this.user_token = JwtService.getToken();
  },

  methods: {
    changePassword() {
      console.log("masuk");
      const data = {
        id: this.id,
        username: this.username,
        current_password: this.password,
        new_password: this.new_password,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/account/change-password`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error == true) {
            this.$swal("Opps", result.message, "error");
          } else {
            this.$swal({
              title: "Success",
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
