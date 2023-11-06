// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../../services/jwt.services";

export default {
  components: { },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "#",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Name", value: "name", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Base URL", value: "base_url", sortable: false },
      { text: "Status", value: "is_active", sortable: false },
      { text: "Action", value: "action", sortable: false },
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
    user_token: null,
    loading: false,
  }),

  methods: {
    initialize() {
      this.getApplication();
    },

    getApplication() {
      this.loading = true;
      const data = {
        limit: 100,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
      };
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/application`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error == false) {
            this.data = result.data.data;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  created() {
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};