import NavbarBigScreen from "../../../components/SummaryDashboard/NavbarBigScreen.vue";
import moment from "moment";

export default {
	components: { NavbarBigScreen },
	data: () => ({
		active_alarm: 0,
		selectedNode: [],
		selectedSegment: "",
		selectedDetail: [],
		detailDialog: false,
		nodeDialog: false,
		segmentDialog: false,
		slide: {
			breakpoint: 0,
		},
	}),
	filters: {
		moment: function (date) {
			return moment(date).format("YYYY-MM-D hh:mm:ss");
		},
	},
	computed: {
		dataAlarm() {
			return this.$store.getters.alarmDetailTable.data;
		},
		loadingAlarmList() {
			return this.$store.getters.loadingAlarmList;
		},
		columns() {
			if (this.$vuetify.breakpoint.xl) {
				return 3;
			}

			if (this.$vuetify.breakpoint.lg) {
				return 3;
			}

			if (this.$vuetify.breakpoint.md) {
				return 3;
			}

			if (this.$vuetify.breakpoint.sm) {
				return 3;
			}

			return 1;
		},
	},
	mounted() {
		this.initialize();
	},
	methods: {
		initialize() {
			this.getAlarm();
		},
		showNodeList(value) {
			this.nodeDialog = true;
			this.detailDialog = false;
			this.selectedNode = [];
			this.selectedNode.push(value);
		},
		showSegmentList(value) {
			this.segmentDialog = true;
			this.detailDialog = false;
			this.selectedSegment = [];
			console.log(value);
			this.selectedSegment.push(value);
		},
		showDetails(value) {
			this.detailDialog = true;
			this.nodeDialog = false;
			this.segmentDialog = false;
			this.selectedDetail = [];
			this.selectedDetail.push(value);
		},
		getAlarm() {
			this.$store.commit("setLoadingAlarmList", true);
			const payload = {
				sort: "asc",
				status: "open",
				limit: -1,
				page: 1,
			};
			this.$store.dispatch("getTableAlarmDetail", payload);
		},

		showDetail(value) {
			console.log(value);
			this.showDialog = true;
			this.selected_detail = value;
		},
	},
};
