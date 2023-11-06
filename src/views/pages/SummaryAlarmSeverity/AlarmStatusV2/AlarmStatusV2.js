import NavbarBigScreen from "../../../../layouts/NavbarFull/NavbarBigScreen.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";
export default {
  components: {
    NavbarBigScreen,
    NavigationCellAndFo,
  },
  data() {
    return {
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
    };
  },
  computed: {
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    headers() {
      return this.$store.getters.headerTableSeverity("noAction");
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
    directToMap() {
      return this.$store.getters.settingByName.value;
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

      const name = {
        name: "route_map",
      };
      this.$store.dispatch("getSettingsByName", name);

      // fetch data : Opsel
      this.$store.dispatch("getOpselFo");

      // fetch data : summary card
      this.$store.dispatch("getSummaryAlarmSeverity");
      this.$store.dispatch("getTotalAlarmSeverity");

      //fetch first time table
      this.initalizeAlamrSeverity(this.defaultAlarmSeverityPayload);
    },
    initalizeAlamrSeverity(payload) {
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
      this.initalizeAlamrSeverity(payload);
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
      this.initalizeAlamrSeverity(payload);
    },
    resetData() {
      this.pagination.page = 1;
      this.pagination.rowsPerPage = 10;
      this.$store.commit("loadingTable", true);
      this.initalizeAlamrSeverity(this.defaultTicketSummaryPayload);
    },
  },
  mounted() {
    this.initialize();
  },
};
