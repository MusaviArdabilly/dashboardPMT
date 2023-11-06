import JwtServices from "../../services/jwt.services";

// actions type
export const GET_SUMMARY_ALARM_SEVERITY = "getSummaryAlarmSeverity";
export const GET_TABLE_ALARM_SEVERITY = "getTableAlarmSeverity";
export const GET_TOTAL_ALARM_SEVERITY = "getTotalAlarmSeverity";
export const GET_TABLE_ALARM_DETAIL = "getTableAlarmDetail";

// mutations type
export const SET_SUMMARY_ALARM_SEVERITY = "setSummaryAlarmSeverity";
export const SET_TABLE_ALARM_SEVERITY = "setTableAlarmSeverity";
export const SET_TOTAL_ALARM_SEVERITY = "setTotalAlarmSeverity";
export const SET_TABLE_ALARM_DETAIL = "setTableAlarmDetail";
export const SET_LOADING_ALARM_LIST = "setLoadingAlarmList";

const state = {
  alarmSeveritySummaryCard: [],
  alarmSeverityTotal: 0,
  alarmSeverityTable: [],
  alarmDetailTable: [],
  headerTableSeverity: [],
  headerTableSeverityWithAction: [],
  headerTableAlarmDetail: [],
  defaultAlarmSeverityPayload: {
    network_operator: 0,
    sort: "most",
    severity: -1,
    limit: 10,
    page: 1,
  },
  loadingAlarmList: false,
};
const getters = {
  alarmSeveritySummaryCard() {
    return state.alarmSeveritySummaryCard;
  },
  alarmSeverityTotal() {
    return state.alarmSeverityTotal;
  },
  headerTableSeverity: (state) => (payload) => {
    if (payload === "withAction") {
      return state.headerTableSeverityWithAction;
    } else if (payload === "noAction") {
      return state.headerTableSeverity;
    }
  },
  headerTableAlarmDetail() {
    return state.headerTableAlarmDetail;
  },
  alarmSeverityTable() {
    return state.alarmSeverityTable;
  },
  alarmDetailTable() {
    return state.alarmDetailTable;
  },
  defaultAlarmSeverityPayload() {
    return state.defaultAlarmSeverityPayload;
  },
  loadingAlarmList() {
    return state.loadingAlarmList;
  },
};

const mutations = {
  [SET_SUMMARY_ALARM_SEVERITY](state, payload) {
    const summaryMapped = [];
    payload.forEach((item) => {
      summaryMapped.push({
        ["name"]: item.name,
        ["count"]: item.count,
        ["severity"]: item.severity,
        ["cardSize"]: item.name === "Not Yet Identified" ? 4 : 3,
        ["cardColor"]:
          item.name === "Critical"
            ? "red-light"
            : item.name === "Major"
            ? "orange-light"
            : item.name === "Medium"
            ? "yellow-light"
            : item.name === "Minor"
            ? "green-light"
            : "gray-light",
      });
    });
    state.alarmSeveritySummaryCard = summaryMapped;
  },
  [SET_TOTAL_ALARM_SEVERITY](state, payload) {
    state.alarmSeverityTotal = payload;
  },
  [SET_TABLE_ALARM_SEVERITY](state, payload) {
    const payloadMapped = {
      data: [],
      pagination: payload.pagination,
    };
    const headers = [
      {
        text: "No",
        align: "start",
        sortable: false,
        value: "number",
      },
      {
        text: "Operator",
        sortable: false,
        value: "name",
      },
      {
        text: "Total Alarm",
        sortable: false,
        value: "total_alarm",
      },
      { text: "Open", sortable: false, value: "open" },
      { text: "Close", sortable: false, value: "cleared" },
      { text: "Action", sortable: false, value: "operator_id" },
    ];
    payload.data.forEach((element, index) => {
      payloadMapped.data.push({
        ["number"]: index + 1,
        ["operator_id"]: element.id,
        ["logo_url"]: process.env.VUE_APP_API_URL,
        ["logo"]: element.logo,
        ["name"]: element.name,
        ["open"]: element.open,
        ["cleared"]: element.cleared,
        ["total_alarm"]: element.total_alarm,
      });
    });
    state.headerTableSeverity = headers.slice(0, 5);
    state.headerTableSeverityWithAction = headers;
    state.alarmSeverityTable = payloadMapped;
  },
  [SET_TABLE_ALARM_DETAIL](state, payload) {
    const headers = [
      {
        text: "Ticket number",
        align: "start",
        sortable: false,
        value: "ticket_number",
      },
      { text: "Summary", value: "summary", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Severity", value: "severity", sortable: true },
      { text: "Affected nodes", value: "affected_node", sortable: false },
      {
        text: "Affected segment",
        value: "affected_segment",
        sortable: false,
      },
      { text: "Target time", value: "target_to_resolved", sortable: false },
      {
        text: "Current process",
        value: "current_process",
        sortable: false,
      },
      { text: "Start Time", value: "start_time", sortable: false },
      { text: "End Time", value: "end_time", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Action", value: "id", sortable: false },
    ];
    const payloadDataMapped = [];
    payload.data.forEach((item) => {
      payloadDataMapped.push({
        ["id"]: item.id,
        ["operator_id"]: item.operator_id,
        ["operator_name"]: item.operator_name,
        ["affected_node"]: item.affected_node,
        ["affected_segment"]: item.affected_segment,
        ["current_process"]: item.current_process,
        ["status"]: item.status,
        ["severity"]: item.severity,
        ["summary"]: item.summary,
        ["ticket_number"]: item.ticket_number,
        ["target_to_resolved"]: item.target_to_resolved,
        ["start_time"]: item.start_time,
        ["end_time"]: item.end_time == undefined ? 0 : item.end_time,
        ["description"]: item.description,
        ["affected_node_id"]: item.affected_node.map((prop) => {
          return prop.id;
        }),
        ["affected_segment_id"]: item.affected_segment.map((prop) => {
          return prop.id;
        }),
        ["created_at"]: item.created_at,
      });
    });
    if (payload === null) {
      state.alarmDetailTable = {
        data: [],
        pagination: {
          current_page: 0,
          total_page: 0,
        },
      };
    } else {
      const payloadMapped = {
        data: payloadDataMapped,
        pagination: payload.pagination,
      };
      state.alarmDetailTable = payloadMapped;
    }
    // console.log(payloadDataMapped);
    state.headerTableAlarmDetail = headers;
  },
  [SET_LOADING_ALARM_LIST](state, payload) {
    state.loadingAlarmList = payload;
  },
};
const actions = {
  [GET_SUMMARY_ALARM_SEVERITY](context) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/fo-alarm/summary/cards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          this.commit("loadingData", false);
          context.commit(SET_SUMMARY_ALARM_SEVERITY, result.data);
        } else {
          this.commit("loadingData", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_TOTAL_ALARM_SEVERITY](context) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/fo-alarm/summary/total`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          this.commit("loadingData", false);
          context.commit(SET_TOTAL_ALARM_SEVERITY, result.data);
        } else {
          this.commit("loadingData", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_TABLE_ALARM_SEVERITY](context, request) {
    const url = new URL(
      process.env.VUE_APP_API_URL + `api/v1/id/fo-alarm/summary/data-by-op`
    );
    for (let key in request) {
      url.searchParams.append(key, request[key]);
    }
    return new Promise((resolve, reject) => {
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
            this.commit("loadingTable", false);
            context.commit(SET_TABLE_ALARM_SEVERITY, result.data);
            resolve(result);
          } else {
            this.commit("loadingTable", false);
            reject(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  [GET_TABLE_ALARM_DETAIL](context, request) {
    const url = new URL(
      process.env.VUE_APP_API_URL + `api/v1/id/fo-alarm/fo/alarm`
    );
    for (let key in request) {
      url.searchParams.append(key, request[key]);
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
        // console.log(result);
        if (result.error != true) {
          context.commit(SET_LOADING_ALARM_LIST, false);
          context.commit(SET_TABLE_ALARM_DETAIL, result.data);
        } else {
          context.commit(SET_LOADING_ALARM_LIST, false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
