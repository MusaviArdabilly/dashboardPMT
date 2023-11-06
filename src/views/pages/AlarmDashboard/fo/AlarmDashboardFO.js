import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";
import AlarmOperatorDialog from "../../../../components/alarm/AlarmOperatorDialog.vue";

export default {
  components: { NavigationCellAndFo, AlarmOperatorDialog },
  data() {
    return {
      dialog: {
        alarmDialog: false,
        dataOperator: null,
      },
      filter: {
        severity: {
          value: -1,
        },
        alarms: {
          value: "most",
        },
        operator: {
          value: 0,
          search: "",
        },
      },
      items: {
        severity: [
          { name: "All Severity Level", value: -1 },
          { name: "Not Yet Identified", value: 0 },
          { name: "Critical Only", value: 1 },
          { name: "Major Only", value: 2 },
          { name: "Medium Only", value: 3 },
          { name: "Minor Only", value: 4 },
        ],
        alarms: [
          { name: "Having the most alarms", value: "most" },
          { name: "Having the least alarms", value: "least" },
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
      whileDownload: false,
    };
  },
  computed: {
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    headers() {
      return this.$store.getters.headerTableSeverity("withAction");
    },
    printOutHeader() {
      const excelHeader = {
        NO: "number",
        "OPERATOR NAME": "name",
        "TOTAL ALARM": "total_alarm",
        OPEN: "open",
        CLOSE: "cleared",
      };
      return excelHeader;
    },
    itemTable() {
      return this.$store.getters.alarmSeverityTable.data;
    },
    alarmCard() {
      return this.$store.getters.alarmSeveritySummaryCard;
    },
    totalAlarm() {
      return this.$store.getters.alarmSeverityTotal;
    },
    paginationType() {
      const paginationType = {
        page: this.pagination.page,
        rowsPerPage: this.pagination.rowsPerPage,
        totalItems:
          this.$store.getters.alarmSeverityTable.pagination.total_page,
      };
      this.pagination.totalItems =
        this.$store.getters.alarmSeverityTable.pagination.total_page;

      return paginationType;
    },
    defaultAlarmSeverityPayload() {
      return this.$store.getters.defaultAlarmSeverityPayload;
    },
    loadingTable() {
      return this.$store.getters.loadingTable;
    },
    loadingData() {
      return this.$store.getters.loadingData;
    },
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
  methods: {
    initialize() {
      this.$store.commit("loadingData", true);
      this.$store.commit("loadingTable", true);
      // fetch data : Opsel
      this.$store.dispatch("getOpselFo");

      // fetch data : summary card
      this.$store.dispatch("getSummaryAlarmSeverity");
      this.$store.dispatch("getTotalAlarmSeverity");

      //fetch first time table
      this.initializeAlarmSeverity(this.defaultAlarmSeverityPayload);
    },
    initializeAlarmSeverity(payload) {
      this.$store.dispatch("getTableAlarmSeverity", payload);
    },
    setTable() {
      const payload = {
        network_operator: this.filter.operator.value,
        sort: this.filter.alarms.value,
        severity: this.filter.severity.value,
        limit: this.paginationType.rowsPerPage,
        page: this.paginationType.page,
      };
      this.$store.commit("loadingTable", true);
      this.initializeAlarmSeverity(payload);
    },
    setTableLimit() {
      const payload = {
        network_operator: this.filter.operator.value,
        sort: this.filter.alarms.value,
        severity: this.filter.severity.value,
        limit: this.paginationType.rowsPerPage,
        page: 1,
      };
      this.pagination.page = 1;
      this.pagination.totalItems = 1;
      this.$store.commit("loadingTable", true);
      this.initializeAlarmSeverity(payload);
    },
    resetData() {
      this.pagination.page = 1;
      this.pagination.rowsPerPage = 10;
      this.$store.commit("loadingTable", true);
      this.initializeAlarmSeverity(this.defaultTicketSummaryPayload);
    },
    alarmListDialog(value) {
      this.dialog.dataOperator = value;
      this.dialog.alarmDialog = true;
    },
    async alarmDownload() {
      let data = [];
      const payload = {
        network_operator: this.filter.operator.value,
        sort: this.filter.alarms.value,
        severity: this.filter.severity.value,
        limit: -1,
        page: 1,
      };
      this.$store.commit("loadingTable", true);
      await this.$store
        .dispatch("getTableAlarmSeverity", payload)
        .then((result) => {
          data = result.data.data;
          this.$store.commit("loadingTable", false);
        });
      return data;
    },
    startDownload() {
      this.whileDownload = true;
    },
    finishDownload() {
      this.whileDownload = false;
    },
  },
  mounted() {
    this.initialize();
  },
};
