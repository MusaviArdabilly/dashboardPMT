<template>
  <div class="user-nav">
    <!-- <div class="white--text mr-3 mt-3">Admin</div> -->
    <!-- <v-avatar small v-on:click="AccountMenu()">
      <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
    </v-avatar>
    <div id="account-context" v-show="logoutPopup">
      <ejs-listview
        id="account"
        :dataSource="accountList"
        :closeOnDocumentClick="true"
        :select="AccountMenu"
        showIcon="true"
      ></ejs-listview>
    </div> -->
    <v-menu bottom min-width="4rem" rounded offset-y>
      <template v-slot:activator="{ on }">
        <v-btn icon x-large v-on="on">
          <v-avatar color="white" small v-if="user != null">
            <v-img
              height="100%"
              :src="pmt_url + user.avatar"
              :alt="user.name"
            ></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center" v-if="user != null">
            <h3>{{ user.first_name }} {{ user.last_name }}</h3>
            <p class="text-caption mt-1 pr-6 pl-6">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn @click="goToSetting" depressed rounded text>
              {{ $t("ui.text_piece.setting") }}
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn @click="logout" depressed rounded text>
              {{ $t("ui.text_piece.log_out") }}
            </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import JwtService from "../services/jwt.services";
import { AUTH_SIGNOUT } from "../store/modules/auth.module";

export default {
  data: () => ({
    user: null,
    pmt_url: process.env.VUE_APP_API_URL,

    accountList: [
      { text: "Settings", id: "001", icon: "profile" },
      { text: "Logout", id: "002", icon: "logout" },
    ],
    fields: { iconCss: "icon", tooltip: "text" },
    logoutPopup: false,
  }),
  mounted() {
    this.user = JwtService.getUser();
  },
  methods: {
    // AccountMenu: function (event) {
    //   this.logoutPopup = !this.logoutPopup;
    //   this.logoutPopupClicked = true;
    //   if (event != undefined) {
    //     if (event.data.text == "Settings") {
    //       this.$router.push({ name: "Profile" });
    //     }
    //     if (event.data.text == "Logout") {
    //       localStorage.removeItem("user");
    //       this.$router.push({ name: "Login" });
    //     }
    //   }
    // },
    logout() {
      // localStorage.removeItem("user");
      this.$store.dispatch(AUTH_SIGNOUT, this.user.id);

      this.$router.push({ name: "Login" });
    },
    goToSetting() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>

<style scoped>
#account-context {
  float: right;
  background: #ccc;
  position: absolute;
  border: none;
  width: 100px;
  height: 80px;
  z-index: 10022;
  top: 65px;
  right: 0;
  border-radius: 10px;
  margin-right: 10px;
}
div#account {
  text-align: left;
  font-size: 14px;
  padding: 2px;
  border-radius: 10px;
  border: none;
}
</style>
