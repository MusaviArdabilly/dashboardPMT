<template>
  <div class="pmt-login">
    <v-card
      class="crd-login pa-5"
      elevation="2"
      style="border-radius: 25px !important"
    >
      <div class="kominfo-logo d-flex justify-center align-center mt-15 mb-5">
        <img src="../../../../assets/image/kominfo.png" alt="kominfo" />
      </div>
      <div class="text-center">
        <div>Direktorat Jendral</div>
        <div class="mb-2">Penyelenggaraan Pos dan Informatika</div>
        <div class="font-weight-bold mb-5">
          Dashboard Pusat Monitoring Telekomunikasi
        </div>
      </div>
      <div @click="toLogin" class="rgstr-nav d-flex">
        <v-icon color="#645959" class="mr-5">mdi-arrow-left</v-icon>
        <div>Forgot Password</div>
      </div>

      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
        <v-row class="mt-10 pl-10 pr-10">
          <v-col xl="12" lg="12" md="12" sm="12" xs="12">
            <v-text-field
              v-model="username"
              outlined
              single-line
              placeholder="Input Username"
              :rules="usernameRules"
            ></v-text-field>
          </v-col>
          <v-col xl="12" lg="12" md="12" sm="12" xs="12">
            <v-text-field
              v-model="email"
              outlined
              single-line
              placeholder="Input Email"
              :rules="emailRules"
              @keyup.enter.prevent
              @keydown.enter.prevent
            ></v-text-field>
          </v-col>
          <v-col xl="12" lg="12" md="12" sm="12" xs="12">
            <vue-recaptcha
              ref="recaptcha"
              @verify="verify"
              @error="error"
              badge="inline"
              tabindex="1"
              :sitekey="enviroments"
              :load-recaptcha-script="true"
              @expired="onCaptchaExpired"
            ></vue-recaptcha>
          </v-col>
          <v-col class="mb-10" xl="12" lg="12" md="12" sm="12" xs="12">
            <v-btn
              @click="sendEmail"
              width="100%"
              elevation="0"
              color="#169CD6"
              class="white--text pa-6"
              :disabled="blockSubmit"
            >
              Submit
            </v-btn>
            <div
              v-if="showCountDown"
              class="text-center mt-5 d-flex justify-center align-center grey--text"
            >
              Resend email
              <div class="ml-3 grey--text">
                [00:{{ countDown ? countDown : "00" }}]
              </div>
            </div>
          </v-col>
          <v-col xl="4" lg="4" md="4" sm="4" xs="4">
            <img
              class="float-right"
              width="60%"
              src="../../../../assets/image/image7.png"
              alt="image7"
            />
          </v-col>
          <v-col class="text-center" xl="4" lg="4" md="4" sm="4" xs="4">
            <img src="../../../../assets/image/moda.png" alt="moda" />
          </v-col>
          <v-col xl="4" lg="4" md="4" sm="4" xs="4">
            <img
              width="62%"
              src="../../../../assets/image/image9.png"
              alt="image8"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-dialog v-model="dialog" width="30%">
      <v-card
        class="notif pa-5 d-flex flex-column text-center justify-center align-center"
      >
        <img
          class="logo mt-5"
          src="../../../../assets/image/email-sent.svg"
          alt=""
          v-if="!message_status"
        />
        <v-icon v-else color="error" size="100"> mdi-alert </v-icon>

        <div class="pa-5">
          {{ message }}
          <!-- <br />
          <p v-if="!message_status">{{ message_hint }}</p> -->
        </div>
        <v-btn
          @click="submitResetPassword"
          width="50%"
          elevation="0"
          color="#169CD6"
          class="white--text pa-6 mb-5"
          v-if="message_status"
          >OK</v-btn
        >
        <v-btn
          @click="toLogin"
          width="50%"
          elevation="0"
          color="#169CD6"
          class="white--text pa-6 mb-5"
          v-else
          >OK</v-btn
        >
      </v-card>
    </v-dialog>
    <v-overlay :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script src="./ForgotPassword.js"></script>

<style lang="scss" scoped>
.pmt-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.rgstr-nav {
  margin-left: 70px;
  cursor: pointer;
}

.notif {
  &.logo {
    width: 20%;
  }
}
</style>
