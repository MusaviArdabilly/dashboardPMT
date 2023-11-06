import JwtService from "../../../services/jwt.services";

export default {
  components: {},
  data: () => ({
    loading_overlay: false,
    search: "",
    loading: false,
    dialog: false,
    dialog_update: false,
    is_viewer: false,
    form_update: {},
    pmt_url: process.env.VUE_APP_API_URL,
    dialogDelete: false,
    valid: true,
    rules: [(value) => !!value || "Required"],
    show: false,
    headers: [
      {
        align: "start",
        sortable: false,
        value: "image",
      },
      {
        text: "User",
        sortable: false,
        value: "name",
      },
      { text: "Email", value: "email", sortable: false },
      { text: "Role", value: "role", sortable: false },
      { text: "Institution", value: "department", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],

    data: [],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    user_token: null,

    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    department: [],
    position: [],
    role: [],
    network_operator: [],
    role_filter: [],
    selected_department: "",
    selected_position: "",
    selected_role: "semua",
    selected_network_operator: 0,
    selected_status: "",
    selected_is_verified: "",
    sort: "desc",
    list_status: [
      {
        name: "Semua",
      },
      {
        name: "Aktif",
        value: "true",
      },
      {
        name: "Non-Aktif",
        value: "false",
      },
    ],
    list_is_verified: [
      {
        name: "Semua",
      },
      {
        name: "Terverifikasi",
        value: "true",
      },
      {
        name: "Belum Terverifikasi",
        value: "false",
      },
    ],
    alert: false,
    user: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    initialize() {
      if (this.search != "" && this.search.length < 3) {
        return;
      }

      // clear selected_role
      if (this.selected_role == "semua") {
        this.selected_role = "";
      }

      // clear selected_status
      if (this.selected_status == "Semua") {
        this.selected_status = "";
      }

      // clear selected_is_verified
      if (this.selected_is_verified == "Semua") {
        this.selected_is_verified = "";
      }
      this.loading = true;
      const payload = {
        search: this.search,
        role: this.selected_role,
        status: this.selected_status,
        is_verified: this.selected_is_verified,
        sort: this.sort,
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
      };
      this.fetchData(payload);
    },

    fetchData(payload) {
      const url = new URL(
        process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/account`
      );
      for (let key in payload) {
        url.searchParams.append(key, payload[key]);
      }
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          this.data = [];
          this.loading = false;
          if (result.error) {
            return;
          } else {
            this.data = result.data.data;
            // this.pagination.page = result.data.pagination.current_page;
            this.pagination.totalItems = result.data.pagination.total_page;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tableChange() {
      // clear selected_role
      if (this.selected_role == "semua") {
        this.selected_role = "";
      }

      // clear selected_status
      if (this.selected_status == "Semua") {
        this.selected_status = "";
      }

      // clear selected_is_verified
      if (this.selected_is_verified == "Semua") {
        this.selected_is_verified = "";
      }
      this.loading = true;
      const payload = {
        search: this.search,
        role: this.selected_role,
        status: this.selected_status,
        is_verified: this.selected_is_verified,
        sort: this.sort,
        limit: this.pagination.rowsPerPage,
        page: 1,
      };
      this.pagination.page = 1;
      this.fetchData(payload);
    },
    resetData() {
      const payload = {
        search: "",
        role: "",
        status: "",
        is_verified: "",
        sort: "desc",
        limit: 10,
        page: 1,
      };
      this.search = "";
      this.selected_role = "";
      this.selected_status = "";
      this.selected_is_verified = "";
      this.pagination.rowsPerPage = 10;
      this.pagination.page = 1;
      this.fetchData(payload);
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.push({ name: "Login" });
    },

    searchDepartment() {
      for (const department of this.department) {
        if (department.name == this.form_update.selected_department) {
          this.form_update.selected_department = department.name;
          this.position = department.position;

          for (const pos of department.position) {
            if (pos.name == this.form_update.selected_position) {
              this.form_update.selected_position = pos;
            }
          }
        }
      }
    },

    editItem(item) {
      // console.log(item, "item edit");
      this.form_update = {
        user_id: item.id,
        username: item.username,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        selected_department: item.department,
        selected_position: item.position,
        role: item.role,
        is_active: item.is_active,
        current_avatar: item.avatar,
        is_viewer: item.is_viewer,
      };
      this.searchDepartment();
      this.dialog_update = true;
    },

    updateUser() {
      let data = new FormData();

      for (let key in this.form_update) {
        if (Object.hasOwnProperty.call(this.form_update, key)) {
          data.append(key, this.form_update[key]);
        }
      }
      data.append("department", this.form_update.selected_department);
      // console.log(data, "data update");

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/account/update-profile`,
        {
          method: "POST",
          body: data,
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
          if (result.error == true) {
            this.$swal({
              text: result.message,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              timer: 3000,
              icon: "error",
            });
          } else {
            this.dialog_update = false;

            this.$swal({
              text: result.message,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              timer: 3000,
              icon: "success",
            });
            this.initialize();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    getDepartment() {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/department`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          this.department = result.data;
          // console.log(this.department);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getPosition() {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/position`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.department = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    setPosition() {
      this.position = this.selected_department.position;
    },

    resendEmailVerification(email) {
      this.loading_overlay = true;
      const data = {
        email: email,
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/account/verification/resend`,
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
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getRole() {
      fetch(process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.role = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getNetworkOperator() {
      const data = {
        limit: -1,
        page: 1,
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
        .then((response) => response.json())
        .then((result) => {
          this.network_operator = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getRoleFilter() {
      fetch(process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.role_filter = result.data;
          this.role_filter.push({ name: "semua" });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    createUser() {
      const formValidate = this.$refs.formcreate.validate();
      if (!formValidate) {
        return;
      } else {
        this.loading_overlay = true;
        const data = {
          username: this.username,
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          is_viewer: this.is_viewer,
          department: this.selected_department.path,
          role: this.selected_role,
          network_operator_id: this.selected_network_operator,
        };
        // console.log(data, "payload create user");
        fetch(
          process.env.VUE_APP_API_URL +
            `api/v1/${this.user.language}/account/add`,
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
            this.loading_overlay = false;
            // console.log(result, "result create user");
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
            this.username = "";
            this.firstname = "";
            this.lastname = "";
            this.email = "";
            this.password = "";
            this.selected_department = "";
            this.selected_role = "";

            if (result.error == false) {
              this.dialog = false;
              this.data = [];
              this.initialize();
            }
            this.$swal({
              text: result.message,
              showConfirmButton: true,
              confirmButtonColor: "#134889",
              timer: 3000,
              icon: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            this.loading_overlay = false;
          });
      }
    },
  },

  created() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();

    // this.getDepartment();
    this.getPosition();
    this.getRole();
    this.getNetworkOperator();
    this.getRoleFilter();
  },
};
