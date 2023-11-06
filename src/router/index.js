import Vue from "vue";
import Router from "vue-router";
import store from "../store/index";
//Auth
import JwtServices from "../services/jwt.services";
import { GET_SETTING } from "../store/modules/auth.module";
//Pages
import Home from "../layouts/Home/Home.vue";
import LandingPage from "../views/pages/LandingPage/LandingPage.vue";
import DownloadPage from "../views/pages/DownloadPage/DownloadPage.vue";
import Error404 from "../views/pages/404.vue";
import AlarmDashboard from "../views/pages/AlarmDashboard/opsel/AlarmDashboard.vue";
import AlarmDashboardFO from "../views/pages/AlarmDashboard/fo/AlarmDashboardFO.vue";

import QoE from "../views/pages/Sigmon/QoE/QoE.vue";
import QoE_FO from "../views/pages/Sigmon/QoE FO/QoE_FO.vue";
import Availability from "../views/pages/Sigmon/Availability/Availability.vue";
import TicketingManagementCellular from "../views/pages/TicketingManagementSystem/Cellular/TicketingCellular.vue";
import TicketingManagementFO from "../views/pages/TicketingManagementSystem/Fo/TicketingFO.vue";
import Montel from "../views/pages/Montel/operator/Montel.vue";
import MontelFo from "../views/pages/Montel/fo/Montel.vue";

import QoS from "../views/pages/QoS/QoS.vue";
import MapTelcoInfra from "../views/pages/MapTelcoInfra/MapTelcoInfra.vue";
import AlarmDetails from "../views/pages/AlarmDetails/AlarmDetails.vue";
import UserManagement from "../views/pages/UserManagement/UserManagement.vue";
import UserProfile from "../views/pages/UserProfile/UserProfile.vue";
import SiteSettings from "../views/pages/SiteSettings/SiteSettings.vue";
import ActivityLog from "../views/pages/ActivityLog/ActivityLog.vue";
import StageLog from "../views/pages/StageLog/StageLog.vue";
import Backup from "../views/pages/Backup/Backup.vue";
import Province from "../views/pages/MasterData/Province/Province.vue";
import City from "../views/pages/MasterData/City/City.vue";
import District from "../views/pages/MasterData/District/District.vue";
import SubDistrict from "../views/pages/MasterData/SubDistrict/SubDistrict.vue";
import OperatorCellular from "../views/pages/MasterData/OperatorCellular/OperatorCellular.vue";
import ListApplication from "../views/pages/MasterData/ListApplication/ListApplication.vue";
import Maps from "../components/dashboard/NewMaps_V2.vue";
import Coverage from "../views/pages/QoS/Summary/Coverage.vue";
import SummaryTicketing from "../views/pages/SummaryTicketing/Version1/Ticketing.vue";
import SummaryTicketingV2 from "../views/pages/SummaryTicketing/Version2/TicketingV2.vue";
import Sigmon from "../views/pages/Sigmon/Summary/Sigmon.vue";
import SigmonV2 from "../views/pages/Sigmon/SummaryV2/SigmonV2.vue";
import NodeAlarm from "../views/pages/SummaryAlarmSeverity/NodeAlarm.vue";
import NodeAlarmFO from "../views/pages/SummaryAlarmSeverity/NodeAlarmFO.vue";
import AlarmStatus from "../views/pages/SummaryAlarmSeverity/AlarmStatusV1/AlarmStatusV1.vue";
import AlarmStatusV2 from "../views/pages/SummaryAlarmSeverity/AlarmStatusV2/AlarmStatusV2.vue";
import AnalysisDashboard from "../views/pages/AnalysisDashboard/AnalysisDashboard.vue";
import GISInfra from "../views/pages/GISInfra/GISInfra.vue";
import Auth from "../views/pages/auth/Auth.vue";
import Login from "../views/pages/auth/Login/Login.vue";
import ForgotPassword from "../views/pages/auth/ForgotPassword/ForgotPassword.vue";
import ChangePassword from "../views/pages/auth/ChangePassword/ChangePassword.vue";
import UserVerification from "../views/pages/auth/UserVerification/UserVerification.vue";
//Potensi Desa
import PotensiDesa from "../views/pages/PotensiDesa/PotensiDesa.vue";
import SubCategory from "../views/pages/PotensiDesa/sub-category/PotensiDesaSubcategory.vue";
import Category from "../views/pages/PotensiDesa/category/PotensiDesaCategory.vue";
import PotensiDesaDetails from "../views/pages/PotensiDesa/details-page/PotensiDesaDetails.vue";
import PotensiDesaCreate from "../views/pages/PotensiDesa/create-page/PotensiDesaCreate.vue";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/download-app",
    name: "download-app",
    component: DownloadPage,
    meta: { requiresAuth: true },
  },
  {
    path: "*",
    name: "404",
    component: Error404,
  },
  {
    path: "/dashboard",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        path: "telco-infra",
        name: "telco-infra",
        component: () => import("../views/pages/Dashboard/Dashboard.vue"),
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "alarm-dashboard",
        name: "alarm-dashboard",
        component: AlarmDashboard,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "fo/alarm-dashboard",
        name: "alarm-dashboard-v2",
        component: AlarmDashboardFO,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "quality-of-experience",
        name: "qoe",
        component: QoE,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "fo/quality-of-experience",
        name: "qoe-fo",
        component: QoE_FO,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "availability",
        name: "availability",
        component: Availability,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "map-analysis",
        name: "map-analysis",
        component: QoE,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "ticketing-management",
        name: "ticketing-management",
        component: TicketingManagementCellular,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "ticketing-management-fo",
        name: "ticketing-management-fo",
        component: TicketingManagementFO,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "montel",
        name: "montel",
        component: Montel,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "fo/montel",
        name: "montel",
        component: MontelFo,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "quality-of-service",
        name: "qos",
        component: QoS,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "map-telco-infra",
        name: "map-telco-infra",
        component: MapTelcoInfra,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "details",
        name: "details",
        component: AlarmDetails,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "potensi-desa",
        name: "potensi-desa",
        component: PotensiDesa,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: true,
          is_executive: false,
        },
      },
      {
        path: "potensi-desa/details/:id",
        name: "potensi-desa-details",
        component: PotensiDesaDetails,
      },
      {
        path: "potensi-desa/edit/:id",
        name: "potensi-desa-edit",
        component: PotensiDesaDetails,
      },
      {
        path: "potensi-desa/create",
        name: "potensi-desa-create",
        component: PotensiDesaCreate,
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    component: Home,
    children: [
      {
        path: "user-management",
        name: "usermanagement",
        component: UserManagement,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "/profile",
        name: "Profile",
        component: UserProfile,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "site-settings",
        name: "site-settings",
        component: SiteSettings,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "activity-log",
        name: "activity-log",
        component: ActivityLog,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "stage-log",
        name: "stage-log",
        component: StageLog,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "backup",
        name: "backup",
        component: Backup,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "province",
        name: "province",
        component: Province,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "city",
        name: "city",
        component: City,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "district",
        name: "district",
        component: District,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "sub-district",
        name: "sub-district",
        component: SubDistrict,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "network-operator",
        name: "network-operator",
        component: OperatorCellular,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "list-application",
        name: "list-application",
        component: ListApplication,
        meta: {
          requiresAuth: true,
          is_admin: true,
          is_operator: false,
          is_executive: false,
        },
      },
      {
        path: "sub-category",
        name: "sub-category",
        component: SubCategory,
      },
      {
        path: "category",
        name: "category",
        component: Category,
      },
    ],
  },
  {
    path: "/summary-maps",
    name: "Maps Summary",
    component: Maps,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/summary-qos",
    name: "Quality of Service & Quality of Experience Summary",
    component: Coverage,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/summary-ticketing",
    name: "Ticketing Summary",
    component: SummaryTicketing,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/fo/summary-ticketing",
    name: "Ticketing Summary Fixed Broadband",
    component: SummaryTicketingV2,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/summary-qoe",
    name: "Sigmon Summary",
    component: Sigmon,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/fo/summary-qoe",
    name: "Sigmon Summary Fixed Broadband",
    component: SigmonV2,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },

  {
    path: "/summary-alarm-operator",
    name: "Alarm Operator Summary",
    component: NodeAlarm,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/fo/summary-alarm-operator",
    name: "Alarm Operator Summary",
    component: NodeAlarmFO,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/summary-alarm-severity",
    name: "Alarm Severity Summary",
    component: AlarmStatus,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/fo/summary-alarm-severity",
    name: "Alarm Severity Summary - Fixed Broadband",
    component: AlarmStatusV2,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: true,
    },
  },
  {
    path: "/analysis",
    name: "Analysis Summary",
    component: AnalysisDashboard,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: true,
      is_executive: false,
    },
  },
  {
    path: "/gis-infra",
    name: "GIS Infra Dashboard",
    component: GISInfra,
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_operator: false,
      is_executive: true,
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    children: [
      {
        name: "Login",
        path: "login",
        component: Login,
        meta: {
          requiresAuth: false,
          is_admin: true,
          is_operator: true,
          is_executive: true,
        },
      },
      {
        name: "ForgotPassword",
        path: "forgot-password",
        component: ForgotPassword,
        meta: {
          requiresAuth: false,
          is_admin: true,
          is_operator: true,
          is_executive: true,
        },
      },
      {
        name: "ChangePassword",
        path: "change-password",
        component: ChangePassword,
        meta: {
          requiresAuth: false,
          is_admin: true,
          is_operator: true,
          is_executive: true,
        },
      },
      {
        name: "UserVerification",
        path: "user-verification",
        component: UserVerification,
        meta: {
          requiresAuth: false,
          is_admin: true,
          is_operator: true,
          is_executive: true,
        },
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../views/pages/Dashboard/Dashboard.vue"),
        meta: {
          requiresAuth: false,
          is_admin: true,
          is_operator: true,
          is_executive: true,
        }
      }
    ],
  },
  
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log(this.$store.$root)
  const user = JwtServices.getUser();
  let token = JwtServices.getToken() != null;
  // console.log(user, token)
  const isAuth = to.matched.some((record) => record.meta.requiresAuth);
  // console.log(JwtServices.getToken() != null);

  if (to.name == "Login" && token) {
    // Prevent user access login page
    console.log("You are already logged in");
    next({
      name: "LandingPage",
    });
  } else if (isAuth && user != null) {
    //In case the token was expired and need refresh token
    store.dispatch(GET_SETTING);
    next();
  } else {
    //User not authorized enter the page
    next();
  }
});

export default router;
