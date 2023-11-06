import moment from "moment";
import JwtServices from "../../services/jwt.services";
export default {
  props: {
    activator: {
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: {
        id: 0,
        name: "Operator",
        logo: "",
        logo_url: "",
      },
    },
  },
  data() {
    return {
      input: {
        isDisabled: true,
      },

      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 1,
        rowsPerPageItems: [10, 50, 100, 250, 500],
      },
      downloadPayload: ["all", "threeMonths", "lastMonth", "lastWeek"],
      json_fields: {
        "Ticket Number": "ticket_number",
        Summary: "summary",
        Status: "status",
        Severity: "severity",
        "Affected Nodes": "affected_node",
        "Affected Segment": "affected_segment",
        "Target Time": "target_to_resolved",
        "Current Process": "current_process",
        "Start Time": "start_time",
        "End Time": "end_time",
        Description: "description",
      },
      dataDownloadAll: [],
      dataDownloadThreeMonths: [],
      dataDownloadLastMonth: [],
      dataDownloadLastWeek: [],
      todayDate: "",
      threeMonthsDate: "",
      lastMonthDate: "",
      lastWeekDate: "",
    };
  },
  watch: {
    activator(value) {
      if (value) {
        const request = {
          operator_id: this.dialogData.id,
          page: 1,
          limit: 10,
        };
        this.$store.commit("setLoadingAlarmList", true);
        this.$store.dispatch("getTableAlarmDetail", request);
        const payload = {
          operator_id: this.dialogData.id,
          page: 1,
          limit: -1,
          start_date: "",
          end_date: "",
          sort: "desc",
        };
        this.downloadPayload.forEach((item) => {
          switch (item) {
            case "all":
              this.fetchAlarmDetail(payload, "all");
              break;
            case "threeMonths":
              payload.start_date = this.threeMonthsDate;
              payload.end_date = this.todayDate;
              this.fetchAlarmDetail(payload, "threeMonths");
              break;
            case "lastMonth":
              payload.start_date = this.lastMonthDate;
              payload.end_date = this.todayDate;
              this.fetchAlarmDetail(payload, "lastMonth");
              break;
            case "lastWeek":
              payload.start_date = this.lastWeekDate;
              payload.end_date = this.todayDate;
              this.fetchAlarmDetail(payload, "lastWeek");
              break;
          }
        });
      } else {
        this.pagination.page = 1;
        this.pagination.rowsPerPage = 10;
      }
    },
    loadingTable(value) {
      if (!value) {
        this.input.isDisabled = false;
      } else {
        this.input.isDisabled = true;
      }
    },
  },
  computed: {
    dialogAction: {
      get() {
        return this.activator;
      },
      set(newValue) {
        this.$emit("update:activator", newValue);
      },
    },
    headers() {
      return this.$store.getters.headerTableAlarmDetail;
    },
    itemTable() {
      return this.$store.getters.alarmDetailTable.data;
    },
    paginationType() {
      const paginationType = {
        page: this.pagination.page,
        rowsPerPage: this.pagination.rowsPerPage,
        totalItems: this.$store.getters.alarmDetailTable.pagination.total_page,
      };
      this.pagination.totalItems =
        this.$store.getters.alarmDetailTable.pagination.total_page;

      return paginationType;
    },
    loadingTable() {
      return this.$store.getters.loadingAlarmList;
    },
    directToMap() {
      return this.$store.getters.settingByName.value;
    },
  },
  methods: {
    timeFormat(value) {
      return moment.unix(value).format("DD-MM-YYYY - hh:mm");
    },
    setTable() {
      const request = {
        operator_id: this.dialogData.id,
        limit: this.paginationType.rowsPerPage,
        page: this.paginationType.page,
        sort: "desc",
      };
      this.$store.commit("setLoadingAlarmList", true);
      this.$store.dispatch("getTableAlarmDetail", request);
    },
    setTableLimit() {
      const request = {
        operator_id: this.dialogData.id,
        limit: this.paginationType.rowsPerPage,
        page: 1,
        sort: "desc",
      };
      this.pagination.page = 1;
      this.pagination.totalItems = 1;
      this.$store.commit("setLoadingAlarmList", true);
      this.$store.dispatch("getTableAlarmDetail", request);
    },
    getDownloadDate() {
      const today = new Date();

      this.todayDate = moment(today).format("YYYY-MM-DD");
      this.threeMonthsDate = moment(today)
        .subtract(3, "months")
        .format("YYYY-MM-DD");
      this.lastMonthDate = moment(today)
        .subtract(1, "months")
        .format("YYYY-MM-DD");
      this.lastWeekDate = moment(today)
        .subtract(1, "weeks")
        .format("YYYY-MM-DD");

      // console.log(this.todayDate);
      // console.log(this.threeMonthsDate);
      // console.log(this.lastMonthDate);
      // console.log(this.lastWeekDate);
    },

    fetchAlarmDetail(payload, type) {
      const url = new URL(
        process.env.VUE_APP_API_URL + `api/v1/id/fo-alarm/fo/alarm`
      );
      for (let key in payload) {
        url.searchParams.append(key, payload[key]);
      }
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error != true) {
            // console.log(result, type, "result");
            if (result.data != null) {
              const data = [];
              result.data.data.forEach((item) => {
                data.push({
                  ticket_number: item.ticket_number,
                  summary: item.summary,
                  status: item.status,
                  severity:
                    item.severity == 5
                      ? "Not Yet Identified"
                      : item.severity == 1
                      ? "Critical"
                      : item.severity == 2
                      ? "Major"
                      : item.severity == 3
                      ? "Medium"
                      : item.severity == 4
                      ? "Minor"
                      : "-",
                  affected_node: item.affected_node.map(
                    (node) => ` ${node.id} (${node.coordinate})`
                  ),
                  affected_segment: item.affected_segment.map(
                    (segment) =>
                      ` ${segment.id} (${segment.coordinate_fe}, ${segment.coordinate_ne})`
                  ),
                  target_to_resolved: item.target_to_resolved,
                  current_process: item.current_process,
                  start_time: moment
                    .unix(item.start_time)
                    .format("DD-MM-YYYY - hh:mm"),
                  end_time:
                    item.end_time == undefined
                      ? "-"
                      : moment.unix(item.end_time).format("DD-MM-YYYY - hh:mm"),
                  description: item.description,
                });
              });
              // console.log(data, "data");
              switch (type) {
                case "all":
                  this.dataDownloadAll = data;
                  break;
                case "threeMonths":
                  this.dataDownloadThreeMonths = data;
                  break;
                case "lastMonth":
                  this.dataDownloadLastMonth = data;
                  break;
                case "lastWeek":
                  this.dataDownloadLastWeek = data;
                  break;
              }
            } else {
              const data = [];

              data.push({
                ticket_number: "-",
                summary: "-",
                status: "-",
                severity: "-",
                affected_node: "-",
                affected_segment: "-",
                target_to_resolved: "-",
                current_process: "-",
                start_time: "-",
                end_time: "-",
                description: "-",
              });
              switch (type) {
                case "all":
                  this.dataDownloadAll = data;
                  break;
                case "threeMonths":
                  this.dataDownloadThreeMonths = data;
                  break;
                case "lastMonth":
                  this.dataDownloadLastMonth = data;
                  break;
                case "lastWeek":
                  this.dataDownloadLastWeek = data;
                  break;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getDownloadDate();
    const name = {
      name: "route_map",
    };
    this.$store.dispatch("getSettingsByName", name);
  },
};
