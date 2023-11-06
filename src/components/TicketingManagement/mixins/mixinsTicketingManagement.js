export const mixinsTicketingManagement = {
  data() {
    return {
      whileDownload: false,
      printOutHeader: {
        "NO TICKET": "ticket_number",
        DATE: "date",
        SUBJECT: "subject",
        SOURCE: "source",
        SCOPE: "scope",
        "ASSIGNED TO": "assigned_to",
        CATEGORY: "category",
        STATUS: "status",
        ISP: "cell_operator_name",
        "Connection Type": "connection_type",
        "Download Speed": "download_speed",
        "Upload Speed": "upload_speed",
        Latency: "latency",
        Loss: "loss",
        Jitter: "jitter",
        Province: "province",
        City: "city",
        District: "district",
        Subdistrict: "subdistrict",
        Timestamp: "timestamp",
        Source: "source_montel",
        Account: "account",
        Followers: "followers",
        Content: "content",
        URL: "url",
      },
    };
  },
  methods: {
    async fetchDownload() {
      let data = [];
      const payload = {
        cell_operator_type: this.operatorType,
        limit: -1,
        page: this.pagination.page,
        sort: "desc",
        start_date: this.date.startDate,
        end_date: this.date.endDate,
        cell_operator_id: this.selectOperator,
        app_id: this.app_id,
        ticket_status_id: this.selectStatus,
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
        search: this.search,
      };
      await fetch(process.env.VUE_APP_API_URL + `api/v1/id/ticket`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // data = result.data.data;
          result.data.data.forEach((item) => {
            data.push({
              ticket_number: item.ticket_number ? item.ticket_number : "-",
              date: item.open_at ? item.open_at : "-",
              subject: item.subject ? item.subject : "-",
              source: item.app.name ? item.app.name : "-",
              scope: item.source_data[0].app_table.name
                ? item.source_data[0].app_table.name
                : "-",
              assigned_to: item.cell_operator.name
                ? item.cell_operator.name
                : "-",
              category: item.category ? item.category : "-",
              status: item.ticket_status.name ? item.ticket_status.name : "-",
              cell_operator_name: item.source_data[0].cell_operator.name
                ? item.source_data[0].cell_operator.name
                : "-",
              connection_type: item.source_data[0].connection_type
                ? item.source_data[0].connection_type
                : "-",
              download_speed: item.source_data[0].download_speed
                ? item.source_data[0].download_speed
                : "-",
              upload_speed: item.source_data[0].upload_speed
                ? item.source_data[0].upload_speed
                : "-",
              latency: item.source_data[0].latency
                ? item.source_data[0].latency
                : "-",
              jitter: item.source_data[0].jitter
                ? item.source_data[0].jitter
                : "-",
              loss: item.source_data[0].loss ? item.source_data[0].loss : "-",
              province:
                item.province && item.province.name != null
                  ? item.province.name
                  : "-",
              city: item.city && item.city.name != null ? item.city.name : "-",
              district:
                item.district && item.district.name != null
                  ? item.district.name
                  : "-",
              subdistrict:
                item.district && item.sub_district.name != null
                  ? item.sub_district.name
                  : "-",
              timestamp: item.source_data[0].test_at
                ? item.source_data[0].test_at
                : "-",
              source_montel: item.source_data[0].source
                ? item.source_data[0].source
                : "-",
              account: item.source_data[0].account
                ? item.source_data[0].account
                : "-",
              followers: item.source_data[0].followers
                ? item.source_data[0].followers
                : "-",
              content: item.source_data[0].content
                ? item.source_data[0].content
                : "-",
              url: item.source_data[0].url ? item.source_data[0].url : "-",
            });
          });
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
    modalTicketingSummary() {
      this.summaryShow = true;
    },
  },
};
