<template>
  <div class="dashboard-nav">
    <v-card height="90" :elevation="elevation" flat class="pa-5 nav-card">
      <v-row class="flex-wrap">
        <v-col cols="6" lg="3" class="mt-2" v-if="globalFeature.searchBar">
          <v-autocomplete
            v-model="select"
            :loading="loading"
            :search-input.sync="searchMenu"
            :items="items"
            item-text="alias"
            return-object
            clearable
            outlined
            rounded
            dense
            solo
            hide-no-data
            prepend-inner-icon="mdi-magnify"
            class="mx-4 search-menu"
            background-color="white"
            :label="$t('ui.table_piece.search')"
          >
            <template v-slot:item="{ item }">
              <v-list-item link :to="{ name: item.to }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-show="false"
                    v-text="item.alias"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col class="mt-2" cols="6" lg="3" v-if="!globalFeature.searchBar">
          <v-btn
            class="blue--text"
            to="/"
            text
            elevation="0"
            color="transparent"
            plain
            ><v-icon class="mr-2">mdi-home</v-icon>
            {{ $t("general.menu.landing_page") }}</v-btn
          >
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3" md="4" lg="3" xl="3" class="mt-2 select-language">
          <v-select
            v-if="user != null"
            background-color="white"
            outlined
            rounded
            v-model="selected_language"
            :items="language"
            item-value="value"
            dense
            @change="changeLanguage"
          >
            <template v-slot:item="{ item }">
              <img class="select-flag" :src="item.image" :alt="item.value" />
              {{ item.name }}
            </template>
            <template v-slot:selection="{ item }">
              <img class="select-flag" :src="item.image" :alt="item.value" />
              {{ item.name }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="auto">
          <UserTopNav />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import UserTopNav from "../../components/UserTopNav.vue";
import UK from "../../assets/icon/flag/uk.png";
import ID from "../../assets/icon/flag/id.png";
import JwtService from "../../services/jwt.services";
import { mapMutations } from "vuex";

// Permission rules: 1=executive, 2=operator, 3=admin
export default {
  props: ["elevation"],
  components: { UserTopNav },
  data: () => ({
    loading: false,
    searchMenu: null,
    select: null,
    items: [],
    menuPMT: [
      {
        name: "Map",
        to: "summary-maps",
        alias: "map, executive",
        permission: 1,
      },
      {
        name: "GIS Infra Dashboard",
        to: "gis-infra",
        alias: "gis, infra",
        permission: 1,
      },
      {
        name: "Quality of Service & Quality of Experience Summary",
        to: "summary-qos",
        alias: "summary, qos",
        permission: 1,
      },
      {
        name: "Sigmon Summary",
        to: "summary-qoe",
        alias: "summary, qoe",
        permission: 1,
      },
      {
        name: "Ticketing Summary",
        to: "summary-ticketing",
        alias: "summary, ticketing",
        permission: 1,
      },
      {
        name: "Alarm Operator",
        to: "summary-alarm-operator",
        alias: "summary, alarm, operator",
        permission: 1,
      },
      {
        name: "Alarm Status",
        to: "summary-alarm-severity",
        alias: "summary, alarm, severity, status",
        permission: 1,
      },
      {
        name: "Alarm Dashboard",
        to: "alarm-dashboard",
        alias: "alarm, dashboard",
        permission: 2,
      },
      {
        name: "Sigmon Summary - Test Result",
        to: "qoe",
        alias: "summary, qoe, dashboard, quality of experience, test result",
        permission: 2,
      },
      {
        name: "Sigmon Summary - Availability",
        to: "availability",
        alias: "summary, qoe, dashboard, quality of experience, availability",
        permission: 2,
      },
      {
        name: "Quality of Service & Quality of Experience",
        to: "qos",
        alias: "summary, qos, dashboard, quality of service",
        permission: 2,
      },
      {
        name: "Montel Dashboard",
        to: "montel",
        alias: "montel, dashboard",
        permission: 2,
      },
      {
        name: "Analytic Dashboard",
        to: "Analysis Summary",
        alias: "analysis, summary",
        permission: 2,
      },
      {
        name: "Ticketing Management",
        to: "ticketing-management",
        alias: "ticketing, management",
        permission: 2,
      },
      {
        name: "User Management",
        to: "usermanagement",
        alias: "setting, user, management",
        permission: 3,
      },
      {
        name: "Site Settings",
        to: "site-settings",
        alias: "setting, site",
        permission: 3,
      },
      {
        name: "Activity Log",
        to: "activity-log",
        alias: "setting, activity, log",
        permission: 3,
      },
      {
        name: "Stage Log",
        to: "stage-log",
        alias: "setting, stage, log",
        permission: 3,
      },
      {
        name: "Backup",
        to: "backup",
        alias: "setting, backup",
        permission: 3,
      },
      {
        name: "Province",
        to: "province",
        alias: "setting, province",
        permission: 3,
      },
      {
        name: "City",
        to: "city",
        alias: "setting, city",
        permission: 3,
      },
      {
        name: "District",
        to: "district",
        alias: "setting, district",
        permission: 3,
      },
      {
        name: "Sub District",
        to: "sub-district",
        alias: "setting, sub district",
        permission: 3,
      },
      {
        name: "Network Operator",
        to: "operator-cellular",
        alias: "setting, operator, cellular, network",
        permission: 3,
      },
      {
        name: "List Application",
        to: "list-application",
        alias: "setting, list application",
        permission: 3,
      },
    ],
    user: null,
    selected_language: "",
    language: [
      {
        image: ID,
        value: "id",
        name: "Indonesia",
      },
      {
        image: UK,
        value: "en",
        name: "English",
      },
    ],
    active: false,
    completedSteps: 50,
    totalSteps: 100,
    user_token: null,
  }),
  mounted() {
    this.user = JwtService.getUser();
    this.user_token = JwtService.getToken();

    this.$i18n.locale = this.user.language;
    this.selected_language = this.user.language;
  },
  watch: {
    searchMenu(val) {
      this.items = [];

      // min 2 chars
      if (val.length <= 2) return;
      this.querySelections(val);
    },
  },

  methods: {
    ...mapMutations(["setUser"]),

    querySelections(v) {
      this.loading = true;
      this.items = this.menuPMT.filter((e) => {
        if (this.user.role == "executive" && e.permission > 1) {
          console.log("executive");
          return;
        }

        if (this.user.role == "operator" && e.permission > 2) {
          console.log("operator");
          return;
        }

        return (
          (e.alias || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
        );
      });

      this.loading = false;
    },

    addActive() {
      this.active = !this.active;
    },

    removeActive() {
      this.active = false;
    },

    changeLanguage() {
      this.$i18n.locale = this.selected_language;

      let data = {
        id: this.user.id,
        language: this.selected_language,
      };

      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/account/update-language`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${this.user_token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data);
          this.setUser(result.data);
          // localStorage.setItem("user", JSON.stringify(result.data));
          console.log(result.data);
          if (result.error == true) {
            this.$swal("Opps", result.message, "error");
          } else {
            this.$swal({
              text: result.message,
              timer: 1000,
              showConfirmButton: false,
              icon: "success",
            });
            location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.nav-card {
  margin-right: 2em;
  margin-left: 2em;
  margin-top: 2em;
  border-radius: 25px;
}

.select-flag {
  height: 2em;
  margin-right: 1em;
}
/* .nav-card,
.e-round-corner {
  border-radius: 20px;
} */

/* .input {
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 7px;
  border-radius: 20px;
  border: 1px solid #4a5759;
}

input:focus {
  outline: none !important;
} */

.search-menu {
  color: black;
}

.input-active {
  border: 1px solid red !important;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
}

.icon-time {
  margin-top: 5px;
}

.total-ticket,
.total-in-progress,
.total-complete {
  border-radius: 20px;
}

.total-ticket {
  background-image: linear-gradient(
    181deg,
    rgba(249, 97, 100, 1) 0.4%,
    rgba(250, 126, 129, 1) 89.6%
  );
  color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
}

.total-in-progress {
  background-image: radial-gradient(
    circle 465px at -15.1% -25%,
    rgba(17, 130, 193, 1) 0%,
    rgba(67, 166, 238, 1) 49%,
    rgba(126, 203, 244, 1) 90.2%
  );
  color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
}

.total-complete {
  background-image: linear-gradient(
    109.6deg,
    rgba(102, 203, 149, 1) 11.2%,
    rgba(39, 210, 175, 1) 98.7%
  );
  color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
}

.follow-up {
  margin-right: 7.5px;
}
.closed {
  margin-right: 34px;
}
.detail-btn {
  background-image: linear-gradient(to right, #1fa2ff 0%, #12d8fa 100%);
  color: white !important;
  box-shadow: 0 0 20px #eee;
  transition: 0.5s;
}

.detail-btn:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}

.select-language {
  width: 100px;
}
</style>
