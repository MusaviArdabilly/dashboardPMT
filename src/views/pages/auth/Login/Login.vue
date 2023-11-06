<template>
  <div class="pmt-login">
    <v-card
      :class="[
        `crd-login  mt-5 ${
          $vuetify.breakpoint.mdAndDown
            ? 'ml-10 mr-10 mb-10 px-5 py-5'
            : 'px-10 py-5'
        }`,
      ]"
      elevation="2"
      style="border-radius: 25px !important"
      width="550"
    >
      <v-row justify="end">
        <v-col xs="2" sm="2" md="2" lg="3">
          <v-select
            v-model="selectedLanguage"
            :items="language"
            dense
            solo
            rounded
            item-value="value"
            @change="changeLanguage"
          >
            <template v-slot:item="{ item }">
              <img class="select-flag" :src="item.image" :alt="item.value" />
            </template>
            <template v-slot:selection="{ item }">
              <img class="select-flag" :src="item.image" :alt="item.value" />
            </template>
          </v-select>
        </v-col>
      </v-row>

      <div
        :class="[
          `kominfo-logo d-flex justify-center align-center ${
            $vuetify.breakpoint.mdAndDown ? 'mt-2 mb-5' : 'mt-15 mb-5'
          }`,
        ]"
      >
        <img src="../../../../assets/image/kominfo.png" alt="kominfo" />
      </div>
      <div
        class="text-center"
        :style="[`${$vuetify.breakpoint.mdAndDown ? 'font-size: 10px' : ''}`]"
      >
        <div>Direktorat Jendral</div>
        <div class="mb-2">Penyelenggaraan Pos dan Informatika</div>
        <div
          :class="[
            `font-weight-bold ${
              $vuetify.breakpoint.mdAndDown ? 'mb-2' : 'mb-5'
            }`,
          ]"
        >
          Dashboard Pusat Monitoring Telekomunikasi
        </div>
      </div>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
        <v-row
          :class="[` ${$vuetify.breakpoint.mdAndDown ? 'mt-5' : 'mt-10'}`]"
        >
          <v-col xl="12" lg="12" md="12" sm="12" xs="12">
            <v-text-field
              v-model="username"
              outlined
              hide-details
              single-line
              prepend-inner-icon="mdi-account"
              required
              :placeholder="$t('login.form.username')"
              :rules="usernameRules"
              autocomplete="username"
              @keyup.enter.prevent
              @keydown.enter.prevent
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col xl="12" lg="12" md="12" sm="12" xs="12">
            <v-text-field
              v-model="password"
              prepend-inner-icon="mdi-lock"
              outlined
              single-line
              hide-details
              required
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              :placeholder="$t('login.form.password')"
              @click:append="show1 = !show1"
              @keyup.enter.prevent
              @keydown.enter.prevent
              :rules="pwdRules"
              autocomplete="new-password"
            ></v-text-field>
            <small class="grey--text">
              {{ $t("login.form.recaptcha_1") }}
              <a href="https://policies.google.com/privacy">
                {{ $t("login.form.recaptcha_2") }}
              </a>
              {{ $t("login.form.recaptcha_3") }}

              <a href="https://policies.google.com/terms">
                {{ $t("login.form.recaptcha_4") }}
              </a>
              {{ $t("login.form.recaptcha_5") }}
            </small>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12">
            <vue-recaptcha
              class="pmt-flex wrap at-start"
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
          <v-col xl="12" lg="12" md="12" sm="12" xs="12">
            <v-btn
              @click="signIn"
              width="100%"
              elevation="0"
              color="#169CD6"
              class="white--text pa-6"
              :disabled="blockSubmit"
            >
              {{ $t("login.form.button_login") }}
            </v-btn>

            <div class="text-center mt-10">
              <a class="grey--text" href="/auth/forgot-password">
                {{ $t("login.forgot_password") }}
              </a>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col xl="4" lg="4" md="4" sm="4" xs="4">
            <img
              class="float-right"
              width="60%"
              src="../../../../assets/image/image7.png"
              alt="image7"
            />
          </v-col>
          <v-col class="text-center" xl="4" lg="4" md="4" sm="4" xs="4">
            <img
              width="60%"
              src="../../../../assets/image/moda.png"
              alt="moda"
            />
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
      <v-overlay :z-index="999" :value="loading_overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </div>
</template>

<script src="./Login.js"></script>

<style lang="scss" scoped>
.pmt-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.crd-login {
  margin-bottom: 50px;
}
.select-flag {
  width: 2em;
  height: 2em;
}
</style>
