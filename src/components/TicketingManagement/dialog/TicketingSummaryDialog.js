export default {
	props: {
		activator: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			dialog: true,
			summary: [],
			loadedSummaryCell: true,
			loadedSummaryFo: true,
		};
	},
	computed: {
		dialogAction: {
			get() {
				return this.activator;
			},
			set(newValue) {
				this.$emit("update:activator", newValue);
			},
		},
		summaryAll() {
			const summaryAllCount = {
				total_ticket: 0,
				open_ticket: 0,
				progress_ticket: 0,
				close_ticket: 0,
			};
			if (
				this.loadedSummaryCell == false ||
				this.loadedSummaryFo == false
			) {
				this.summary.reduce((accum, item) => {
					summaryAllCount.total_ticket =
						accum.total_ticket + item.total_ticket;
					summaryAllCount.open_ticket =
						accum.open_ticket + item.open_ticket;
					summaryAllCount.progress_ticket =
						accum.progress_ticket + item.progress_ticket;
					summaryAllCount.close_ticket =
						accum.close_ticket + item.close_ticket;
				});
			}
			return summaryAllCount;
		},
	},
	methods: {
		initialize() {
			this.summaryCell();
			this.summaryFo();
		},
		summaryCell() {
			const payload = {
				start_date: "",
				end_date: "",
				cell_operator_id: 0,
				app_id: 0,
				cell_operator_type: 1,
			};
			this.$store
				.dispatch("getSummaryTicketCell", payload)
				.then((result) => {
					const dataResult = {
						total_ticket: result.data.reduce(
							(accum, item) => accum + item.count,
							0
						),
						close_ticket: 0,
						open_ticket: 0,
						progress_ticket: 0,
					};

					for (let data of result.data) {
						// console.log(data, "ticket status");
						if (data.name == "On Progress") {
							dataResult.progress_ticket = data.count;
						}
						if (data.name == "Closed") {
							dataResult.close_ticket = data.count;
						}
						if (data.name == "Open") {
							dataResult.open_ticket = data.count;
						}
					}

					this.summary.push(dataResult);
					this.loadedSummaryCell = false;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		summaryFo() {
			this.$store
				.dispatch("getSummaryTicket")
				.then((result) => {
					this.summary.push(result.data);
					this.loadedSummaryFo = false;
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
	mounted() {
		this.initialize();
		// console.log(this.activator);
	},
};
