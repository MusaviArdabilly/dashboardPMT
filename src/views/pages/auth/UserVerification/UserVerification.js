export default {
  name: "UserVerification",
  data() {
    return {
      is_success: null,
      token: null,
      loading_overlay: true,
    };
  },

  mounted() {
    this.token = this.$route.query.token;
    // verification
    this.AccountVerification();
  },

  methods: {
    AccountVerification() {
      const data = {
        token: this.token,
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/account/verification`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            this.is_success = false;
            this.loading_overlay = false;
          } else {
            this.is_success = true;
            this.loading_overlay = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};