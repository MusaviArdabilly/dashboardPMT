import Profile from "../../../components/profile/Profile.vue";
import ChangePassword from "../../../components/profile/ChangePassword.vue";
import TermsAndConditions from "../../../components/profile/TermsandConditions.vue";

export default {
  components: { Profile, ChangePassword, TermsAndConditions },
  data: () => ({
    active_el: 1,

    component: Profile,
  }),
  computed: {
    settingMenu() {
      const settings_menu = [
        {
          id: 1,
          name: this.$t("ui.profile_page.profile"),
          icon: "mdi-account-outline",
          component: Profile,
        },
        {
          id: 2,
          name: this.$t("ui.profile_page.change_password"),
          icon: "mdi-lock",
          component: ChangePassword,
        },
        {
          id: 3,
          name: this.$t("ui.profile_page.terms_condition"),
          icon: "mdi-earth",
          component: TermsAndConditions,
        },
      ];
      return settings_menu;
    },
  },
  methods: {
    selectedMenu(id) {
      this.active_el = id;
      for (var item of this.settingMenu) {
        if (item.id == id) {
          this.component = item.component;
        }
      }
    },
  },
};
