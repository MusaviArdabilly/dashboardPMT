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
  data() {
    return {
      valid: false,
      blockSubmit: true,
      user: null,
      username: null,
      show1: false,
      show2: false,
      password: "",
      new_password: "",
      dialog: false,
      dialogMobile: false,
      vw: 0,
      passwordRules: [(value) => !!value || "Please type password"],
      confirmPassword: [
        (value) => !!value || "Type confirm password",
        (value) =>
          value === this.password || "The password confirmation does not match",
      ],
    };
  },
  computed: {
    enviroments() {
      // const key = "6LdDN1siAAAAAFlS5BiYsnY7r77h9rPTzXGT-eO_";
      // return key;
      return process.env.VUE_APP_RECAPTCHA_V2;
    },
  },
  created() {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    this.user = JSON.parse(localStorage.getItem("user"));

    this.vw = vw;
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    console.log(this.$route.query, vw, vh);
  },

  methods: {
    // async recaptcha() {
    //   await this.$recaptchaLoaded();

    //   const token = await this.$recaptcha("login");

    //   console.log(token);
    //   this.$router.push({ name: "LandingPage" });
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

    changePassword() {
      const token = this.$route.query.token;

      const data = {
        token: token,
        new_password: this.password,
      };
      if (this.valid !== false) {
        fetch(
          process.env.VUE_APP_API_URL +
            `api/v1/${this.user.language}/account/reset-password`,
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
            console.log(result.data);
            if (this.vw < 600) {
              if (result.error == true) {
                this.$swal("Opps", result.message, "error");
              } else {
                this.dialogMobile = true;
              }
            } else {
              if (result.error == true) {
                this.$swal("Opps", result.message, "error");
              } else {
                this.dialog = true;
                this.$router.push({ name: "LandingPage" });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    submitResetPassword() {
      this.dialog = false;
      this.$router.push({ name: "Login" });
    },
  },
};
