import JwtServices from "../../services/jwt.services";

//Actions type
export const GET_SUMMARY_TICKET = "getSummaryTicket";
export const GET_SUMMARY_TICKET_TABLE = "getSummaryTicketTable";
export const GET_SUMMARY_TICKET_CELL = "getSummaryTicketCell";

//Mutation type
export const SET_SUMMARY_TICKET = "setSummaryTicket";
export const SET_SUMMARY_TICKET_TABLE = "setSummaryTicketTable";
export const SET_SUMMARY_TICKET_CELL = "setSummaryTicketCell";

const state = {
  ticketSummaryCard: [],
  ticketSummaryCardCell: [],
  ticketSummaryTable: [],
  headerTableTicketSummary: [],
  defaultTicketSummaryPayload: {
    start_date: "",
    end_date: "",
    cell_operator_type: 2,
    cell_operator_id: 0,
    sort: "highest",
    limit: 10,
    page: 1,
  },
};
const getters = {
  ticketSummaryCard() {
    return state.ticketSummaryCard;
  },
  ticketSummaryCardCell() {
    return state.ticketSummaryCardCell;
  },
  headerTableTicketSummary() {
    return state.headerTableTicketSummary;
  },
  ticketSummaryTable() {
    return state.ticketSummaryTable;
  },
  defaultTicketSummaryPayload() {
    return state.defaultTicketSummaryPayload;
  },
};
const mutations = {
  [SET_SUMMARY_TICKET](state, payload) {
    state.ticketSummaryCard = payload;
  },
  [SET_SUMMARY_TICKET_CELL](state, payload) {
    state.ticketSummaryCardCell = payload;
  },
  [SET_SUMMARY_TICKET_TABLE](state, payload) {
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
        value: "operator_id",
        sortable: false,
      },
      {
        text: "Total ticket",
        value: "data.total_ticket",
        sortable: false,
      },
      {
        text: "Open ticket",
        value: "data.open_ticket",
        sortable: false,
      },
      {
        text: "On progress ticket",
        value: "data.on_progress_ticket",
        sortable: false,
      },
      {
        text: "Closed ticket",
        value: "data.closed_ticket",
        sortable: false,
      },
      // { text: '', value: 'data-table-expand' }
    ];
    payload.data.forEach((element, index) => {
      payloadMapped.data.push({
        ["number"]: index + 1,
        ["data"]: {
          //get the data and sort by their name
          ["open_ticket"]: element.data.filter((obj) => obj.name === "Open")[0]
            .count,
          ["on_progress_ticket"]: element.data.filter(
            (obj) => obj.name === "On Progress"
          )[0].count,
          ["closed_ticket"]: element.data.filter(
            (obj) => obj.name === "Closed"
          )[0].count,
          ["total_ticket"]: element.data.filter(
            (obj) => obj.name === "total_ticket"
          )[0].count,
        },
        ["operator_id"]: element.id,
        ["logo_url"]: process.env.VUE_APP_API_URL,
        ["logo"]: element.logo,
        ["name"]: element.name,
        ["total"]: element.total,
      });
    });
    // console.log(payloadMapped);
    state.headerTableTicketSummary = headers;
    state.ticketSummaryTable = payloadMapped;
  },
};
const actions = {
  [GET_SUMMARY_TICKET](context) {
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/id/ticket/summary/ticket-status-fo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtServices.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error != true) {
            this.commit("loadingData", false);
            context.commit(SET_SUMMARY_TICKET, result.data);
            resolve(result);
          } else {
            this.commit("loadingData", false);
            resolve(reject);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  [GET_SUMMARY_TICKET_CELL](context, payload) {
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/ticket-status`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtServices.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.error != true) {
            const dataResult = {
              total_ticket: result.data.reduce(
                (accum, item) => accum + item.count,
                0
              ),
              close_ticket: 0,
              open_ticket: 0,
              progress_ticket: 0,
            };

            for (let data of result.data) {
              // console.log(data, "ticket status");
              if (data.name == "On Progress") {
                dataResult.progress_ticket = data.count;
              }
              if (data.name == "Closed") {
                dataResult.close_ticket = data.count;
              }
              if (data.name == "Open") {
                dataResult.open_ticket = data.count;
              }
            }
            context.commit(SET_SUMMARY_TICKET_CELL, dataResult);
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  [GET_SUMMARY_TICKET_TABLE](context, payload) {
    return new Promise((resolve, reject) => {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/id/ticket/summary/operators-fo`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtServices.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result.data);
          if (result.error != true) {
            this.commit("loadingData", false);
            this.commit("loadingTable", false);
            context.commit(SET_SUMMARY_TICKET_TABLE, result.data);
            resolve(result);
          } else {
            this.commit("loadingData", false);
            this.commit("loadingTable", false);
            reject(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
export default {
  state,
  actions,
  mutations,
  getters,
};
