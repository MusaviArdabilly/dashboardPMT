import JwtServices from "../../services/jwt.services";

// actions type
export const GET_SPEED_TEST = "getSpeedTest";
export const GET_AVG_SPEED_TEST = "getAvgSpeedTest";
export const GET_SPEED_TEST_WITH_FILTER = "getSpeedTestWithFilter";
export const GET_VIDEO_TEST = "getVideoTest";
export const GET_AVG_VIDEO_TEST = "getAvgVideoTest";
export const GET_VIDEO_TEST_WITH_FILTER = "getVideoTestWithFilter";
export const GET_WEB_TEST_WITH_FILTER = "getWebTestWithFilter";
export const GET_WEB_TEST = "getWebTest";
export const GET_AVG_WEB_TEST = "getAvgWebTest";
export const GET_RATING = "getRating";
export const GET_AVG_RATING = "getAvgRating";
export const GET_RATING_WITH_FILTER = "getRatingWithFilter";
export const GET_ALARM = "getAlarm";
export const GET_DEVICE = "getDevice";
export const GET_START_DATE = "getStartDate";
export const GET_END_DATE = "getEndDate";
export const GET_AVG_SPEED_TEST_BY_PROVINCE = "getAvgSpeedTestByProvince";
export const GET_AVG_WEB_TEST_BY_PROVINCE = "getAvgWebTestByProvince";
export const GET_AVG_VIDEO_TEST_BY_PROVINCE = "getAvgVideoTestByProvince";
export const CHANGE_SUMMARY = "changeSummary";
export const RESET_FILTER = "resetFilter";
export const GET_PAGINATION = "getPagination";

// mutations type
export const SET_SPEED_TEST = "setSpeedTest";
export const SET_SPEED_TEST_WITH_FILTER = "setSpeedTestWithFilter";
export const SET_WEB_TEST = "setWebTest";
export const SET_VIDEO_TEST = "setVideoTest";
export const SET_VIDEO_TEST_WITH_FILTER = "setVideoTestWithFilter";
export const SET_WEB_TEST_WITH_FILTER = "setWebTestWithFilter";
export const SET_RATING = "setRating";
export const SET_RATING_WITH_FILTER = "setRatingWithFilter";
export const SET_ALARM = "setAlarm";
export const SET_ALARM_MAP = "setAlarmMap";
export const SET_DEVICE = "setDevice";
export const SET_START_DATE = "setStartDate";
export const SET_END_DATE = "setEndDate";
export const SET_LOADING = "setLoading";
export const SET_AVG_SPEED_TEST = "setAvgSpeedTest";
export const SET_AVG_VIDEO_TEST = "setAvgVideoTest";
export const SET_AVG_WEB_TEST = "setAvgWebTest";
export const SET_AVG_RATING = "setAvgRating";
export const SET_AVG_SPEED_TEST_BY_PROVINCE = "setAvgSpeedTestByProvince";
export const SET_AVG_WEB_TEST_BY_PROVINCE = "setAvgWebTestByProvince";
export const SET_AVG_VIDEO_TEST_BY_PROVINCE = "setAvgVideoTestByProvince";
export const SET_LOADING_AVG_WEB = "setLoadingAvgWeb";
export const SET_LOADING_AVG_VIDEO = "setLoadingAvgVideo";
export const SET_LOADING_AVG_SPEED = "setLoadingAvgSpeed";
export const SET_LOADING_AVG_RATING = "setLoadingAvgRating";

const state = {
  pagination: [],
  speed_test: [],
  video_test: [],
  web_test: [],
  rating: [],
  avg_speed_test: [],
  avg_video_test: [],
  avg_web_test: [],
  avg_rating: [],
  avg_speed_test_by_province: [],
  avg_web_test_by_province: [],
  avg_video_test_by_province: [],
  alarm: [],
  qoe_alarm_map: [],
  device: [],
  date_1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10),
  date_2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10),
  loading: false,
  speed_threshold: 0,
  speed_ss_threshold: 0,
  video_threshold: 0,
  video_ss_threshold: 0,
  web_threshold: 0,
  web_ss_threshold: 0,
  start_date: "",
  end_date: "",
  summary: [],
  summary_province: [],
  loadingAvgWeb: false,
  loadingAvgVideo: false,
  loadingAvgSpeed: false,
  loadingAvgRating: false,
};

const getters = {
  date_1() {
    return state.date_1;
  },

  date_2() {
    return state.date_2;
  },

  start_date() {
    return state.start_date;
  },

  end_date() {
    return state.end_date;
  },

  speed_test() {
    return state.speed_test;
  },

  video_test() {
    return state.video_test;
  },

  web_test() {
    return state.web_test;
  },

  speed_threshold() {
    return state.speed_threshold;
  },

  speed_ss_threshold() {
    return state.speed_ss_threshold;
  },

  video_threshold() {
    return state.video_threshold;
  },

  video_ss_threshold() {
    return state.video_ss_threshold;
  },

  web_threshold() {
    return state.web_threshold;
  },

  web_ss_threshold() {
    return state.web_ss_threshold;
  },

  rating() {
    return state.rating;
  },

  alarm() {
    return state.alarm;
  },

  getQoEAlarm() {
    return state.qoe_alarm_map;
  },

  device() {
    return state.device;
  },

  avg_speed_test() {
    return state.avg_speed_test;
  },

  avg_web_test() {
    return state.avg_web_test;
  },

  avg_video_test() {
    return state.avg_video_test;
  },

  avg_speed_test_by_province() {
    return state.avg_speed_test_by_province;
  },

  avg_web_test_by_province() {
    return state.avg_web_test_by_province;
  },

  avg_video_test_by_province() {
    return state.avg_video_test_by_province;
  },

  loading() {
    return state.loading;
  },

  summary() {
    return state.summary;
  },

  summary_province() {
    return state.summary_province;
  },

  avg_rating() {
    return state.avg_rating;
  },

  pagination() {
    return state.pagination;
  },
  loadingAvgWeb() {
    return state.loadingAvgWeb;
  },
  loadingAvgSpeed() {
    return state.loadingAvgSpeed;
  },
  loadingAvgVideo() {
    return state.loadingAvgVideo;
  },
  loadingAvgRating() {
    return state.loadingAvgRating;
  },
};

const actions = {
  [GET_SPEED_TEST](context, payload) {
    context.commit(SET_LOADING, true);
    return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/speedtest`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log("iniii", result.data);
        context.commit(SET_LOADING, false);
        if (result.error) {
          context.commit(SET_SPEED_TEST, []);
          return Promise.resolve(result);
        }
        state.speed_threshold = result.data.threshold;
        state.speed_ss_threshold = result.data.signal_strength_threshold;
        context.commit(SET_SPEED_TEST, result.data.data);
        context.commit(SET_LOADING, false);
        return Promise.resolve(result);
      });
  },

  [GET_SPEED_TEST_WITH_FILTER](context, payload) {
    // console.log(payload);

    context.commit(SET_LOADING, true);
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/speedtest`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error == true) {
          context.commit(SET_SPEED_TEST, []);
          context.commit(SET_LOADING, false);
        }
        context.commit(SET_SPEED_TEST, result.data.data);
        context.commit(SET_LOADING, false);
        if (payload.status == 1) {
          state.speed_test = [];
          for (let value of result.data.data) {
            if (value.download_speed < state.speed_threshold.value) {
              context.commit(SET_SPEED_TEST_WITH_FILTER, value);
              context.commit(SET_LOADING, false);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_VIDEO_TEST](context, payload) {
    context.commit(SET_LOADING, true);
    return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/videotest`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_LOADING, false);
        if (result.error) {
          context.commit(SET_VIDEO_TEST, []);
          return Promise.resolve(result);
        }
        state.video_threshold = result.data.threshold;
        state.video_ss_threshold = result.data.signal_strength_threshold;
        context.commit(SET_VIDEO_TEST, result.data.data);
        context.commit(SET_LOADING, false);
        return Promise.resolve(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_VIDEO_TEST_WITH_FILTER](context, payload) {
    // console.log(payload);

    context.commit(SET_LOADING, true);
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/videotest`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result.error == true) {
          context.commit(SET_VIDEO_TEST, []);
        }
        context.commit(SET_VIDEO_TEST, result.data.data);
        context.commit(SET_LOADING, false);
        if (payload.status == 1) {
          state.video_test = [];
          for (let value of result.data.data) {
            if (value.throughput < state.video_threshold.value) {
              // console.log("MASUK", value);
              context.commit(SET_VIDEO_TEST_WITH_FILTER, value);
              context.commit(SET_LOADING, false);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_WEB_TEST](context, payload) {
    context.commit(SET_LOADING, true);
    return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/webtest`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_LOADING, false);
        if (result.error) {
          context.commit(SET_WEB_TEST, []);
          return Promise.resolve(result);
        }
        state.web_threshold = result.data.threshold;
        state.web_ss_threshold = result.data.signal_strength_threshold;
        context.commit(SET_WEB_TEST, result.data.data);
        context.commit(SET_LOADING, false);
        return Promise.resolve(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_WEB_TEST_WITH_FILTER](context, payload) {
    // console.log(payload);

    context.commit(SET_LOADING, true);
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/videotest`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result.error == true) {
          context.commit(SET_WEB_TEST, []);
        }
        context.commit(SET_WEB_TEST, result.data.data);
        context.commit(SET_LOADING, false);
        if (payload.status == 1) {
          state.video_test = [];
          for (let value of result.data.data) {
            if (value.throughput < state.video_threshold.value) {
              // console.log("MASUK", value);
              context.commit(SET_WEB_TEST_WITH_FILTER, value);
              context.commit(SET_LOADING, false);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_RATING](context, payload) {
    context.commit(SET_LOADING, true);

    return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/rating`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_LOADING, false);
        if (result.error) {
          context.commit(SET_RATING, []);
          return Promise.resolve(result);
        }
        state.web_threshold = result.data.threshold;
        context.commit(SET_RATING, result.data.data);
        context.commit(SET_LOADING, false);
        return Promise.resolve(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_RATING_WITH_FILTER](context, payload) {
    // console.log(payload);

    context.commit(SET_LOADING, true);
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/rating`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result.error == true) {
          context.commit(SET_RATING, []);
        }
        context.commit(SET_RATING, result.data.data);
        context.commit(SET_LOADING, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_ALARM](context, payload) {
    context.commit(SET_LOADING, true);

    if (payload.status == "open") {
      return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/alarm`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          context.commit(SET_LOADING, false);
          if (result.error) {
            context.commit(SET_ALARM_MAP, []);
            return Promise.resolve(result);
          }
          context.commit(SET_ALARM_MAP, result.data.data);
          context.commit(SET_LOADING, false);
          return Promise.resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/alarm`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          context.commit(SET_LOADING, false);
          if (result.error) {
            context.commit(SET_ALARM, []);
            return Promise.resolve(result);
          }
          context.commit(SET_ALARM, result.data.data);
          context.commit(SET_LOADING, false);
          return Promise.resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  [GET_DEVICE](context, payload) {
    context.commit(SET_LOADING, true);

    return fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/availability`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_LOADING, false);
        if (result.error) {
          context.commit(SET_DEVICE, []);
          return Promise.resolve(result);
        }
        context.commit(SET_DEVICE, result.data.data);
        context.commit(SET_LOADING, false);
        return Promise.resolve(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_START_DATE](context, payload) {
    context.commit(SET_START_DATE, payload);
  },

  [GET_END_DATE](context, payload) {
    context.commit(SET_END_DATE, payload);
  },

  [GET_AVG_RATING](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-rating`,
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
        // console.log("masuk", resuxlt);
        context.commit(SET_AVG_RATING, result.data);
        context.commit(SET_LOADING_AVG_RATING, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_AVG_SPEED_TEST](context, payload) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-speed`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        state.summary = result.data;
        context.commit(SET_AVG_SPEED_TEST, result.data);
        context.commit(SET_LOADING_AVG_SPEED, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_AVG_WEB_TEST](context, payload) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-web`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_AVG_WEB_TEST, result.data);
        context.commit(SET_LOADING_AVG_WEB, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_AVG_VIDEO_TEST](context, payload) {
    fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/summary/average-video`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtServices.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        context.commit(SET_AVG_VIDEO_TEST, result.data);
        context.commit(SET_LOADING_AVG_VIDEO, false);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_AVG_SPEED_TEST_BY_PROVINCE](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL +
        `api/v1/id/qoe/summary/average-speed/province`,
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
        context.commit(SET_AVG_SPEED_TEST_BY_PROVINCE, result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_AVG_WEB_TEST_BY_PROVINCE](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL +
        `api/v1/id/qoe/summary/average-web/province`,
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
        context.commit(SET_AVG_WEB_TEST_BY_PROVINCE, result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [GET_AVG_VIDEO_TEST_BY_PROVINCE](context, payload) {
    fetch(
      process.env.VUE_APP_API_URL +
        `api/v1/id/qoe/summary/average-video/province`,
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
        context.commit(SET_AVG_VIDEO_TEST_BY_PROVINCE, result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  [CHANGE_SUMMARY](context, payload) {
    switch (payload) {
      case 0:
        {
          context.state.summary = context.state.avg_speed_test;
          context.state.summary_province =
            context.state.avg_speed_test_by_province;
        }
        break;
      case 1:
        {
          context.state.summary = context.state.avg_video_test;
          context.state.summary_province =
            context.state.avg_video_test_by_province;
          // console.log(context.state.summary_province);
        }
        break;
      case 2:
        {
          context.state.summary = context.state.avg_web_test;
          context.state.summary_province =
            context.state.avg_web_test_by_province;
        }
        break;
    }
  },
};

const mutations = {
  [SET_SPEED_TEST](state, payload) {
    state.speed_test = payload;
  },

  [SET_SPEED_TEST_WITH_FILTER](state, payload) {
    state.speed_test.push(payload);
  },

  [SET_VIDEO_TEST_WITH_FILTER](state, payload) {
    state.video_test.push(payload);
  },

  [SET_WEB_TEST_WITH_FILTER](state, payload) {
    state.video_test.push(payload);
  },

  [SET_VIDEO_TEST](state, payload) {
    state.video_test = payload;
  },

  [SET_WEB_TEST](state, payload) {
    state.web_test = payload;
  },

  [SET_RATING](state, payload) {
    state.rating = payload;
  },

  [SET_ALARM](state, payload) {
    state.alarm = payload;
  },

  [SET_ALARM_MAP](state, payload) {
    state.qoe_alarm_map = payload;
  },

  [SET_DEVICE](state, payload) {
    state.device = payload;
  },

  [SET_START_DATE](state, payload) {
    state.start_date = payload;
  },

  [SET_END_DATE](state, payload) {
    state.end_date = payload;
  },

  [SET_LOADING](state, payload) {
    state.loading = payload;
  },

  [SET_AVG_RATING](state, payload) {
    payload.sort(function (a, b) {
      return b.rating - a.rating;
    });

    state.avg_rating = payload;
  },

  [SET_AVG_SPEED_TEST](state, payload) {
    let arr = [];

    for (let item of payload) {
      arr.push(item.avg_download_speed);
    }

    let max = Math.max(...arr);

    payload.sort(function (a, b) {
      return b.avg_download_speed - a.avg_download_speed;
    });

    state.avg_speed_test = payload;

    for (let key in state.avg_speed_test) {
      if (max == 0) {
        state.avg_speed_test[key].payload = 0;
      } else {
        state.avg_speed_test[key].payload = Math.round(
          (state.avg_speed_test[key].avg_download_speed / max) * 100
        );
      }
    }
  },

  [SET_AVG_WEB_TEST](state, payload) {
    let arr = [];

    for (let item of payload) {
      arr.push(item.avg_throughput);
    }

    let max = Math.max(...arr);

    payload.sort(function (a, b) {
      return b.avg_throughput - a.avg_throughput;
    });

    state.avg_web_test = payload;

    for (let key in state.avg_web_test) {
      if (max == 0) {
        state.avg_web_test[key].payload = 0;
      } else {
        state.avg_web_test[key].payload = Math.round(
          (state.avg_web_test[key].avg_throughput / max) * 100
        );
      }
    }
  },

  [SET_AVG_VIDEO_TEST](state, payload) {
    // console.log(payload);

    let arr = [];

    for (let item of payload) {
      arr.push(item.avg_throughput);
    }

    // console.log(arr);

    let max = Math.max(...arr);

    payload.sort(function (a, b) {
      return b.avg_throughput - a.avg_throughput;
    });

    state.avg_video_test = payload;

    for (let key in state.avg_video_test) {
      // console.log(state.avg_video_test[key]);
      if (max == 0) {
        state.avg_video_test[key].payload = 0;
      } else {
        state.avg_video_test[key].payload = Math.round(
          (state.avg_video_test[key].avg_throughput / max) * 100
        );
      }
    }
  },

  [SET_AVG_SPEED_TEST_BY_PROVINCE](state, payload) {
    let arr = [];

    for (let items of payload) {
      items.data.sort(function (a, b) {
        return b.avg_download_speed - a.avg_download_speed;
      });

      // console.log(items.data);
      for (let value of items.data) {
        arr.push(value.avg_download_speed);
      }
    }

    let max = Math.max(...arr);
    // console.log(max);

    state.avg_speed_test_by_province = payload;
    state.summary_province = payload;

    // console.log(state);

    for (let value of state.avg_speed_test_by_province) {
      for (let key in value.data) {
        value.data[key].payload = Math.round(
          (value.data[key].avg_download_speed / max) * 100
        );
      }
    }
  },

  [SET_AVG_WEB_TEST_BY_PROVINCE](state, payload) {
    // console.log(payload);
    let arr = [];

    for (let items of payload) {
      // console.log(items);
      items.data.sort(function (a, b) {
        return b.avg_throughput - a.avg_throughput;
      });

      // console.log(items.data);
      for (let value of items.data) {
        arr.push(value.avg_throughput);
      }
    }

    let max = Math.max(...arr);
    // console.log(max);

    state.avg_web_test_by_province = payload;
    // console.log(state);

    for (let value of state.avg_web_test_by_province) {
      for (let key in value.data) {
        value.data[key].payload = Math.round(
          (value.data[key].avg_throughput / max) * 100
        );
      }
    }
  },

  [SET_AVG_VIDEO_TEST_BY_PROVINCE](state, payload) {
    let arr = [];

    for (let items of payload) {
      items.data.sort(function (a, b) {
        return b.avg_throughput - a.avg_throughput;
      });

      // console.log(items.data);
      for (let value of items.data) {
        arr.push(value.avg_throughput);
      }
    }

    let max = Math.max(...arr);
    // console.log(max);

    state.avg_video_test_by_province = payload;
    // console.log(state);

    for (let value of state.avg_video_test_by_province) {
      for (let key in value.data) {
        value.data[key].payload = Math.round(
          (value.data[key].avg_throughput / max) * 100
        );
      }
    }
  },
  [SET_LOADING_AVG_RATING](state, payload) {
    state.loadingAvgRating = payload;
  },
  [SET_LOADING_AVG_SPEED](state, payload) {
    state.loadingAvgSpeed = payload;
  },
  [SET_LOADING_AVG_WEB](state, payload) {
    state.loadingAvgWeb = payload;
  },
  [SET_LOADING_AVG_VIDEO](state, payload) {
    state.loadingAvgVideo = payload;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
