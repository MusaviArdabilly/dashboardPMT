// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../../services/jwt.services";

export default {
  components: {},
  data: () => ({
    loading: false,
    loading_overlay: false,
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    user: null,
    baseURL: process.env.VUE_APP_API_URL,
    rules: {
      required: [(value) => !!value || "Required."],
      logo: [
        (value) =>
          !value ||
          value.size < 5000000 ||
          "Ukuran logo harus dibawah dari 2 MB!",
      ],
    },
    alert: false,
    search: "",
    selected_status: "",
    dialog: false,
    headers: [
      { text: "Logo", value: "logo", sortable: false },
      { text: "Map Marker", value: "secondary_logo", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Alias", value: "alias", sortable: false },
      { text: "Category", value: "type", sortable: false },
      { text: "Status", value: "is_active", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    data: [],
    validation: true,
    form: {
      logo: "",
      secondary_logo: "",
      name: "",
      description: "",
      alias: "",
      email: "",
      is_active: false,
      type: 1,
    },
    selected_logo_url: "",
    selected_logo_marker_url: "",
    selected_id: null,
  }),
  computed: {
    searchLength: function () {
      return this.search.length;
    },
  },
  watch: {
    dialog(value) {
      if (value == false) {
        this.form.logo = "";
        this.form.secondary_logo = "";
        this.form.name = "";
        this.form.description = "";
        this.form.alias = "";
        this.form.email = "";
        this.form.is_active = false;
        this.form.type = 1;
        this.selected_logo_url = "";
        this.$refs.netform.reset();
      }
    },
  },
  methods: {
    initialize() {
      this.getOperator();
    },
    setRows() {
      this.pagination.page = 1;

      this.initialize();
    },

    getOperator() {
      if (this.searchLength < 3 && this.searchLength != 0) {
        return;
      }

      if (this.search != "") {
        this.pagination.page = 1;
      }

      this.loading = true;
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        search: this.search,
        sort: "asc",
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/cell-operator`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
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
          this.pagination.page = result.data.pagination.current_page;
          this.pagination.totalItems = result.data.pagination.total_page;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push({ name: "Login" });
    },

    createNetworkOperator() {
      this.loading_overlay = true;
      const validate = this.$refs.netform.validate();
      if (validate != false) {
        let formData = new FormData();
        for (let key in this.form) {
          if (Object.hasOwnProperty.call(this.form, key)) {
            formData.append(key, this.form[key]);
          }
        }
        fetch(
          process.env.VUE_APP_API_URL +
            `api/v1/${this.user.language}/cell-operator/create`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${this.user_token}`,
            },
          }
        )
          .then((response) => {
            if (response.status == 401) {
              this.logout();
              return;
            }
            return response.json();
          })
          .then((result) => {
            // console.log("RESULT ->", result);
            if (result.error == true) {
              this.$swal("Opps", result.message, "error");
            } else {
              this.dialog = false;
              this.$swal({
                text: result.message,
                timer: 1000,
                showConfirmButton: false,
                icon: "success",
              });
            }
            this.initialize();
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.loading_overlay = false;
    },

    editItem(item) {
      this.selected_logo_url = item.logo;
      this.selected_id = item.id;
      this.form = {
        name: item.name,
        description: item.description,
        alias: item.alias,
        email: item.email,
        is_active: item.is_active,
        type: item.type,
      };

      this.dialog = true;
    },

    updateNetworkOperator() {
      this.loading_overlay = true;
      const validate = this.$refs.netform.validate();
      if (validate != false) {
        let formData = new FormData();
        formData.append("id", this.selected_id);
        for (let key in this.form) {
          if (Object.hasOwnProperty.call(this.form, key)) {
            formData.append(key, this.form[key]);
          }
        }

        fetch(
          process.env.VUE_APP_API_URL +
            `api/v1/${this.user.language}/cell-operator/update`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${this.user_token}`,
            },
          }
        )
          .then((response) => {
            if (response.status == 401) {
              this.logout();
              return;
            }
            return response.json();
          })
          .then((result) => {
            console.log("RESULT ->", result);

            if (result.error == true) {
              this.$swal("Opps", result.message, "error");
            } else {
              this.dialog = false;
              this.$swal({
                text: result.message,
                timer: 1000,
                showConfirmButton: false,
                icon: "success",
              });
            }
            this.initialize();
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.loading_overlay = false;
    },
  },

  created() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};
