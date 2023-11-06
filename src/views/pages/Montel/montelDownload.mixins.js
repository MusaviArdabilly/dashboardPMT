export const mixinDownloadMontel = {
  data() {
    return {
      whileDownload: false,
      printOutHeader: {
        No: "no",
        Tanggal: "date",
        Sumber: "source",
        "Judul/Akun": "account",
        Unggahan: "content",
        Sentimen: "sentimen",
        Layanan: "service",
        Komplain: "complaint",
      },
    };
  },
  methods: {
    async fetchMontelFO() {
      let data = [];
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: -1,
        page: 1,
        sort: this.selected_sort,
        search: this.search,
        service: this.selected_service,
        source: "",
        cell_operator_ids: this.computedListOperator,
      };
      await fetch(process.env.VUE_APP_API_URL + `api/v2/id/montel`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          result.data.data.forEach((item, index) => {
            data.push({
              no: index + 1,
              date: item.post_at,
              source: item.source,
              account: item.account,
              content: item.content,
              sentimen: item.sentimen,
              service: item.service,
              complaint: item.complaint,
            });
          });
          // console.log(this.data_download, "data download");
        })
        .catch((err) => {
          console.log(err);
        });
      return data;
    },
    async fetchMontelCell() {
      let data = [];
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        limit: -1,
        page: 1,
        sort: this.selected_sort,
        service: this.selected_service,
        search: this.search,
        source: "",
        cell_operator_ids: this.selected_opsel,
      };
      await fetch(process.env.VUE_APP_API_URL + `api/v2/id/montel`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          result.data.data.forEach((item, index) => {
            data.push({
              no: index + 1,
              date: item.post_at,
              source: item.source,
              account: item.account,
              content: item.content,
              sentimen: item.sentimen,
              service: item.service,
              complaint: item.complaint,
            });
          });
          // console.log(this.data_download, "data download");
        })
        .catch((err) => {
          console.log(err);
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
};
