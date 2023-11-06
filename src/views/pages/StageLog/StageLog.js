// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../services/jwt.services";
import moment from "moment";

export default {
  components: {},
  data: () => ({
    dialog: false,
    dialogDelete: false,
    loading: false,
    loading_overlay: false,
    headers: [
      {
        text: "Task ID",
        align: "start",
        sortable: false,
        value: "task_unique_id",
      },
      { text: "Name", value: "name", sortable: false },
      { text: "Stage", value: "stage", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Created At", value: "created_at", sortable: false },
    ],
    start_time_picker: "00:00:00",
    end_time_picker: "23:00:00",
    datetab: "",
    data: [],
    date_1: new Date(Date.now()).toISOString().substr(0, 10),
    date_2: new Date(Date.now()).toISOString().substr(0, 10),
    date_picker_1: false,
    date_picker_2: false,
    start_date: "",
    end_date: "",
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      rowsPerPageItems: [10, 50, 100, 250, 500],
    },
    search: "",
    search_task_id: "",
    sort: "desc",
    user_token: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    startDate: function () {
      return `${moment(this.date_1).format("YYYY-MM-DD")} ${
        this.start_time_picker
      }`;
    },
    endDate: function () {
      return `${moment(this.date_2).format("YYYY-MM-DD")} ${
        this.end_time_picker
      }`;
    },
  },

  filters: {
    moment: function (date) {
      return moment(date).format("DD-MM-YYYY - hh:mm:ss");
    },
  },

  methods: {
    initialize() {
      // while character lower than 3
      if (this.search.length != 0 && this.search.length < 3) {
        return;
      }

      this.loading = true;
      this.loading_overlay = true;
      const data = {
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
        search: this.search,
        start_date: this.startDate,
        end_date: this.endDate,
        sort: this.sort,
        task_unique_id: this.search_task_id,
        stage: "",
      };
      this.fetchData(data);
    },
    fetchData(payload) {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/stage`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.loading = false;
          this.loading_overlay = false;
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
    tableChange() {
      const data = {
        limit: this.pagination.rowsPerPage,
        page: 1,
        search: this.search,
        start_date: this.startDate,
        end_date: this.endDate,
        sort: this.sort,
        task_unique_id: this.search_task_id,
        stage: "",
      };
      this.pagination.page = 1;
      this.fetchData(data);
    },

    submitFilter() {
      this.data = [];
      this.initialize();
    },
  },

  created() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();
    this.initialize();
  },
};
