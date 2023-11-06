import moment from "moment";
import TableSummary from "../../../../components/TicketingManagement/TableFo/TableSummary.vue";
import TableTicket from "../../../../components/TicketingManagement/TableFo/TableTicket.vue";
import ticketingSummaryDialog from "../../../../components/TicketingManagement/dialog/TicketingSummaryDialog.vue";
import {
  GET_SUMMARY_TICKET,
  GET_SUMMARY_TICKET_TABLE,
} from "../../../../store/modules/ticket.module";
import { GET_OPSEL_FO } from "../../../../store/modules/opsel.module";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

export default {
  components: {
    TableSummary,
    TableTicket,
    NavigationCellAndFo,
    ticketingSummaryDialog,
  },
  data() {
    return {
      date_picker_1: false,
      date_picker_2: false,
      date: {
        startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        default: true,
        defaultTable: true,
        defaultText: "All Time",
      },
      dateCurrent: "",
      dateThreeMonths: "",
      selectOrder: "highest",
      selectOperator: 0,
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
      dialog: {
        ticketDialog: false,
      },
    };
  },
  computed: {
    dateFilter: {
      //convert html standard datetime value into local time
      get() {
        return {
          startDate: moment(this.date.startDate)
            .locale("id-ID")
            .format("DD-MM-YYYY"),
          endDate: moment(this.date.endDate)
            .locale("id-ID")
            .format("DD-MM-YYYY"),
          threemonthago: moment().subtract(2, "month").format("YYYY-MM-DD"),
        };
      },
    },
    ticketCards() {
      return this.$store.getters.ticketSummaryCard;
    },
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    itemTable() {
      return this.$store.getters.ticketSummaryTable.data;
    },
    loadingTable() {
      return this.$store.getters.loadingTable;
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
  },
  created() {
    this.getCurrentDate();
  },
  methods: {
    initialize() {
      this.$store.commit("loadingTable", true);
      this.getSummaryTableData();
      this.$store.dispatch(GET_SUMMARY_TICKET);
      this.$store.dispatch(GET_OPSEL_FO);
    },
    getSummaryTableData() {
      const data = {
        start_date: this.date.startDate,
        end_date: this.date.endDate,
        cell_operator_type: 2,
        cell_operator_id: this.selectOperator,
        sort: this.selectOrder,
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
      };
      this.$store.commit("loadingTable", true);
      this.$store.dispatch(GET_SUMMARY_TICKET_TABLE, data);
    },
    getCurrentDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      this.date.endDate = yyyy + "-" + mm + "-" + dd;
      this.dateCurrent = yyyy + "-" + mm + "-" + dd;
    },
    getThreeMontsAgoDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + -2);
      const yyyy = today.getFullYear();
      this.date.startDate = yyyy + "-" + mm + "-" + dd;
      this.dateThreeMonths = yyyy + "-" + mm + "-" + dd;
    },
    setTable() {
      const payload = {
        start_date: this.date.startDate,
        end_date: this.date.endDate,
        cell_operator_type: 2,
        cell_operator_id: this.selectOperator,
        sort: this.selectOrder,
        limit: this.paginationType.rowsPerPage,
        page: this.paginationType.page,
      };
      this.$store.commit("loadingTable", true);
      this.$store.dispatch(GET_SUMMARY_TICKET_TABLE, payload);
    },
    resetFilter() {
      this.selectOperator = 0;
      this.selectOrder = "highest";
      this.pagination.page = 1;
      this.pagination.rowsPerPage = 10;
      const data = {
        start_date: this.dateCurrent,
        end_date: this.dateThreeMonths,
        cell_operator_type: 2,
        cell_operator_id: this.selectOperator,
        sort: this.selectOrder,
        limit: this.pagination.rowsPerPage,
        page: this.pagination.page,
      };
      this.$store.commit("loadingTable", true);
      this.$store.dispatch(GET_SUMMARY_TICKET_TABLE, data);
    },
    setTableLimit() {
      const payload = {
        start_date: this.date.startDate,
        end_date: this.date.endDate,
        cell_operator_type: 2,
        cell_operator_id: this.selectOperator,
        sort: this.selectOrder,
        limit: this.paginationType.rowsPerPage,
        page: 1,
      };
      this.$store.commit("loadingTable", true);
      this.$store.dispatch(GET_SUMMARY_TICKET_TABLE, payload);
    },
    ticketSummaryDialog() {
      // console.log("clicked", this.dialog.ticketDialog);
      this.dialog.ticketDialog = true;
    },
    inputDate(val) {
      if (val == "table") {
        this.date.defaultTable = false;
      } else {
        this.date.default = false;
      }
    },
  },
  mounted() {
    // on mounted set date to 3 months before

    this.date.startDate = this.dateFilter.threemonthago;
    this.dateThreeMonths = this.dateFilter.threemonthago;
    this.initialize();
  },
};
