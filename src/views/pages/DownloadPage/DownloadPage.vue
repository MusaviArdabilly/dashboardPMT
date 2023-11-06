<template>
  <div class="pmt-login">
    <v-card
      class="crd-login pa-5 ma-5"
      elevation="2"
      style="border-radius: 25px !important"
      width="450"
    >
      <div class="kominfo-logo d-flex justify-center align-center mt-15 mb-5">
        <img src="../../../assets/image/kominfo.png" alt="kominfo" />
      </div>
      <div class="text-center">
        <div>Direktorat Jendral</div>
        <div class="mb-2">Penyelenggaraan Pos dan Informatika</div>
        <div class="font-weight-bold mb-5">
          Dashboard Pusat Monitoring Telekomunikasi
        </div>
      </div>
      <v-row class="mt-10 pl-10 pr-10">
        <v-col xl="12" lg="12" md="12" sm="12" cols="12">
          <v-row justify="center" align="center">
            <a
              :href="link_download_android"
              target="_blank"
              class="abutton"
            >
              <img
                width="80%"
                src="../../../assets/image/download/downloadandroid.png"
                alt="image7"
              />
            </a>
          </v-row>
        </v-col>
        <v-col xl="12" lg="12" md="12" sm="12" cols="12" class="mt-3">
          <v-row justify="center" align="center">
            <a :href="`itms-services://?action=download-manifest&url=${link_download_ios}`" target="_blank" class="abutton">
              <img
                width="80%"
                src="../../../assets/image/download/downloadios.png"
                alt="image7"
              />
            </a>
          </v-row>
        </v-col>

        <v-col xl="12" lg="12" md="12" sm="12" cols="12">
          <v-btn
            :href="link_download_manual_book_web"
            target="_blank"
            width="100%"
            elevation="0"
            color="#169CD6"
            class="white--text pa-6 mb-3"
          >
            Manual Book Web
          </v-btn>
          <v-btn
            :href="link_download_manual_book_mobile"
            target="_blank"
            width="100%"
            elevation="0"
            color="#169CD6"
            class="white--text pa-6"
          >
            Manual Book Mobile
          </v-btn>
        </v-col>
        <v-col xl="4" lg="4" md="4" sm="4" xs="4">
          <img
            class="float-right"
            width="60%"
            src="../../../assets/image/image7.png"
            alt="image7"
          />
        </v-col>
        <v-col class="text-center" xl="4" lg="4" md="4" sm="4" xs="4">
          <img src="../../../assets/image/moda.png" alt="moda" />
        </v-col>
        <v-col xl="4" lg="4" md="4" sm="4" xs="4">
          <img width="62%" src="../../../assets/image/image9.png" alt="image8" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import KominfoLogo from "../../../assets/image/kominfo.png";

export default {
  data: () => ({
    link_download_ios: "",
    link_download_android: "",
    link_download_manual_book_web: "",
    link_download_manual_book_mobile: "",
    kominfo_logo: KominfoLogo,
  }),
  methods: {
    getSettingLinkIOS() {
      const data = {
        name: "link_download_ios",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/setting/findbyname`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error == false) {
            this.link_download_ios = result.data.data.value;
          }
          console.log(this.link_download_ios);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSettingLinkAndroid() {
      const data = {
        name: "link_download_android",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/setting/findbyname`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error == false) {
            this.link_download_android = result.data.data.value;
          }
          console.log(this.link_download_android);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSettingLinkManualBookWeb() {
      const data = {
        name: "link_download_manual_book_web",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/setting/findbyname`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error == false) {
            this.link_download_manual_book_web = result.data.data.value;
          }
          console.log(this.link_download_manual_book_web);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSettingLinkManualBookMobile() {
      const data = {
        name: "link_download_manual_book_mobile",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v2/id/setting/findbyname`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error == false) {
            this.link_download_manual_book_mobile = result.data.data.value;
          }
          console.log(this.link_download_manual_book_mobile);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getSettingLinkIOS();
    this.getSettingLinkAndroid();
    this.getSettingLinkManualBookWeb();
    this.getSettingLinkManualBookMobile();
  },
};
</script>

<style scoped>
.pmt-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../../assets/image/auth-bg.png");
  background-size: cover;
  object-fit: cover;
}

.abutton {
  text-align: center;
  display: inline-block;
  text-decoration: none !important;
  margin: 0 auto;
}
</style>

