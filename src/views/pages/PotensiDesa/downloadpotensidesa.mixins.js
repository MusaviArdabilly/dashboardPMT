import JwtService from "../../../services/jwt.services";
export const mixinsPotensiDesaDownload = {
  data() {
    return {
      filterDownload: {
        province: 0,
        searchProvince: "",
        city: 0,
        searchCity: "",
        selectCity: true,
        district: 0,
        searchDistrict: "",
        selectDistrict: true,
        subDistrict: 0,
        searchSubDistrict: "",
        selectSubDistrict: true,
      },
      rules: {
        required: (value) => !!value || "Required.",
      },
      disableAddField: true,
      disabledRemoveField: true,
      submitToDownload: true,
      usedCategories: [],
      dynamicfield: [
        {
          id: 0,
          code_category: "",
          selectCategory: true,
          selectReadonly: false,
          code_subcategory: [],
        },
      ],
      nextField: 1,
    };
  },
  computed: {
    itemCategorySettle: {
      get() {
        const ex = this.itemCategory.filter((item) => {
          return !this.usedCategories.includes(item.id);
        });
        return ex;
      },
    },
    itemCategory() {
      return this.$store.getters.getPotensiDesaCategory.data;
    },
    setTableCategoryParams() {
      const payload = {
        limit: -1,
      };
      return payload;
    },
    locationFilterDownload() {
      const location = [["province_id", this.filterDownload.province]];
      if (this.filterDownload.city != 0) {
        location.push(["city_id", this.filterDownload.city]);
      }
      if (this.filterDownload.district != 0) {
        location.push(["district_id", this.filterDownload.district]);
      }
      if (this.filterDownload.subDistrict != 0) {
        location.push(["sub_district_id", this.filterDownload.subDistrict]);
      }
      return location;
    },
    categoryFilterDownload() {
      // const category = this.dynamicfield.map(
      //   ({ code_category, code_subcategory }) => [
      //     [("category_id", code_category)],
      //     ["sub_category_id", "in", code_subcategory],
      //   ]
      // );
      const category = this.dynamicfield.map(function (item, index) {
        // if item id is 0, then return item.category_id and item.sub_category_id
        // console.log(index);
        if (index === 0) {
          if (item.code_subcategory.length === 0) {
            return `[["category_id",${item.code_category.id}]]`;
          } else {
            return `[["category_id",${item.code_category.id}], ["sub_category_id","in",[${item.code_subcategory}]]]`;
          }
        } else {
          // add OR to the array
          if (item.code_subcategory.length === 0) {
            return `["OR"],[["category_id",${item.code_category.id}]]`;
          } else {
            return `["OR"],[["category_id",${item.code_category.id}], ["sub_category_id","in",[${item.code_subcategory}]]]`;
          }
        }
      });
      return category;
    },
    filterDownloadCombined() {
      // const combined = [[...this.locationFilterDownload]];
      // if (this.dynamicfield[0].code_category != 0) {
      //   combined.push([...this.categoryFilterDownload]);
      // }
      const location = JSON.stringify([...this.locationFilterDownload]);
      if (this.dynamicfield[0].code_category != "") {
        const combined = [location, `[${this.categoryFilterDownload}]`];
        return combined;
      } else {
        const combined = [location];
        return combined;
      }
    },
    loadingDownload() {
      return this.$store.getters.loadingCircle;
    },
  },
  methods: {
    getSubCategory(value) {
      this.disableAddField = false;
      this.dynamicfield[value].selectCategory = true;
      const data = {
        limit: -1,
        category_id: this.dynamicfield[value].code_category.id,
      };
      const url = new URL(
        process.env.VUE_APP_API_URL + `api/v1/id/sdp/sub-category`
      );
      for (let key in data) {
        url.searchParams.append(key, data[key]);
      }
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtService.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result.data);
          this.dynamicfield[value]["subcategory"] = result.data.data;
          this.dynamicfield[value].selectCategory = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addField() {
      this.disabledRemoveField = false;
      const lastIndex = this.dynamicfield.length - 1;
      // const categoriesListFilter = this.itemCategorySettle.filter(
      //   (item) => !this.usedCategories.includes(item.id)
      // );
      if (Object.keys(this.dynamicfield[lastIndex].code_category).length != 0) {
        this.usedCategories.push(this.dynamicfield[lastIndex].code_category.id);
        this.dynamicfield[lastIndex].selectReadonly = true;
        this.dynamicfield.push({
          id: this.nextField++,
          code_category: "",
          selectCategory: true,
          selectReadonly: false,
          code_subcategory: [],
        });
      } else {
        this.$swal({
          title: "Category cannot be empty",
          icon: "error",
          showConfirmButton: true,
          confirmButtonColor: "#134889",
          timer: 3000,
        });
      }
    },
    removeField(value) {
      const removeUsedCategory = this.usedCategories.indexOf(
        this.dynamicfield[value].code_category.id
      );
      // this.dynamicfield[value - 1].selectReadonly = false;
      this.usedCategories.splice(removeUsedCategory, 1);
      this.dynamicfield.splice(value, 1);
      if (this.dynamicfield.length == 1) {
        this.disableAddField = true;
        this.disabledRemoveField = true;
        this.dynamicfield[0].selectReadonly = false;
      }
    },
    downloadPotensiDesa() {
      const payload = {
        limit: -1,
        page: 1,
        sort: "desc",
        order: "id",
        filters: `[${this.filterDownloadCombined}]`,
        export: "PMT-Potensial-Desa",
      };
      this.$store.commit("loadingCircle", true);
      this.$store.dispatch("downloadDataPotensiDesa", payload);
    },
  },
};
