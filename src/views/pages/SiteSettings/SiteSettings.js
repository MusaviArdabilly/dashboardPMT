// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../services/jwt.services";

export default {
  components: {},
  data: () => ({
    alert: false,
    user: null,
    user_token: null,
    dialog: false,
    dialogDelete: false,
    rowsPerPage: 20,
    headers: [
      { text: "Name", value: "name", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Value", value: "value", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    data: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      Author: 0,
      carbs: 0,
      Action: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      Author: 0,
      carbs: 0,
      Action: 0,
    },
    form_update: {},
    dialog_update: false,
    rules: [(value) => !!value || "Required"],
  }),
  methods: {
    initialize() {
      this.getApplication();
    },

    getApplication() {
      this.loading = true;
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/setting`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result.data.data);
          if (result.error == false) {
            this.data = result.data.data;

            this.rowsPerPage = this.data.length
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    editItem(item) {
      //   console.log(item);
      this.form_update = {
        id: item.id,
        name: item.name,
        description: item.description,
        value: item.value,
      };
      this.dialog_update = true;
    },

    updateUser() {
      let data = new FormData();

      for (let key in this.form_update) {
        if (Object.hasOwnProperty.call(this.form_update, key)) {
          data.append(key, this.form_update[key]);
        }
      }

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/setting/update`,
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
            this.$swal("Opps", result.message, "error");
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
  },
  created() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};
