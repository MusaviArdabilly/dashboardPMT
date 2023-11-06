import moment from "moment/moment";
import NavbarBigScreen from "../../../../layouts/NavbarFull/NavbarBigScreen.vue";
import NavigationCellAndFo from "../../../../components/navigation/CellularAndFo/NavigationCellAndFo.vue";

export default {
  components: { NavbarBigScreen, NavigationCellAndFo },
  data() {
    return {
      filter: {
        picker: {
          datepicker1: false,
          datepicker2: false,
        },
        date: {
          startDate: new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .substr(0, 10),
          endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          default: true,
          defaultText: "All Time",
        },
        testUnit: {
          value: "avgSpeedUpload",
        },
        orderAverage: {
          value: "desc",
        },
        orderOperator: {
          value: 0,
          searchOperator: "",
        },
        location: {
          province: 0,
          searchProvince: "",
        },
      },
      items: {
        testUnit: [
          { name: "Speedtest (Upload)", value: "avgSpeedUpload" },
          { name: "Speedtest (Download)", value: "avgSpeedDownload" },
          { name: "Webtest", value: "avgWeb" },
          { name: "Videotest", value: "avgVideo" },
        ],
        orderAverage: [
          { name: "Sort by Highest", value: "desc" },
          { name: "Sort by Lowest", value: "asc" },
        ],
      },
      slide: {
        province: 0,
        breakpoint: 0,
        breakpointProvince: 0,
        cycle: {
          all: false,
          province: false,
        },
      },
      input: {
        isDisabled: true,
      },
    };
  },
  watch: {
    // foLoading(value) {
    //   if (!value) {
    //     this.input.isDisabled = false;
    //   } else {
    //     this.input.isDisabled = true;
    //   }
    // },
    // loadingSummary(value) {
    //   if (!value) {
    //     this.input.isDisabled = false;
    //   } else {
    //     this.input.isDisabled = true;
    //   }
    // },
    loadingSummaryFoProvince(value) {
      if (!value) {
        this.input.isDisabled = false;
        this.slide.cycle.all = true;
        this.slide.cycle.province = true;
      } else {
        this.input.isDisabled = true;
        this.slide.cycle.all = false;
        this.slide.cycle.province = false;
      }
    },
  },
  computed: {
    filterComputed: {
      //convert html standard datetime value into local time
      get() {
        return {
          preview: {
            startDate: moment(this.filter.date.startDate)
              .locale("id-ID")
              .format("DD-MM-YYYY"),
            endDate: moment(this.filter.date.endDate)
              .locale("id-ID")
              .format("DD-MM-YYYY"),
          },
        };
      },
    },
    avgCards() {
      return this.$store.getters.avgCards;
    },
    foLoading() {
      return this.$store.getters.foLoading;
    },
    loadingSummary() {
      return this.$store.getters.loadingSummaryFo;
    },
    loadingSummaryFoProvince() {
      return this.$store.getters.loadingSummaryFoProvince;
    },
    itemProvince() {
      return this.$store.getters.item_province;
    },
    itemOperator() {
      return this.$store.getters.item_opselFo;
    },
    slideItem() {
      return this.$store.getters.avgSummaryData;
    },
    slideProvince() {
      return this.$store.getters.avgSummaryDataByProvince;
    },
    slideExample() {
      return this.$store.getters.slideExample;
    },
    defaultPayload() {
      return this.$store.getters.defaultPayloadSigmon.single;
    },
    defaultPayloadProvince() {
      return this.$store.getters.defaultPayloadSigmon.byProvince;
    },
    columns() {
      if (this.$vuetify.breakpoint.xl) {
        return 6;
      }

      if (this.$vuetify.breakpoint.lg) {
        return 2;
      }

      if (this.$vuetify.breakpoint.md) {
        return 2;
      }

      return 1;
    },
  },
  methods: {
    initialize() {
      this.$store.commit("setFoLoading", true);
      this.$store.commit("setLoadingSummaryFo", true);
      this.$store.commit("setLoadingSummaryFoProvince", true);
      this.$store.dispatch("getAvgCards");
      // fetch data : Provinsi
      this.$store.dispatch("getProvince");
      // fetch data : Opsel
      this.$store.dispatch("getOpselFo");
      //fetch at first created
      this.$store.dispatch("getAvgSpeedFo", this.defaultPayload);
      this.$store.dispatch("getAvgByProvince", this.defaultPayloadProvince);
    },
    changeSummary() {
      if (this.filter.testUnit.value == "avgSpeedUpload") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_upload_speed",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.$store.commit("setLoadingSummaryFo", true);
        this.changeSummaryByProvince();
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgSpeedFo", payload);
        this.slide.breakpoint = 0;
      } else if (this.filter.testUnit.value == "avgSpeedDownload") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_download_speed",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.$store.commit("setLoadingSummaryFo", true);
        this.changeSummaryByProvince();
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgSpeedFo", payload);
        this.slide.breakpoint = 0;
      } else if (this.filter.testUnit.value == "avgWeb") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_throughput",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          search: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.$store.commit("setLoadingSummaryFo", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgWebFo", payload);
        this.slide.breakpoint = 0;
      } else if (this.filter.testUnit.value == "avgVideo") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_throughput",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          search: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.slide.breakpoint = 0;
        this.$store.commit("setLoadingSummaryFo", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgVideoFo", payload);
      }
    },
    changeSummaryOnlyOperator() {
      if (this.filter.testUnit.value == "avgSpeedUpload") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_upload_speed",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.$store.commit("setLoadingSummaryFo", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgSpeedFo", payload);
        this.slide.breakpoint = 0;
      } else if (this.filter.testUnit.value == "avgSpeedDownload") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_download_speed",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.$store.commit("setLoadingSummaryFo", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgSpeedFo", payload);
        this.slide.breakpoint = 0;
      } else if (this.filter.testUnit.value == "avgWeb") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_throughput",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          search: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.$store.commit("setLoadingSummaryFo", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgWebFo", payload);
        this.slide.breakpoint = 0;
      } else if (this.filter.testUnit.value == "avgVideo") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_throughput",
          order: this.filter.orderAverage.value,
          start_date: "",
          end_date: "",
          search: "",
          cell_operator_id: this.filter.orderOperator.value,
        };
        this.slide.breakpoint = 0;
        this.$store.commit("setLoadingSummaryFo", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgVideoFo", payload);
      }
    },
    changeSummaryClick() {
      //User not change the date range filter
      if (this.filter.date.default == true) {
        this.$swal({
          title: this.$t("ui.message.date_range"),
          icon: "info",
          confirmButtonColor: "#134889",
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        //User change the date range filter

        //Filter is set by test unit value
        if (this.filter.testUnit.value == "avgSpeedUpload") {
          const payload = {
            network_type: 2,
            status: "active",
            sort: "avg_upload_speed",
            order: this.filter.orderAverage.value,
            start_date: this.filter.date.startDate,
            end_date: this.filter.date.endDate,
            search: "",
            cell_operator_id: this.filter.orderOperator.value,
          };
          this.$store.commit("setLoadingSummaryFo", true);
          this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
          this.$store.dispatch("getAvgSpeedFo", payload);
          this.slide.breakpoint = 0;
        } else if (this.filter.testUnit.value == "avgSpeedDownload") {
          const payload = {
            network_type: 2,
            status: "active",
            sort: "avg_download_speed",
            order: this.filter.orderAverage.value,
            start_date: this.filter.date.startDate,
            end_date: this.filter.date.endDate,
            search: "",
            cell_operator_id: this.filter.orderOperator.value,
          };
          this.$store.commit("setLoadingSummaryFo", true);
          this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
          this.$store.dispatch("getAvgSpeedFo", payload);
          this.slide.breakpoint = 0;
        } else if (this.filter.testUnit.value == "avgWeb") {
          const payload = {
            network_type: 2,
            status: "active",
            sort: "avg_throughput",
            order: this.filter.orderAverage.value,
            start_date: this.filter.date.startDate,
            end_date: this.filter.date.endDate,
            search: "",
            cell_operator_id: this.filter.orderOperator.value,
          };
          this.$store.commit("setLoadingSummaryFo", true);
          this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
          this.$store.dispatch("getAvgWebFo", payload);
          this.slide.breakpoint = 0;
        } else if (this.filter.testUnit.value == "avgVideo") {
          const payload = {
            network_type: 2,
            status: "active",
            sort: "avg_throughput",
            order: this.filter.orderAverage.value,
            start_date: this.filter.date.startDate,
            end_date: this.filter.date.endDate,
            search: "",
            cell_operator_id: this.filter.orderOperator.value,
          };
          this.slide.breakpoint = 0;
          this.$store.commit("setLoadingSummaryFo", true);
          this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
          this.$store.dispatch("getAvgVideoFo", payload);
        }
      }
    },
    changeSummaryByProvince() {
      if (this.filter.testUnit.value == "avgSpeedUpload") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_upload_speed",
          order: this.filter.orderAverage.value,
          province_id: this.filter.location.province,
        };
        this.$store.commit("setLoadingSummaryFoProvince", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgByProvince", payload);
        this.slide.breakpointProvince = 0;
      } else if (this.filter.testUnit.value == "avgSpeedDownload") {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_download_speed",
          order: this.filter.orderAverage.value,
          province_id: this.filter.location.province,
        };
        this.$store.commit("setLoadingSummaryFoProvince", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgByProvince", payload);
        this.slide.breakpointProvince = 0;
      } else {
        const payload = {
          network_type: 2,
          status: "active",
          sort: "avg_upload_speed",
          order: this.filter.orderAverage.value,
          province_id: this.filter.location.province,
        };
        this.$store.commit("setLoadingSummaryFoProvince", true);
        this.$store.commit("setSelectedSummary", this.filter.testUnit.value);
        this.$store.dispatch("getAvgByProvince", payload);
        this.slide.breakpointProvince = 0;
      }
    },
    filterDate() {
      this.filter.date.default = false;
    },
  },
  created() {
    this.initialize();
  },
  mounted() {
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Avatel")};color:#fff`
    // );
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Brutelkom")};color:#fff`
    // );
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Cloritelcom")};color:#fff`
    // );
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Dartelecom")};color:#fff`
    // );
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Evencell")};color:#fff`
    // );
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Fifthcell")};color:#fff`
    // );
    // console.log(
    //   "%c text",
    //   `background:${this.avatarBackground("Garytelcom")};color:#fff`
    // );
  },
};
