import JwtService from "../../services/jwt.services";
// import AppBars from "../../components/AppBars.vue";

export default {
  data: () => ({
    user: null,
    executive_dashboard: [
      // {
      //   title: "Teleco Infra",
      //   link: "/dashboard/telco-infra",
      //   icon: "mdi-transmission-tower",
      // },
      {
        title: "Alarm Dashboard",
        link: "/dashboard/alarm-dashboard",
        icon: "mdi-alarm-multiple",
      },
    ],

    qoe_list: [
      {
        title: "Sigmon Summary",
        icon: "mdi-clipboard-check-multiple-outline",
        items: [
          {
            title: "Test Result",
            icon: "mdi-account-cog",
            link: "/dashboard/quality-of-experience",
          },
          {
            title: "Availability",
            icon: "mdi-application-cog",
            link: "/dashboard/availability",
          },
        ],
      },
    ],

    executive_list: [
      {
        title: "Quality of Service & Quality of Experience ",
        link: "/dashboard/quality-of-service",
        icon: "mdi-text-box-check-outline",
      },

      {
        title: "MonTel Dashboard",
        icon: "mdi-monitor-dashboard",
        link: "/dashboard/montel",
      },
      {
        title: "Ticketing Management",
        icon: "mdi-ticket-outline",
        link: "/dashboard/ticketing-management",
      },
      // {
      //   title: "Map Dashboard",
      //   icon: "mdi-map-marker-multiple-outline",
      //   link: "/dashboard/map-dashboard",
      // },
    ],

    setting_items: [
      {
        title: "User Management",
        icon: "mdi-account-cog",
        link: "/settings/user-management",
      },
      {
        title: "Site Setting",
        icon: "mdi-application-cog",
        link: "/settings/site-settings",
      },
      {
        title: "Activity Log",
        icon: "mdi-calendar-text",
        link: "/settings/activity-log",
      },
      {
        title: "Stage Log",
        icon: "mdi-family-tree",
        link: "/settings/stage-log",
      },
      {
        title: "Backup",
        icon: "mdi-cloud-upload-outline",
        link: "/settings/backup",
      },
    ],

    master_data: [
      {
        title: "Master Data",
        icon: "mdi-database",
        items: [
          {
            title: "Province",
            icon: "mdi-account-cog",
            link: "/settings/province",
          },
          {
            title: "City",
            icon: "mdi-application-cog",
            link: "/settings/city",
          },
          {
            title: "District",
            icon: "mdi-calendar-text",
            link: "/settings/district",
          },
          {
            title: "Sub-Disrict",
            icon: "mdi-cloud-upload-outline",
            link: "/settings/sub-district",
          },
          {
            title: "Network Operator",
            icon: "mdi-cloud-upload-outline",
            link: "/settings/operator-cellular",
          },
          {
            title: "List Application",
            icon: "mdi-cloud-upload-outline",
            link: "/settings/list-application",
          },
          {
            title: "Potensi Desa",
            type: "sub-group",
            items: [
              {
                title: "Category",
                link: "/settings/category",
              },
              {
                title: "Sub-Category",
                link: "/settings/sub-category",
              },
            ],
          },
        ],
      },
    ],
    potensi_desa: [
      {
        title: "Potensi Desa",
        items: [
          {
            title: "Category",
            link: "",
          },
          {
            title: "Sub-Category",
            link: "",
          },
        ],
      },
    ],
    activeItem: "Executive Dashboard",
  }),
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
  },
  mounted() {
    this.user = JwtService.getUser();
    if (this.user == null) {
      this.$swal(
        "Opps",
        this.$t("general.message.error.need_login"),
        "warning"
      );
      this.$router.push({ name: "Login" });
      return;
    }

    // this.user = JSON.parse(localStorage.getItem("user"));
    // console.log(this.user.role);
  },
  created() {
    this.setActive(this.$route.path);
    this.isActive(this.$route.path);
  },
};
