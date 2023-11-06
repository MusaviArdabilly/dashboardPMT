<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="4" v-if="token != ''">
        <!-- Success -->
        <v-card v-if="is_success" class="pa-5 text-center" height="500">
          <v-row>
            <v-col cols="12">
              <img src="../../../../assets/image/kominfo.png" alt="kominfo" />
            </v-col>
            <v-col cols="12">
              <div
                class="font-weight-bold mb-5"
                style="color: #4f4f4f; font-size: 16px"
              >
                Selamat
              </div>
              <div class="font-weight-bold mb-5" style="color: #4f4f4f">
                Akun Sistem PMT anda sudah berhasil terverifikasi
              </div>
              <div class="grey--text">
                Klik tombol dibawah ini untuk menuju ke aplikasi PMT
              </div>
              <v-btn
                width="100%"
                elevation="0"
                color="#169CD6"
                class="white--text pa-6 mt-5"
                :to="{ name: 'Login' }"
              >
                Login
              </v-btn>
            </v-col>
            <v-row class="mt-5" style="margin-bottom: 95px">
              <v-col xl="4" lg="4" md="4" sm="4" xs="4">
                <img
                  class="float-right"
                  width="60%"
                  src="../../../../assets/image/image7.png"
                  alt="image7"
                />
              </v-col>
              <v-col class="text-center" xl="4" lg="4" md="4" sm="4" xs="4">
                <img width="60%" src="../../../../assets/image/moda.png" alt="moda" />
              </v-col>
              <v-col xl="4" lg="4" md="4" sm="4" xs="4">
                <img
                  width="60%"
                  src="../../../../assets/image/image9.png"
                  alt="image8"
                />
              </v-col>
            </v-row>
          </v-row>
        </v-card>
        <!-- Not Success -->
        <v-card v-else class="pa-5 text-center" height="500">
          <v-row>
            <v-col cols="12">
              <img src="../../../../assets/image/kominfo.png" alt="kominfo" />
            </v-col>
            <v-col cols="12">
              <div
                class="font-weight-bold"
                style="color: #4f4f4f; font-size: 16px"
              >
                Verifikasi akun gagal
              </div>
              <div class="font-weight-bold mt-5 mb-5" style="color: #4f4f4f">
                Link yang anda gunakan sudah tidak valid atau kadaluarsa, silahkan hubungi admin
                untuk melakukan verifikasi ulang
              </div>
            </v-col>
            <v-row class="mt-5" justify="end" align="end">
              <v-col xl="4" lg="4" md="4" sm="4" xs="4">
                <img
                  class="float-right"
                  width="60%"
                  src="../../../../assets/image/image7.png"
                  alt="image7"
                />
              </v-col>
              <v-col class="text-center" xl="4" lg="4" md="4" sm="4" xs="4">
                <img width="60%" src="../../../../assets/image/moda.png" alt="moda" />
              </v-col>
              <v-col xl="4" lg="4" md="4" sm="4" xs="4">
                <img
                  width="65%"
                  src="../../../../assets/image/image9.png"
                  alt="image8"
                />
              </v-col>
            </v-row>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script src="./UserVerification.js"></script>

<style scoped>
</style>
