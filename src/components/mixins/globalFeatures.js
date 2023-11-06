import JwtService from "../../services/jwt.services.js";

export const globalFeatures = {
  data() {
    return {};
  },
  computed: {
    globalFeature() {
      // Global common features :
      // searchBar: true,
      // sidebar: true,
      const features = {
        searchBar: true,
        sidebar: true,
      };
      if (JwtService.getUser().role == "admin-potensi-desa") {
        // const roleFeature = {
        //   searchBar: true,
        //   sidebar: true,
        // };
        // Object.assign(features, roleFeature);
        return features;
      } else if (JwtService.getUser().role == "executive") {
        return features;
      } else if (JwtService.getUser().role == "operator") {
        return features;
      } else if (JwtService.getUser().role == "viewer") {
        return features;
      } else if (JwtService.getUser().role == "map-viewer") {
        features.searchBar = false;
        features.sidebar = false;
        return features;
      } else {
        return features;
      }
    },
    sidebarRole() {
      const dashboardGroup = {
        groupTitle: this.$t("general.menu.dashboard"),
        list: [
          // {
          //   label: "Teleco Infra",
          //   link: "/dashboard/telco-infra",
          //   icon: "mdi-transmission-tower",
          // },
          {
            label: this.$t("general.menu.alarm_dashboard"),
            link: "/dashboard/alarm-dashboard",
            icon: "mdi-alarm-multiple",
          },
          {
            label: this.$t("general.menu.qoe_summary"),
            icon: "mdi-clipboard-check-multiple-outline",
            subitems_1: [
              {
                label: this.$t("general.menu.qoe_dashboard"),
                icon: "mdi-account-cog",
                link: "/dashboard/quality-of-experience",
              },
              {
                label: this.$t("general.menu.qoe_availability"),
                icon: "mdi-application-cog",
                link: "/dashboard/availability",
              },
            ],
          },
          {
            label: this.$t("general.menu.qos_dashboard"),
            link: "/dashboard/quality-of-service",
            icon: "mdi-text-box-check-outline",
          },
          {
            label: this.$t("general.menu.montel_dashboard"),
            icon: "mdi-monitor-dashboard",
            link: "/dashboard/montel",
          },
          {
            label: this.$t("general.menu.ticketing_management"),
            icon: "mdi-ticket-outline",
            link: "/dashboard/ticketing-management",
          },
          // {
          //   label: "Map Dashboard",
          //   icon: "mdi-map-marker-multiple-outline",
          //   link: "/dashboard/map-dashboard",
          // },
          {
            label: this.$t("general.menu.sub_district_potential"),
            link: "/dashboard/potensi-desa",
            icon: "mdi-text-box-multiple",
          },
        ],
      };
      const settingsGroup = {
        groupTitle: this.$t("general.menu.settings"),
        list: [
          {
            label: this.$t("general.menu.user_management"),
            icon: "mdi-account-cog",
            link: "/settings/user-management",
          },
          {
            label: this.$t("general.menu.site_settings"),
            icon: "mdi-application-cog",
            link: "/settings/site-settings",
          },
          {
            label: this.$t("general.menu.activity_log"),
            icon: "mdi-calendar-text",
            link: "/settings/activity-log",
          },
          {
            label: this.$t("general.menu.stage_log"),
            icon: "mdi-family-tree",
            link: "/settings/stage-log",
          },
          {
            label: this.$t("general.menu.backup"),
            icon: "mdi-cloud-upload-outline",
            link: "/settings/backup",
          },
          {
            label: "Master Data",
            icon: "mdi-database",
            subitems_1: [
              {
                label: this.$t("general.menu.province"),
                icon: "mdi-account-cog",
                link: "/settings/province",
              },
              {
                label: this.$t("general.menu.city"),
                icon: "mdi-application-cog",
                link: "/settings/city",
              },
              {
                label: this.$t("general.menu.district"),
                icon: "mdi-calendar-text",
                link: "/settings/district",
              },
              {
                label: this.$t("general.menu.sub_district"),
                icon: "mdi-cloud-upload-outline",
                link: "/settings/sub-district",
              },
              {
                label: this.$t("general.menu.network_operator"),
                icon: "mdi-cloud-upload-outline",
                link: "/settings/network-operator",
              },
              {
                label: this.$t("general.menu.list_application"),
                icon: "mdi-cloud-upload-outline",
                link: "/settings/list-application",
              },
              {
                label: this.$t("general.menu.sub_district_potential"),
                type: "sub-group",
                subitems_2: [
                  {
                    label: this.$t(
                      "general.menu.sub_district_potential_category"
                    ),
                    link: "/settings/category",
                  },
                  {
                    label: this.$t(
                      "general.menu.sub_district_potential_sub-category"
                    ),
                    link: "/settings/sub-category",
                  },
                ],
              },
            ],
          },
        ],
      };
      if (JwtService.getUser().role == "executive") {
        const mergeMenu = [
          {
            groupTitle: dashboardGroup.groupTitle,
            list: [
              dashboardGroup.list[0],
              dashboardGroup.list[1],
              dashboardGroup.list[2],
              dashboardGroup.list[3],
              dashboardGroup.list[4],
              dashboardGroup.list[5],
            ],
          },
        ];
        return mergeMenu;
      } else if (JwtService.getUser().role == "operator") {
        const mergeMenu = [
          {
            groupTitle: dashboardGroup.groupTitle,
            list: [
              dashboardGroup.list[0],
              dashboardGroup.list[1],
              dashboardGroup.list[2],
              dashboardGroup.list[3],
              dashboardGroup.list[4],
              dashboardGroup.list[5],
            ],
          },
        ];
        return mergeMenu;
      } else if (JwtService.getUser().role == "admin-potensi-desa") {
        const mergeMenu = [
          {
            groupTitle: dashboardGroup.groupTitle,
            list: [dashboardGroup.list[5]],
          },
          {
            groupTitle: settingsGroup.groupTitle,
            list: [
              settingsGroup.list[2],
              {
                label: settingsGroup.list[5].label,
                icon: settingsGroup.list[5].icon,
                subitems_1: [
                  settingsGroup.list[5].subitems_1[0],
                  settingsGroup.list[5].subitems_1[6],
                ],
              },
            ],
          },
        ];
        return mergeMenu;
      } else if (JwtService.getUser().role == "viewer") {
        const mergeMenu = [
          {
            groupTitle: dashboardGroup.groupTitle,
            list: [
              dashboardGroup.list[0],
              dashboardGroup.list[1],
              dashboardGroup.list[2],
              dashboardGroup.list[3],
              dashboardGroup.list[5],
            ],
          },
        ];
        return mergeMenu;
      } else {
        const mergeMenu = [dashboardGroup, settingsGroup];
        return mergeMenu;
      }
    },
    landingMenuRole() {
      // Mapping the menu by role
      const list = [
        {
          name: this.$t("landing.body.map"),
          url: this.directToMap,
          icon: require("../../assets/image/landing-page-map.svg"),
          title: this.$t("general.menu.map"),
        },
        {
          name: this.$t("landing.body.executive_dashboard"),
          url: null,
          icon: require("../../assets/image/executive-dashboard.svg"),
          title: this.$t("general.menu.executive_dashboard"),
        },
        {
          name: this.$t("landing.body.operator"),
          url: null,
          icon: require("../../assets/image/map-dashboard.svg"),
          title: this.$t("general.menu.operator"),
        },
        {
          name: this.$t("landing.body.analysis_dashboard"),
          url: "/analysis",
          icon: require("../../assets/image/analytic-dashboard.svg"),
          title: this.$t("general.menu.analytics_dashboard"),
        },
        {
          name: this.$t("landing.body.ticket_management_system"),
          url: "/dashboard/ticketing-management",
          icon: require("../../assets/image/ticketing.svg"),
          title: this.$t("general.menu.ticketing_management_system"),
        },
      ];
      // store menu on an array
      const listMapped = [];
      if (JwtService.getUser().role == "admin-potensi-desa") {
        listMapped.push(list[0], list[2]);
        return listMapped;
      } else if (JwtService.getUser().role == "executive") {
        listMapped.push(list[0], list[1]);
        return listMapped;
      } else if (JwtService.getUser().role == "operator") {
        listMapped.push(list[0], list[2], list[3], list[4]);
        return listMapped;
      } else if (JwtService.getUser().role == "viewer") {
        listMapped.push(list[0], list[1], list[2], list[3]);
        return listMapped;
      } else if (JwtService.getUser().role == "map-viewer") {
        listMapped.push(list[0]);
        return listMapped;
      } else {
        return list;
      }
    },
    footerMenuRole() {
      const list = [
        {
          title: this.$t("landing.footer.create_user"),
          icon: "mdi-account-plus-outline",
          ownDialog: true,
          dialogName: "dialog",
        },
        {
          title: this.$t("landing.footer.module"),
          icon: "mdi-cog",
          ownDialog: false,
          dialogName: this.$t("general.menu.admin_settings"),
        },
        {
          title: this.$t("landing.footer.docs"),
          icon: "mdi-download",
          ownDialog: true,
          dialogName: "showDownload",
        },
        // {
        //   title: this.$t("landing.footer.contact_us"),
        //   icon: "mdi-face-agent",
        // },
      ];
      // store menu on an array
      const listMapped = [];
      if (JwtService.getUser().role == "admin-potensi-desa") {
        listMapped.push(list[0], list[2]);
        return listMapped;
      } else if (JwtService.getUser().role == "executive") {
        listMapped.push(list[2]);
        return listMapped;
      } else if (JwtService.getUser().role == "operator") {
        listMapped.push(list[2]);
        return listMapped;
      } else if (JwtService.getUser().role == "viewer") {
        return listMapped;
      } else if (JwtService.getUser().role == "map-viewer") {
        return listMapped;
      } else {
        return list;
      }
    },
    isOperator() {
      let iamOperator = false;
      if (JwtService.getUser().role == "operator") {
        iamOperator = true;
        return iamOperator;
      } else {
        return iamOperator;
      }
    },
    isExecutive() {
      let iamExecutive = false;
      if (JwtService.getUser().role == "executive") {
        iamExecutive = true;
        return iamExecutive;
      } else {
        return iamExecutive;
      }
    },
    isViewer() {
      let iamViewer = false;
      if (JwtService.getUser().role == "viewer") {
        iamViewer = true;
        return iamViewer;
      } else {
        return iamViewer;
      }
    },
  },
};
