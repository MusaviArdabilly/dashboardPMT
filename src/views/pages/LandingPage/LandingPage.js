import NavBar from "../../../layouts/NavbarSearch/NavBar.vue";
import { ADD_ON_BOARDING } from "../../../store/modules/executive_navigation.module";
import JwtService from "../../../services/jwt.services";
import { AUTH_SIGNOUT } from "../../../store/modules/auth.module";

export default {
  components: { NavBar },
  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    user: {
      first_name: "",
    },
    showDownload: false,
    navigationModal: false,
    drawer: false,
    selected_modal: [],
    modal_title: "",
    is_viewer: false,
    items: [],
    setting: {},
    dialog: false,
    rules: [(value) => !!value || "Required"],
    user_token: null,
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    department: [],
    role: [],
    show: false,
    selected_department: "",
    selected_role: "",
    selected_status: "",
    list_status: [
      {
        name: "Semua",
        value: "",
      },
      {
        name: "Aktif",
        value: "true",
      },
      {
        name: "Non-Aktif",
        value: "false",
      },
    ],
    alert: false,
    loading_overlay: false,
    valid: true,
    network_operator: [],
    selected_network_operator: 0,
    link: [],
  }),
  computed: {
    directToMap() {
      return this.$store.getters.settingByName.value;
    },
  },
  methods: {
    getSetting() {
      const data = {
        name: "web_version",
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/setting/findbyname`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => {
          if (response.status == 401) {
            this.logout();
            return;
          }
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          if (result.error == false) {
            this.setting = result.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    logout() {
      // localStorage.removeItem("user");
      this.$store.dispatch(AUTH_SIGNOUT, this.user.id);

      this.$router.push({ name: "Login" });
    },
    actionLandingDialog(value) {
      this.modal_title = value;
      for (let item of this.items) {
        if (item.title == value) {
          this.selected_modal = item.data;
          this.navigationModal = true;
        }
      }
    },
    actionFooterDialog(value) {
      if (value == "dialog") {
        this.dialog = true;
      } else if (value == "showDownload") {
        this.showDownload = true;
      }
    },
    executiveNavigation(id, value) {
      // console.log(value);
      if (value == "GIS Infra Dashboard") {
        const route = this.$router.resolve({ name: value });
        window.open(route.href, "_blank");
      } else {
        if (id != undefined) {
          this.$store
            .dispatch(ADD_ON_BOARDING, id)
            .then(() => this.$router.push({ name: "Summary Dashboard" }));
        } else {
          this.$router.push(value);
        }
      }
    },

    fetchFooterItems() {
      // menu item list
      this.items = [
        {
          title: this.$t("general.menu.executive_dashboard"),
          data: [
            {
              name: this.$t("general.menu.coverage_throughput_performance"),
              link: "/summary-qos",
            },
            {
              name: this.$t("general.menu.public_opinion_satisfaction"),
              link: "/summary-qoe",
            },
            {
              name: this.$t("general.menu.ticketing_summary"),
              link: "/summary-ticketing",
            },
            {
              name: this.$t("general.menu.operator_alarm"),
              link: "/summary-alarm-operator",
            },
            {
              name: this.$t("general.menu.alarm_status"),
              link: "/summary-alarm-severity",
            },
          ],
        },
        {
          title: this.$t("general.menu.operator"),
          data: [
            // {
            //   name: this.$t("general.menu.telco_infra_dashboard"),
            //   link: "/dashboard/telco-infra",
            // },
            {
              name: this.$t("general.menu.alarm_dashboard"),
              link: "/dashboard/alarm-dashboard",
            },
            {
              name: this.$t("general.menu.qoe_dashboard"),
              link: "/dashboard/quality-of-experience",
            },
            {
              name: this.$t("general.menu.qoe_availability"),
              link: "/dashboard/availability",
            },
            {
              name: this.$t("general.menu.qos_dashboard"),
              link: "/dashboard/quality-of-service",
            },
            {
              name: this.$t("general.menu.montel_dashboard"),
              link: "/dashboard/montel",
            },
            {
              name: this.$t("general.menu.sub_district_potential"),
              link: "/dashboard/potensi-desa",
            },
          ],
        },
        {
          title: this.$t("general.menu.ticketing_management_system"),
          data: [
            {
              name: this.$t("general.menu.ticketing_management_system"),
              link: "/dashboard/ticketing-management",
            },
          ],
        },
        {
          title: this.$t("general.menu.analytics_dashboard"),
          data: [
            {
              name: this.$t("general.menu.analytics_dashboard"),
              link: "/dashboard/analysis",
            },
          ],
        },
        {
          title: this.$t("general.menu.admin_settings"),
          data: [
            {
              name: this.$t("general.menu.user_management"),
              link: "/settings/user-management",
            },
            {
              name: this.$t("general.menu.site_settings"),
              link: "/settings/site-settings",
            },
            {
              name: this.$t("general.menu.activity_log"),
              link: "/settings/activity-log",
            },
            {
              name: this.$t("general.menu.stage_log"),
              link: "/settings/stage-log",
            },
            {
              name: this.$t("general.menu.backup"),
              link: "/settings/backup",
            },
            {
              name: this.$t("general.menu.province"),
              link: "/settings/province",
            },
            {
              name: this.$t("general.menu.city"),
              link: "/settings/city",
            },
            {
              name: this.$t("general.menu.district"),
              link: "/settings/district",
            },
            {
              name: this.$t("general.menu.sub_district"),
              link: "/settings/sub-district",
            },
            {
              name: this.$t("general.menu.network_operator"),
              link: "/settings/network-operator",
            },
            {
              name: this.$t("general.menu.list_application"),
              link: "/settings/list-application",
            },
            {
              name: this.$t("general.menu.sub_district_potential_category"),
              link: "/settings/category",
            },
            {
              name: this.$t("general.menu.sub_district_potential_sub-category"),
              link: "/settings/sub-category",
            },
          ],
        },
      ];
      if (JwtService.getUser().role == "executive") {
        this.items[0].data.push({
          name: this.$t("general.menu.sub_district_potential"),
          link: "/dashboard/potensi-desa",
        });
      } else if (JwtService.getUser().role == "admin-potensi-desa") {
        this.items[1].data.splice(0, 5);
      }
    },

    getDepartment() {
      fetch(
        process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/position`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.department = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getRole() {
      fetch(process.env.VUE_APP_API_URL + `api/v1/${this.user.language}/role`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.user_token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.role = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    createUser() {
      // vue-validate function call
      const formValidate = this.$refs.formcreate.validate();
      if (!formValidate) {
        return;
      } else {
        this.loading_overlay = true;
        const data = {
          username: this.username,
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          department: this.selected_department.path,
          role: this.selected_role,
          network_operator_id: this.selected_network_operator,
          is_viewer: this.is_viewer,
        };
        // console.log(data, "data payload");

        fetch(
          process.env.VUE_APP_API_URL +
            `api/v1/${this.user.language}/account/add`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.user_token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            // console.log(result, "result create user");
            this.loading_overlay = false;
            if (result.error) {
              this.$swal({
                text: result.message,
                timer: 1000,
                showConfirmButton: false,
                icon: "error",
              });
              return;
            }
            this.username = "";
            this.firstname = "";
            this.lastname = "";
            this.email = "";
            this.password = "";
            this.selected_department = "";
            this.selected_role = "";
            this.is_viewer = false;
            this.$refs.formcreate.resetValidation();
            if (result.error == false) {
              this.dialog = false;
              // this.data = [];
              // this.initialize();
            }
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            this.loading_overlay = false;
          });
      }
    },

    getNetworkOperator() {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
      };
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/cell-operator`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.user_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.network_operator = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSettingByName(payload) {
      return new Promise((resolve, reject) => {
        fetch(process.env.VUE_APP_API_URL + `api/v2/id/setting/findbyname`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            if (result.error != true) {
              resolve(result.data);
            } else {
              reject(result.message);
            }
            // console.log(this.link_download_ios);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
  async mounted() {
    this.user = JwtService.getUser();
    if (this.user == null) {
      // this.$swal(
      //   "Opps",
      //   this.$t("general.message.error.need_login"),
      //   "warning"
      // );
      this.$router.push({ name: "Login" });
      return;
    }
    this.user_token = JwtService.getToken();

    this.$i18n.locale = this.user.language;
    const name = {
      name: "route_map",
    };
    this.$store.dispatch("getSettingsByName", name);
    this.fetchFooterItems();
    this.getDepartment();
    this.getRole();
    this.getSetting();
    this.getNetworkOperator();
    const getAndroid = {
      name: "link_download_android",
    };
    await this.getSettingByName(getAndroid).then((results) => {
      const construct = {
        image: require("../../../assets/image/download/downloadandroid.png"),
        link: results.data.value,
        item: results.data.description,
      };
      this.link.push(construct);
    });
    const getIOS = {
      name: "link_download_ios",
    };
    await this.getSettingByName(getIOS).then((results) => {
      const construct = {
        image: require("../../../assets/image/download/downloadios.png"),
        link: `itms-services://?action=download-manifest&url=${results.data.value}`,
        title: results.data.description,
      };
      this.link.push(construct);
    });
    const getManualBookWeb = {
      name: "link_download_manual_book_web",
    };
    await this.getSettingByName(getManualBookWeb).then((results) => {
      const construct = {
        image: "",
        link: results.data.value,
        title: "Manual Book Web",
      };
      this.link.push(construct);
    });
    const getManualBookMobile = {
      name: "link_download_manual_book_mobile",
    };
    await this.getSettingByName(getManualBookMobile).then((results) => {
      const construct = {
        image: "",
        link: results.data.value,
        title: "Manual Book Mobile",
      };
      this.link.push(construct);
    });
    const getManualBookCMS = {
      name: "link_download_manual_book_cms",
    };
    await this.getSettingByName(getManualBookCMS).then((results) => {
      const construct = {
        image: "",
        link: results.data.value,
        title: "Manual Book CMS",
      };
      this.link.push(construct);
    });
  },
};
