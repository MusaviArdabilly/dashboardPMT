// import Vue from "vue";
// import { VueReCaptcha } from "vue-recaptcha-v3";
import { VueRecaptcha } from "vue-recaptcha";
import { AUTH_SIGNIN, SET_AUTH } from "../../../../store/modules/auth.module";
import UK from "../../../../assets/icon/flag/uk.png";
import ID from "../../../../assets/icon/flag/id.png";

// Vue.use(VueReCaptcha, {
//   siteKey: process.env.VUE_APP_RECAPTCHA_V2,
//   loaderOptions: {
//     useRecaptchaNet: true,
//     autoHideBadge: true,
//   },
// });

export default {
  components: {
    VueRecaptcha,
  },
  data: () => ({
    valid: false,
    blockSubmit: true,
    loading_overlay: false,
    username: null,
    usernameRules: [(v) => !!v || "Username is required"],
    show1: false,
    password: null,
    pwdRules: [(v) => !!v || "Password is required"],
    selectedLanguage: "id",
    language: [
      {
        image: ID,
        value: "id",
      },
      {
        image: UK,
        value: "en",
      },
    ],
  }),
  computed: {
    enviroments() {
      // const key = "6LdDN1siAAAAAFlS5BiYsnY7r77h9rPTzXGT-eO_";
      // return key;
      return process.env.VUE_APP_RECAPTCHA_V2;
    },
  },
  methods: {
    // validate() {
    //   return this.$refs.form.validate();
    // },
    verify(response) {
      // console.log(response);
      if (response) {
        this.valid = true;
        this.blockSubmit = false;
      } else {
        this.valid = false;
        this.blockSubmit = true;
      }
    },
    error() {
      console.log("There something wrong with the recaptcha");
    },
    onCaptchaExpired() {
      console.log("Captcha expired");
      this.blockSubmit = true;
      this.$refs.recaptcha.reset();
    },

    // async recaptcha() {
    //   await this.$recaptchaLoaded();

    //   const token = await this.$recaptcha("login");
    //   const data = {
    //     response: token,
    //   };

    //   console.log(token);
    //   this.$router.push({ name: "LandingPage" });
    //   fetch(process.env.VUE_APP_API_URL + `api/v1/id/recaptcha/verify`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   })
    //     .then((response) => response.json())
    //     .then((result) => {
    //       if (result.error) {
    //         this.$swal("Opps", result.message, "error");
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },

    async signIn() {
      // if (!this.validate()) return;

      this.loading_overlay = true;

      const data = {
        username: this.username,
        password: this.password,
      };
      if (this.valid != false) {
        this.$store
          .dispatch(AUTH_SIGNIN, data)
          .then((result) => {
            this.loading_overlay = false;
            if (result.data.role == "network-operator") {
              this.$swal({
                title: "Gagal",
                text: "Maaf anda tidak memiliki akses",
                timer: 1000,
                showConfirmButton: false,
                icon: "error",
              });
              return;
            }
            this.$store.commit(SET_AUTH, result.data);

            this.$swal({
              title: "Berhasil",
              text: "Berhasil login ke dalam sistem.",
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            }).then(() => this.$router.push({ name: "LandingPage" }));
          })
          .catch((error) => {
            this.loading_overlay = false;
            this.$swal("Opps", error, "error");
          });
      }
    },

    toRegister() {
      this.$router.push({ name: "Register" });
    },

    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage;
    },
  },
  created() {},
  mounted() {
    // console.log(this.$vuetify.breakpoint.width);
    // setTimeout(() => {
    // Hide reCAPTCHA badge:
    // this.$recaptchaInstance.showBadge();
    // }, 3000);
  },
};
