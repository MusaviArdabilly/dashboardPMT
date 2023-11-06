import JwtService from "../../../services/jwt.services";
import moment from "moment";

export default {
  components: {},
  data: () => ({
    loading: false,
    loading_overlay: false,
    dialog: false,
    baseURL: process.env.VUE_APP_API_URL,
    headers: [
      { text: "Hari", value: "day", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Created At", value: "created_at", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    data: [],
    user: null,
    user_token: null,
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  filters: {
    moment: function (date) {
      return moment(date).format("DD-MM-YYYY - hh:mm:ss");
    },
  },
  methods: {
    initialize() {
      this.loading = true;
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
      };

      fetch(
        process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/backup`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          this.loading = false;
          this.data = [];
          if (result.error) {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "error",
            });
            this.data = [];
            return;
          }
          this.data = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    createBackup() {
      this.loading_overlay = true;

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/backup/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.loading_overlay = false;
          if (result.error) {
            this.$swal({
              text: result.message,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              timer: 3000,
              icon: "error",
            });
            return;
          }
          this.$swal({
            text: result.message,
            showConfirmButton: true,
            confirmButtonColor: "#134889",
            timer: 3000,
            icon: "success",
          });
          this.initialize();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    downloadFileBackup(file_path, file_name) {
      let fileUrl = `${this.baseURL}${file_path}`;
      var a = document.createElement("a");
      a.href = fileUrl;
      a.setAttribute("target", "_blank");
      a.setAttribute("download", file_name);
      a.click();
    },
  },
  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};
