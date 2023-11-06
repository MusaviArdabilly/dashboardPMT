<template>
  <div>
    <!-- mobile view -->
    <v-card
      class="pa-5 d-md-none d-lg-none d-xl-none d-flex flex-column justify-center align-center"
    >
      <div class="mb-5">
        <img src="../../../../assets/image/kominfo.png" alt="kominfo" />
      </div>
      <div class="text-center mb-5">
        <div
          class="font-weight-bold mb-2"
          style="color: #4f4f4f; font-size: 16px"
        >
          Dashboard
        </div>
        <div
          class="font-weight-bold mb-5"
          style="color: #4f4f4f; font-size: 16px"
        >
          Pusat Monitoring Telekomunikasi
        </div>
        <div class="font-weight-bold mb-5" style="color: #4f4f4f">
          Change Password
        </div>
        <div class="grey--text">Masukan password baru dan konfirmasi</div>
        <div class="grey--text">untuk melanjutkan</div>
      </div>
      <v-form @submit.prevent>
        <v-text-field
          v-model="password"
          name="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock"
          outlined
          single-line
          placeholder="Password baru"
          @click:append="show1 = !show1"
          :rules="passwordRules"
          @keyup.enter.prevent
          @keydown.enter.prevent
        ></v-text-field>
        <v-text-field
          v-model="new_password"
          name="confirmPassword"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock"
          outlined
          single-line
          placeholder="Konfirmasi password baru"
          @click:append="show2 = !show2"
          :rules="confirmPassword"
          @keyup.enter.prevent
          @keydown.enter.prevent
        ></v-text-field>
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
        <v-btn
          @click="changePassword"
          width="100%"
          elevation="0"
          color="#169CD6"
          class="white--text pa-6"
          :disabled="blockSubmit"
        >
          Submit
        </v-btn>
      </v-form>
      <v-row class="mt-5" style="margin-bottom: 95px">
        <v-col xl="4" lg="4" md="4" sm="4" xs="4">
          <img
            class="float-right"
            width="90%"
            src="../../../../assets/image/image7.png"
            alt="image7"
          />
        </v-col>
        <v-col class="text-center" xl="4" lg="4" md="4" sm="4" xs="4">
          <img src="../../../../assets/image/moda.png" alt="moda" />
        </v-col>
        <v-col xl="4" lg="4" md="4" sm="4" xs="4">
          <img
            width="95%"
            src="../../../../assets/image/image9.png"
            alt="image8"
          />
        </v-col>
      </v-row>
      <v-dialog class="d-flex d-sm-none" v-model="dialogMobile" width="100%">
        <v-card
          class="notif pa-5 d-flex flex-column text-center justify-center align-center"
        >
          <img
            class="logo mt-5"
            src="../../../../assets/image/change-password.svg"
            alt=""
          />
          <div class="pa-5">
            <div>Your password has been successfuly changed</div>
            <div class="mt-2">Please login on your apps</div>
          </div>
          <v-btn
            @click="dialogMobile = false"
            width="50%"
            elevation="0"
            color="#169CD6"
            class="white--text pa-6 mb-5"
            >OK</v-btn
          >
        </v-card>
      </v-dialog>
    </v-card>
    <div class="pmt-login d-none d-lg-flex d-xl-flex">
      <!-- web view -->
      <v-card
        class="crd-login pa-5"
        elevation="2"
        style="border-radius: 25px !important"
      >
        <div class="kominfo-logo d-flex justify-center align-center mt-15 mb-5">
          <img src="../../../../assets/image/kominfo.png" alt="kominfo" />
        </div>
        <div class="text-center">
          <div
            class="font-weight-bold mb-2"
            style="color: #4f4f4f; font-size: 20px"
          >
            Dashboard
          </div>
          <div
            class="font-weight-bold mb-5"
            style="color: #4f4f4f; font-size: 20px"
          >
            Pusat Monitoring Telekomunikasi
          </div>
          <div class="font-weight-bold mb-5" style="color: #4f4f4f">
            Change Password
          </div>
          <div class="grey--text">Masukan password baru dan konfirmasi</div>
          <div class="grey--text">untuk melanjutkan</div>
        </div>
        <form @submit.prevent>
          <v-row class="mt-8 pl-10 pr-10">
            <v-col xl="12" lg="12" md="12" sm="12" xs="12">
              <v-text-field
                v-model="password"
                name="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                outlined
                single-line
                placeholder="Password baru"
                @click:append="show1 = !show1"
                :rules="passwordRules"
                @keyup.enter.prevent
                @keydown.enter.prevent
              ></v-text-field>
            </v-col>
            <v-col xl="12" lg="12" md="12" sm="12" xs="12">
              <v-text-field
                v-model="new_password"
                name="confirmPassword"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                outlined
                single-line
                placeholder="Konfirmasi password baru"
                @click:append="show2 = !show2"
                :rules="confirmPassword"
                @keyup.enter.prevent
                @keydown.enter.prevent
              ></v-text-field>
            </v-col>
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
            <v-col xl="12" lg="12" md="12" sm="12" xs="12">
              <v-btn
                @click="changePassword"
                width="100%"
                elevation="0"
                color="#169CD6"
                class="white--text pa-6"
                :disabled="blockSubmit"
              >
                Submit
              </v-btn>
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
        </form>
        <v-dialog v-model="dialog" width="30%">
          <v-card
            class="notif pa-5 d-flex flex-column text-center justify-center align-center"
          >
            <img
              class="logo mt-5"
              src="../../../../assets/image/change-password.svg"
              alt=""
            />
            <div class="pa-5">Your password has been successfuly changed</div>
            <v-btn
              @click="submitResetPassword"
              width="50%"
              elevation="0"
              color="#169CD6"
              class="white--text pa-6 mb-5"
              >OK</v-btn
            >
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
</template>

<script src="./ChangePassword.js"></script>

<style lang="scss" scoped>
.pmt-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 70px;
}
</style>
