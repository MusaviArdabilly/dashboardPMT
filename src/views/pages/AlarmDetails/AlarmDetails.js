import moment from "moment";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      // {
      //   text: "No",
      //   align: "start",
      //   sortable: false,
      //   value: "no",
      // },
      { text: "Site Name", value: "site_name", sortable: false },
      { text: "Operator", value: "cell_operator.name", sortable: false },
      { text: "Tingkat Keparahan", value: "severity", sortable: false },
      { text: "Kategori", value: "category", sortable: false },
      { text: "Alamat", value: "address", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Down Time", value: "start_at", sortable: false },
      { text: "Resolved Time", value: "close_at", sortable: false },
      { text: "Deskripsi", value: "description", sortable: false },
      { text: "Koordinat", value: "latitude", sortable: false },
      { text: "Aksi", value: "id", sortable: false },
    ],
    data: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  filters: {
    moment: function (date) {
      if (date == "") {
        return "-";
      } else {
        return moment(date).format("DD/MM/YYYY - hh:mm:ss");
      }
    },
  },

  computed: {
    printOutHeader() {
      const excelHeader = {
        "Site Name": "site_name",
        Operator: "cell_operator.name",
        "Tingkat Keparahan": "severity",
        Kategori: "category",
        Alamat: "address",
        Status: "status",
        "Down Time": "start_at",
        "Resolved Time": "close_at",
        Deskripsi: "description",
        Koordinat: {
          callback: (value) => {
            return `longitude:${value.longitude},\nlatitude:${value.latitude}`;
          },
        },
      };
      return excelHeader;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    directToMap() {
      return this.$store.getters.settingByName.value;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    initialize() {
      const name = {
        name: "route_map",
      };
      this.$store.dispatch("getSettingsByName", name);
      // this.data = [
      //   {
      //     no: 1,
      //     name: "Pinang_BTM Down",
      //     operator: "Telkomsel",
      //     severity: "Major",
      //     category: "Hardware",
      //     impact_area: "Kab. Bintan, Kab. Natuna",
      //     impact: "14 BTS 2G, 14 BTS 3...",
      //     description: "63 NE under PINANG...",
      //   },
      //   {
      //     no: 2,
      //     name: "Pinang_BTM Down",
      //     operator: "Telkomsel",
      //     severity: "Major",
      //     category: "Hardware",
      //     impact_area: "Kab. Bintan, Kab. Natuna",
      //     impact: "14 BTS 2G, 14 BTS 3...",
      //     description: "63 NE under PINANG...",
      //   },
      //   {
      //     no: 3,
      //     name: "Pinang_BTM Down",
      //     operator: "Telkomsel",
      //     severity: "Major",
      //     category: "Hardware",
      //     impact_area: "Kab. Bintan, Kab. Natuna",
      //     impact: "14 BTS 2G, 14 BTS 3...",
      //     description: "63 NE under PINANG...",
      //   },
      //   {
      //     no: 4,
      //     name: "Pinang_BTM Down",
      //     operator: "Telkomsel",
      //     severity: "Major",
      //     category: "Hardware",
      //     impact_area: "Kab. Bintan, Kab. Natuna",
      //     impact: "14 BTS 2G, 14 BTS 3...",
      //     description: "63 NE under PINANG...",
      //   },
      //   {
      //     no: 5,
      //     name: "Pinang_BTM Down",
      //     operator: "Telkomsel",
      //     severity: "Major",
      //     category: "Hardware",
      //     impact_area: "Kab. Bintan, Kab. Natuna",
      //     impact: "14 BTS 2G, 14 BTS 3...",
      //     description: "63 NE under PINANG...",
      //   },
      // ];
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },

  created() {
    this.initialize();
  },

  mounted() {
    // console.log(this.$router.history.current.params);
    this.data = this.$router.history.current.params.data.data;
  },
};
