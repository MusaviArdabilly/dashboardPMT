import NavbarBigScreen from "../../../../layouts/NavbarFull/NavbarBigScreen.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";
import moment from "moment";
export default {
  components: { NavbarBigScreen, NavigationCellAndFo },
  data() {
    return {
      filter: {
        picker: {
          datepicker1: false,
          datepicker2: false,
        },
        date: {
          startDate: new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .substr(0, 10),
          endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          default: true,
          defaultText: "All Time",
        },
        orderAverage: {
          value: "highest",
        },
        orderOperator: {
          value: 0,
          searchOperator: "",
        },
      },
      items: {
        orderAverage: [
          { name: "Sort by Highest", value: "highest" },
          { name: "Sort by Lowest", value: "lowest" },
        ],
      },
      input: {
        isDisabled: true,
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 1,
        rowsPerPageItems: [10, 50, 100, 250, 500],
      },
    };
  },
  watch: {
    loadingTable(value) {
      if (!value) {
        this.input.isDisabled = false;
      } else {
        this.input.isDisabled = true;
      }
    },
  },
  computed: {
    filterComputed: {
      //convert html standard datetime value into local time
      get() {
        return {
          preview: {
            startDate: moment(this.filter.date.startDate)
              .locale("id-ID")
              .format("DD-MM-YYYY"),
            endDate: moment(this.filter.date.endDate)
              .locale("id-ID")
              .format("DD-MM-YYYY"),
          },
        };
      },
    },
    ticketCards() {
      return this.$store.getters.ticketSummaryCard;
    },
    itemTicketing() {
      return this.$store.getters.ticketSummaryTable;
    },
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    itemTable() {
      return this.$store.getters.ticketSummaryTable.data;
    },
    headers() {
      return this.$store.getters.headerTableTicketSummary;
    },
    paginationType() {
      const paginationType = {
        page: this.pagination.page,
        rowsPerPage: this.pagination.rowsPerPage,
        totalItems:
          this.$store.getters.ticketSummaryTable.pagination.total_page,
      };
      this.pagination.totalItems =
        this.$store.getters.ticketSummaryTable.pagination.total_page;

      return paginationType;
    },
    defaultTicketSummaryPayload() {
      return this.$store.getters.defaultTicketSummaryPayload;
    },
    colorList() {
      return this.$store.getters.colorList;
    },
    loadingTable() {
      return this.$store.getters.loadingTable;
    },
    loadingData() {
      return this.$store.getters.loadingData;
    },
  },
  methods: {
    initialize() {
      this.$store.commit("loadingData", true);
      this.$store.commit("loadingTable", true);

      // fetch data : Opsel
      this.$store.dispatch("getOpselFo");

      //fetch data cards:
      this.$store.dispatch("getSummaryTicket");

      //fetch data table for ticket
      this.initalizeTicketTable(this.defaultTicketSummaryPayload);
    },
    initalizeTicketTable(payload) {
      this.$store.dispatch("getSummaryTicketTable", payload);
    },
    setTable() {
      const payload = {
        start_date: "",
        end_date: "",
        cell_operator_type: 2,
        cell_operator_id: this.filter.orderOperator.value,
        sort: this.filter.orderAverage.value,
        limit: this.paginationType.rowsPerPage,
        page: this.paginationType.page,
      };
      this.$store.commit("loadingTable", true);
      this.initalizeTicketTable(payload);
    },
    resetData() {
      this.filter.date.default = true;
      this.pagination.page = 1;
      this.pagination.rowsPerPage = 10;
      this.$store.commit("loadingTable", true);
      this.initalizeTicketTable(this.defaultTicketSummaryPayload);
    },
    setTableLimit() {
      const payload = {
        start_date: "",
        end_date: "",
        cell_operator_type: 2,
        cell_operator_id: this.filter.orderOperator.value,
        sort: this.filter.orderAverage.value,
        limit: this.paginationType.rowsPerPage,
        page: 1,
      };
      this.pagination.page = 1;
      this.pagination.totalItems = 1;
      this.$store.commit("loadingTable", true);
      this.initalizeTicketTable(payload);
    },
    changeTicketClick() {
      if (this.filter.date.default == true) {
        this.$swal({
          title: this.$t("ui.message.date_range"),
          icon: "info",
          confirmButtonColor: "#134889",
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        const payload = {
          start_date: this.filter.date.startDate,
          end_date: this.filter.date.endDate,
          cell_operator_type: 2,
          cell_operator_id: this.filter.orderOperator.value,
          sort: this.filter.orderAverage.value,
          limit: this.paginationType.rowsPerPage,
          page: 1,
        };
        this.pagination.page = 1;
        this.pagination.totalItems = 1;
        this.$store.commit("loadingTable", true);
        this.initalizeTicketTable(payload);
      }
    },
    filterDate() {
      this.filter.date.default = false;
    },
  },
  created() {
    this.initialize();
  },
};
