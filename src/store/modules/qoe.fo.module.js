import JwtServices from "../../services/jwt.services";

// ACTIONS TYPE
export const GET_AVG_CARDS = "getAvgCards";
export const GET_AVG_SPEED_FO = "getAvgSpeedFo";
export const GET_AVG_VIDEO_FO = "getAvgVideoFo";
export const GET_AVG_WEB_FO = "getAvgWebFo";
export const GET_AVG_BY_PROVINCE = "getAvgByProvince";

// MUTATIONS TYPE
export const SET_AVG_CARDS = "setAvgCards";
export const SET_AVG_DATA = "setAvgData";
export const SET_AVG_SPEED_FO = "setAvgSpeedFo";
export const SET_AVG_WEB_FO = "setAvgWebFo";
export const SET_AVG_VIDEO_FO = "setAvgVideoFo";
export const SET_SELECTED_SUMMARY = "setSelectedSummary";
export const SET_AVG_BY_PROVINCE = "setAvgByProvince";

export const SET_LOADING = "setFoLoading";
export const SET_LOADING_AVG_SPEED = "setLoadingAvgSpeed";
export const SET_LOADING_AVG_WEB = "setLoadingAvgWeb";
export const SET_LOADING_AVG_VIDEO = "setLoadingAvgVideo";
export const SET_LOADING_SUMMARY_FO = "setLoadingSummaryFo";
export const SET_LOADING_SUMMARY_FO_PROVINCE = "setLoadingSummaryFoProvince";

const state = {
  chunkArraySize: 5,
  selectedSummary: "avgSpeedUpload",
  foLoading: false,
  loadingSummaryFo: false,
  loadingSummaryFoProvince: false,
  loadingAvgSpeed: false,
  loadingAvgVideo: false,
  loadingAvgWeb: false,
  avgSpeedFo: [],
  avgSpeedFoDownload: [],
  avgSpeedFoUpload: [],
  avgWebFo: [],
  avgVideoFo: [],
  avgCards: [],
  avgSummaryData: [],
  avgSummaryDataByProvince: [],
  slideDataExample: [
    {
      name: "Avastnet",
      percentage: 93,
      range: 10.9,
      total_test: 490,
    },
    {
      name: "BaratsCell",
      percentage: 95,
      range: 7.9,
      total_test: 320,
    },
    {
      name: "ChihuahuaNet",
      percentage: 85,
      range: 6,
      total_test: 430,
    },
    {
      name: "DaratsCell",
      percentage: 45,
      range: 4.3,
      total_test: 1490,
    },
    {
      name: "EdoTelecom",
      percentage: 24,
      range: 3.8,
      total_test: 290,
    },
    {
      name: "FixedBroad",
      percentage: 25,
      range: 3.8,
      total_test: 1490,
    },
    {
      name: "Glorynet",
      percentage: 26,
      range: 7.2,
      total_test: 110,
    },
    {
      name: "HajiTelkom",
      percentage: 26,
      range: 7.0,
      total_test: 100,
    },
    {
      name: "Ivannet",
      percentage: 26,
      range: 3.8,
      total_test: 380,
    },
    {
      name: "Jambu.net",
      percentage: 26,
      range: 3.8,
      total_test: 380,
    },
    {
      name: "Kodekode",
      percentage: 21,
      range: 2.5,
      total_test: 490,
    },
    {
      name: "LayangLayang",
      percentage: 24,
      range: 6.5,
      total_test: 125,
    },
    {
      name: "Manusia",
      percentage: 22,
      range: 2.5,
      total_test: 130,
    },
  ],
};

const getters = {
  avgCards() {
    return state.avgCards;
  },
  foLoading() {
    return state.foLoading;
  },
  loadingAvgSpeed() {
    return state.loadingAvgSpeed;
  },
  loadingAvgVideo() {
    return state.loadingAvgVideo;
  },
  loadingAvgWeb() {
    return state.loadingAvgWeb;
  },
  loadingSummaryFo() {
    return state.loadingSummaryFo;
  },
  avgSpeedFo() {
    return state.avgSpeedFo;
  },
  avgSpeedFoDownload() {
    return state.avgSpeedFoDownload;
  },
  avgSpeedFoUpload() {
    return state.avgSpeedFoUpload;
  },
  avgWebFo() {
    return state.avgWebFo;
  },
  avgVideoFo() {
    return state.avgVideoFo;
  },
  loadingSummaryFoProvince() {
    return state.loadingSummaryFoProvince;
  },
  avgSummaryData() {
    return state.avgSummaryData;
  },
  avgSummaryDataByProvince() {
    return state.avgSummaryDataByProvince;
  },
  slideExample() {
    const groupChunk = state.slideDataExample
      .map((e, i) => {
        return i % state.chunkArraySize === 0
          ? state.slideDataExample.slice(i, i + state.chunkArraySize)
          : null;
      })
      .filter((e) => {
        return e;
      });
    return groupChunk;
  },
  defaultPayloadSigmon() {
    const body = {
      single: {
        network_type: 2,
        status: "active",
        sort: "avg_upload_speed",
        order: "desc",
        start_date: "",
        end_date: "",
        search: "",
      },
      byProvince: {
        network_type: 2,
        status: "active",
        sort: "avg_upload_speed",
        order: "desc",
        province_id: 0,
      },
    };
    return body;
  },
};

const mutations = {
  [SET_AVG_CARDS](state, payload) {
    state.avgCards = payload;
  },
  [SET_AVG_DATA](state, payload) {
    if (state.selectedSummary == "avgSpeedUpload") {
      //populate upload speed
      const averageUpload = payload.map((item) => item.avg_upload_speed);
      const maxUpload = Math.max(...averageUpload);
      const mapPayloadUpload = payload.map(
        ({ avg_upload_speed, id, count, logo, name }) => ({
          ["id"]: id,
          ["logo_url"]: process.env.VUE_APP_API_URL,
          ["logo"]: logo,
          ["name"]: name,
          ["count"]: count,
          ["average"]: avg_upload_speed,
          ["percentage"]: Math.round((avg_upload_speed / maxUpload) * 100),
        })
      );
      const groupChunk = mapPayloadUpload
        .map((e, i) => {
          return i % state.chunkArraySize === 0
            ? mapPayloadUpload.slice(i, i + state.chunkArraySize)
            : null;
        })
        .filter((e) => {
          return e;
        });
      state.avgSummaryData = groupChunk;
    } else if (state.selectedSummary == "avgSpeedDownload") {
      // populate download speed
      const averageDownload = payload.map((item) => item.avg_download_speed);
      const maxDownload = Math.max(...averageDownload);
      const mapPayloadDownload = payload.map(
        ({ avg_download_speed, id, count, logo, name }) => ({
          ["id"]: id,
          ["logo_url"]: process.env.VUE_APP_API_URL,
          ["logo"]: logo,
          ["name"]: name,
          ["count"]: count,
          ["average"]: avg_download_speed,
          ["percentage"]: Math.round((avg_download_speed / maxDownload) * 100),
        })
      );
      const groupChunk = mapPayloadDownload
        .map((e, i) => {
          return i % state.chunkArraySize === 0
            ? mapPayloadDownload.slice(i, i + state.chunkArraySize)
            : null;
        })
        .filter((e) => {
          return e;
        });
      state.avgSummaryData = groupChunk;
    } else if (state.selectedSummary == "avgWeb") {
      //populate web test
      const averageWebTest = payload.map((item) => item.avg_throughput);
      const maxWebTest = Math.max(...averageWebTest);
      const mapPayloadWebTest = payload.map(
        ({ avg_throughput, id, count, logo, name }) => ({
          ["id"]: id,
          ["logo_url"]: process.env.VUE_APP_API_URL,
          ["logo"]: logo,
          ["name"]: name,
          ["count"]: count,
          ["average"]: avg_throughput,
          ["percentage"]: Math.round((avg_throughput / maxWebTest) * 100),
        })
      );
      const groupChunk = mapPayloadWebTest
        .map((e, i) => {
          return i % state.chunkArraySize === 0
            ? mapPayloadWebTest.slice(i, i + state.chunkArraySize)
            : null;
        })
        .filter((e) => {
          return e;
        });
      state.avgSummaryData = groupChunk;
    } else if (state.selectedSummary == "avgVideo") {
      //populate video test
      const averageVideoTest = payload.map((item) => item.avg_throughput);
      const maxVideoTest = Math.max(...averageVideoTest);
      const mapPayloadVideoTest = payload.map(
        ({ avg_throughput, id, count, logo, name }) => ({
          ["id"]: id,
          ["logo_url"]: process.env.VUE_APP_API_URL,
          ["logo"]: logo,
          ["name"]: name,
          ["count"]: count,
          ["average"]: avg_throughput,
          ["percentage"]: Math.round((avg_throughput / maxVideoTest) * 100),
        })
      );
      const groupChunk = mapPayloadVideoTest
        .map((e, i) => {
          return i % state.chunkArraySize === 0
            ? mapPayloadVideoTest.slice(i, i + state.chunkArraySize)
            : null;
        })
        .filter((e) => {
          return e;
        });
      state.avgSummaryData = groupChunk;
    }
  },
  [SET_AVG_SPEED_FO](state, payload) {
    const averageDownload = payload.map((item) => item.avg_download_speed);
    const maxDownload = Math.max(...averageDownload);
    const mapPayloadDownload = payload.map(
      ({ avg_download_speed, id, count, logo, name }) => ({
        ["id"]: id,
        ["logo"]: logo,
        ["name"]: name,
        ["count"]: count,
        ["average"]: avg_download_speed,
        ["percentage"]: Math.round((avg_download_speed / maxDownload) * 100),
      })
    );
    const sortPayloadDownload = mapPayloadDownload.sort((a, b) => {
      return b.average - a.average;
    });

    state.avgSpeedFoDownload = sortPayloadDownload;
    const averageUpload = payload.map((item) => item.avg_upload_speed);
    const maxUpload = Math.max(...averageUpload);
    const mapPayloadUpload = payload.map(
      ({ avg_upload_speed, id, count, logo, name }) => ({
        ["id"]: id,
        ["logo"]: logo,
        ["name"]: name,
        ["count"]: count,
        ["average"]: avg_upload_speed,
        ["percentage"]: Math.round((avg_upload_speed / maxUpload) * 100),
      })
    );
    const sortPayloadUpload = mapPayloadUpload.sort((a, b) => {
      return b.average - a.average;
    });
    state.avgSpeedFoUpload = sortPayloadUpload;
    this.commit(SET_LOADING, false);
  },
  [SET_AVG_WEB_FO](state, payload) {
    const averageWebTest = payload.map((item) => item.avg_throughput);
    const maxWebTest = Math.max(...averageWebTest);
    const mapPayloadWebTest = payload.map(
      ({ avg_throughput, id, count, logo, name }) => ({
        ["id"]: id,
        ["logo"]: logo,
        ["name"]: name,
        ["count"]: count,
        ["average"]: avg_throughput,
        ["percentage"]: Math.round((avg_throughput / maxWebTest) * 100),
      })
    );
    state.avgWebFo = mapPayloadWebTest;
    this.commit(SET_LOADING, false);
  },
  [SET_AVG_VIDEO_FO](state, payload) {
    const averageVideoTest = payload.map((item) => item.avg_throughput);
    const maxVideoTest = Math.max(...averageVideoTest);
    const mapPayloadVideoTest = payload.map(
      ({ avg_throughput, id, count, logo, name }) => ({
        ["id"]: id,
        ["logo"]: logo,
        ["name"]: name,
        ["count"]: count,
        ["average"]: avg_throughput,
        ["percentage"]: Math.round((avg_throughput / maxVideoTest) * 100),
      })
    );
    state.avgVideoFo = mapPayloadVideoTest;
    this.commit(SET_LOADING, false);
  },
  [SET_AVG_BY_PROVINCE](state, payload) {
    if (state.selectedSummary == "avgSpeedUpload") {
      const payloadMapped = [];
      payload.forEach((element) => {
        const listAverage = element.data.map((item) => item.avg_upload_speed);
        const maxUpload = Math.max(...listAverage);
        payloadMapped.push({
          ["data"]: element.data
            .slice(0, 5)
            .map(({ avg_upload_speed, id, count, logo, name }) => ({
              ["id"]: id,
              ["logo_url"]: process.env.VUE_APP_API_URL,
              ["logo"]: logo,
              ["name"]: name,
              ["count"]: count,
              ["average"]: avg_upload_speed,
              ["percentage"]: Math.round((avg_upload_speed / maxUpload) * 100),
            })),
          ["province_id"]: element.province_id,
          ["province_name"]: element.province_name,
        });
      });
      state.avgSummaryDataByProvince = payloadMapped;
    } else if (state.selectedSummary == "avgSpeedDownload") {
      const payloadMapped = [];
      payload.forEach((element) => {
        const listAverage = element.data.map((item) => item.avg_download_speed);
        const maxDownload = Math.max(...listAverage);
        payloadMapped.push({
          ["data"]: element.data
            .slice(0, 5)
            .map(({ avg_download_speed, id, count, logo, name }) => ({
              ["id"]: id,
              ["logo_url"]: process.env.VUE_APP_API_URL,
              ["logo"]: logo,
              ["name"]: name,
              ["count"]: count,
              ["average"]: avg_download_speed,
              ["percentage"]: Math.round(
                (avg_download_speed / maxDownload) * 100
              ),
            })),
          ["province_id"]: element.province_id,
          ["province_name"]: element.province_name,
        });
      });
      state.avgSummaryDataByProvince = payloadMapped;
    } else {
      const payloadMapped = [];
      payload.forEach((element) => {
        const listAverage = element.data.map((item) => item.avg_upload_speed);
        const maxUpload = Math.max(...listAverage);
        payloadMapped.push({
          ["data"]: element.data
            .slice(0, 5)
            .map(({ avg_upload_speed, id, count, logo, name }) => ({
              ["id"]: id,
              ["logo_url"]: process.env.VUE_APP_API_URL,
              ["logo"]: logo,
              ["name"]: name,
              ["count"]: count,
              ["average"]: avg_upload_speed,
              ["percentage"]: Math.round((avg_upload_speed / maxUpload) * 100),
            })),
          ["province_id"]: element.province_id,
          ["province_name"]: element.province_name,
        });
      });
      state.avgSummaryDataByProvince = payloadMapped;
    }
  },
  [SET_LOADING](state, payload) {
    state.foLoading = payload;
  },
  [SET_LOADING_AVG_SPEED](state, payload) {
    state.loadingAvgSpeed = payload;
  },
  [SET_LOADING_AVG_VIDEO](state, payload) {
    state.loadingAvgVideo = payload;
  },
  [SET_LOADING_AVG_WEB](state, payload) {
    state.loadingAvgWeb = payload;
  },
  [SET_LOADING_SUMMARY_FO](state, payload) {
    state.loadingSummaryFo = payload;
  },
  [SET_LOADING_SUMMARY_FO_PROVINCE](state, payload) {
    state.loadingSummaryFoProvince = payload;
  },
  [SET_SELECTED_SUMMARY](state, payload) {
    state.selectedSummary = payload;
  },
};

const actions = {
  [GET_AVG_CARDS](context) {
    context.commit(SET_LOADING, true);
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-cards`, {
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
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_AVG_CARDS, result.data);
        } else {
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING, false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_AVG_SPEED_FO](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-speed-fo`,
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
        if (result.error != true) {
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING, false);
          context.commit(SET_LOADING_AVG_SPEED, false);
          context.commit(SET_AVG_DATA, result.data);
          context.commit(SET_AVG_SPEED_FO, result.data);
        } else {
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING_AVG_SPEED, false);
          context.commit(SET_LOADING, false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_AVG_BY_PROVINCE](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL +
        `api/v1/id/qoe/summary/average-speed-fo/province`,
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
          context.commit(SET_LOADING_SUMMARY_FO_PROVINCE, false);
          context.commit(SET_AVG_BY_PROVINCE, result.data);
        } else {
          context.commit(SET_LOADING_SUMMARY_FO_PROVINCE, false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_AVG_VIDEO_FO](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-video-fo`,
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
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING_AVG_VIDEO, false);
          context.commit(SET_AVG_DATA, result.data);
          context.commit(SET_AVG_VIDEO_FO, result.data);
        } else {
          context.commit(SET_LOADING_AVG_VIDEO, false);
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING, false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  [GET_AVG_WEB_FO](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-web-fo`,
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
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING_AVG_WEB, false);
          context.commit(SET_AVG_DATA, result.data);
          context.commit(SET_AVG_WEB_FO, result.data);
        } else {
          context.commit(SET_LOADING_SUMMARY_FO, false);
          context.commit(SET_LOADING_AVG_WEB, false);
          context.commit(SET_LOADING, false);
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
