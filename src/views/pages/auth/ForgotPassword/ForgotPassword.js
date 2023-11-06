// import Vue from "vue";
import { VueRecaptcha } from "vue-recaptcha";
// import { VueReCaptcha } from "vue-recaptcha-v3";

// Vue.use(VueReCaptcha, {
//   siteKey: process.env.VUE_APP_RECAPTCHA,
//   loaderOptions: {
//     useRecaptchaNet: true,
//   },
// });

export default {
  components: {
    VueRecaptcha,
  },
  data: () => ({
    loading_overlay: false,
    valid: false,
    blockSubmit: true,
    email: null,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    username: null,
    usernameRules: [(v) => !!v || "Username is required"],
    show1: false,
    password: null,
    dialog: false,
    countDown: 30,
    showCountDown: false,
    isDisabled: false,
    message: "",
    message_hint:
      "Recovery link for your account has been sent. Please check your email.",
  }),
  computed: {
    enviroments() {
      // const key = "6LdDN1siAAAAAFlS5BiYsnY7r77h9rPTzXGT-eO_";
      // return key;
      return process.env.VUE_APP_RECAPTCHA_V2;
    },
  },
  methods: {
    // async recaptcha() {
    //   await this.$recaptchaLoaded();

    //   const token = await this.$recaptcha("login");

    //   const data = {
    //     response: token,
    //   };

    //   console.log(process.env.VUE_APP_API_URL);
    //   // this.$router.push({ name: "Home" });
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
      this.$refs.recaptcha.reset();
    },

    sendEmail() {
      // if (!this.validate()) return;
      this.loading_overlay = true;

      const data = {
        username: this.username,
        email: this.email,
      };
      if (this.valid !== false) {
        fetch(
          process.env.VUE_APP_API_URL + `api/v2/id/account/forget-password`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            this.message = result.message;
            this.message_status = result.error;
            this.dialog = true;
            this.loading_overlay = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    toLogin() {
      this.$router.push({ name: "Login" });
    },

    submitResetPassword() {
      this.dialog = false;
      this.isDisabled = true;
      this.countDownTimer();
    },

    countDownTimer() {
      if (this.countDown == 0) {
        this.isDisabled = false;
        this.valid = true;
        this.countDown = 30;
      }
      this.showCountDown = true;
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },

    validate() {
      return this.$refs.form.validate();
    },
  },
};
