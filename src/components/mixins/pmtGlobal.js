import JwtService from "../../services/jwt.services.js";
export const pmtGlobal = {
  data() {
    return {
      thisGlobalMixins: "yes",
    };
  },
  computed: {
    colorList() {
      return this.$store.getters.colorList;
    },
    userData: {
      get() {
        return JwtService.getUser();
      },
    },
  },
  methods: {
    avatarBackground(value) {
      let requestText = value.toLowerCase();
      let separateText = requestText.split("");
      let sum = 0;
      for (const i of separateText) {
        sum += requestText.charCodeAt(i);
      }
      const percentage = sum % this.colorList.length;
      return this.colorList[percentage];
    },
    stringInitial(value) {
      let str = value;
      let matches = str.match(/\b(\w)/g);
      let acronym = matches.join("");
      return acronym.slice(0, 2);
    },
  },
  created() {},
};
