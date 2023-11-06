import JwtService from "../../../../../services/jwt.services";
import DownloadChart from "../ftp_chart/DownloadChart.vue";
import UploadChart from "../ftp_chart/UploadChart.vue";
import WebTestChart from "../ftp_chart/WebTestChart.vue";
import DownloadTest from "../capacity_test/DownloadTest.vue";
import UploadTest from "../capacity_test/UploadCapacity.vue";
import { GET_OPSEL } from "../../../../../store/modules/opsel.module.js";

export default {
	components: {
		DownloadChart,
		UploadChart,
		WebTestChart,
		DownloadTest,
		UploadTest,
	},

	props: ["province", "city", "district", "date_1", "date_2"],

	data: () => ({
		pmt_url: process.env.VUE_APP_API_URL,
		ftp_data: [],
		download: [],
		upload: [],
		download_categories: [],
		web_chart: [],
		capacity_speed_chart_download: [],
		capacity_speed_chart_upload: [],
		ping_pl: [],
		ping_ad: [],
		youtube: [],
		wa_voice_quality: [],
		wa_voice_sc: [],
		wa_mt_avg: [],
		wa_mt_ss: [],
		sms_total_on_net: [],
		sms_total_under_on_net: [],
		sms_total_off_net: [],
		sms_total_under_off_net: [],
		voice_on_net_avg: [],
		voice_on_net_total_call: [],
		voice_on_net_blocked_call: [],
		voice_on_net_dropped_call: [],
		voice_off_net_avg: [],
		voice_off_net_total_call: [],
		voice_off_net_blocked_call: [],
		voice_off_net_dropped_call: [],
	}),

	computed: {
		opsel: function () {
			return this.$store.getters.getOpsel;
		},
	},

	created() {
		this.initialize();
	},

	mounted() {
		this.getQoSChart();
	},

	methods: {
		initialize() {
			this.getOperatorCellular();
		},

		getQoSChart() {
			const data = {
				start_date: this.date_1,
				end_date: this.date_2,
				cell_operator_id: 0,
				province_id: this.province,
				city_id: this.city,
				district_id: this.disctrict,
				sub_district_id: 0,
				poi: "",
				event: "",
				status: "active",
				network_type: 1,
			};

			fetch(process.env.VUE_APP_API_URL + `api/v1/id/qos/chart`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JwtService.getToken()}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					// console.log(result);
					if (result.data == null) {
						this.$emit("turnOffLoading");
						this.ftp_data = [];
						this.download = [];
						this.upload = [];
						this.download_categories = [];
						this.web_chart = [];
						this.capacity_speed_chart_download = [];
						this.capacity_speed_chart_upload = [];
						this.ping_pl = [];
						this.ping_ad = [];
						this.youtube = [];
						this.wa_voice_quality = [];
						this.wa_voice_sc = [];
						this.wa_mt_avg = [];
						this.wa_mt_ss = [];
						this.sms_total_on_net = [];
						this.sms_total_under_on_net = [];
						this.sms_total_off_net = [];
						this.sms_total_under_off_net = [];
						this.voice_on_net_avg = [];
						this.voice_on_net_total_call = [];
						this.voice_on_net_blocked_call = [];
						this.voice_on_net_dropped_call = [];
						this.voice_off_net_avg = [];
						this.voice_off_net_total_call = [];
						this.voice_off_net_blocked_call = [];
						this.voice_off_net_dropped_call = [];
					} else {
						this.$emit("turnOffLoading");
						const avg_speed = [];
						const min_speed = [];
						const max_speed = [];

						const avg_ul_speed = [];
						const min_ul_speed = [];
						const max_ul_speed = [];

						const avg_browsing_speed = [];
						const min_browsing_speed = [];
						const max_browsing_speed = [];

						const cp_avg_dl_throughput = [];
						const cp_min_dl_throughput = [];
						const cp_max_dl_throughput = [];

						const cp_avg_ul_throughput = [];
						const cp_min_ul_throughput = [];
						const cp_max_ul_throughput = [];

						for (let data of result.data) {
							this.download_categories.push(data.name);
							avg_speed.push(data.ftp_chart.avg_dl_speed);
							min_speed.push(data.ftp_chart.min_dl_speed);
							max_speed.push(data.ftp_chart.max_dl_speed);

							avg_ul_speed.push(data.ftp_chart.avg_ul_speed);
							min_ul_speed.push(data.ftp_chart.min_ul_speed);
							max_ul_speed.push(data.ftp_chart.max_ul_speed);

							avg_browsing_speed.push(
								data.web_chart.avg_browsing_speed
							);
							min_browsing_speed.push(
								data.web_chart.min_browsing_speed
							);
							max_browsing_speed.push(
								data.web_chart.max_browsing_speed
							);

							cp_avg_dl_throughput.push(
								data.capacity_speed_chart.avg_dl_throughput
							);
							cp_min_dl_throughput.push(
								data.capacity_speed_chart.min_dl_throughput
							);
							cp_max_dl_throughput.push(
								data.capacity_speed_chart.max_dl_throughput
							);

							cp_avg_ul_throughput.push(
								data.capacity_speed_chart.avg_ul_throughput
							);
							cp_min_ul_throughput.push(
								data.capacity_speed_chart.min_ul_throughput
							);
							cp_max_ul_throughput.push(
								data.capacity_speed_chart.max_ul_throughput
							);

							this.ping_pl.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.ping_pkg_loss,
							});

							this.ping_ad.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.ping_avg_delay,
							});

							this.youtube.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.youtube_avg_quality,
							});

							this.wa_voice_quality.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.wa_call_avg_voice_quality,
							});

							this.wa_voice_sc.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.wa_call_success,
							});

							this.wa_mt_avg.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.wa_msg_avg_duration,
							});

							this.wa_mt_ss.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sub_chart.wa_msg_success,
							});

							this.sms_total_on_net.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sms_chart.on_net_total,
							});

							this.sms_total_under_on_net.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sms_chart
									.on_net_total_underx_minute,
							});

							this.sms_total_off_net.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sms_chart.off_net_total,
							});

							this.sms_total_under_off_net.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.sms_chart
									.off_net_total_underx_minute,
							});

							this.voice_on_net_avg.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.on_net_avg_quality,
							});

							this.voice_on_net_total_call.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.on_net_total_call,
							});

							this.voice_on_net_blocked_call.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.on_net_blocked_call,
							});

							this.voice_on_net_dropped_call.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.on_net_dropped_call,
							});

							this.voice_off_net_avg.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.off_net_avg_quality,
							});

							this.voice_off_net_total_call.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.off_net_total_call,
							});

							this.voice_off_net_blocked_call.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.off_net_blocked_call,
							});

							this.voice_off_net_dropped_call.push({
								name: data.name,
								logo: this.pmt_url + data.logo,
								value: data.voice_chart.off_net_dropped_call,
							});
						}

						// console.log(avg_speed);

						// FTP Test (Mbps) Download
						this.download = [
							{
								name: "Avg Speed",
								data: avg_speed,
							},
							{
								name: "Min Speed",
								data: min_speed,
							},
							{
								name: "Max Speed",
								data: max_speed,
							},
						];

						// FTP Test (Mbps) Upload
						this.upload = [
							{
								name: "Avg Speed",
								data: avg_ul_speed,
							},
							{
								name: "Min Speed",
								data: min_ul_speed,
							},
							{
								name: "Max Speed",
								data: max_ul_speed,
							},
						];

						// Web Test/Browsing Speed (Mbps)
						this.web_chart = [
							{
								name: "Avg Speed",
								data: avg_browsing_speed,
							},
							{
								name: "Min Speed",
								data: min_browsing_speed,
							},
							{
								name: "Max Speed",
								data: max_browsing_speed,
							},
						];

						// Capacity/Speed Test (Mbps)
						this.capacity_speed_chart_download = [
							{
								name: "Avg Speed",
								data: cp_avg_dl_throughput,
							},
							{
								name: "Min Speed",
								data: cp_min_dl_throughput,
							},
							{
								name: "Max Speed",
								data: cp_max_dl_throughput,
							},
						];

						// Capacity/Speed Test (Mbps)
						this.capacity_speed_chart_upload = [
							{
								name: "Avg Speed",
								data: cp_avg_ul_throughput,
							},
							{
								name: "Min Speed",
								data: cp_min_ul_throughput,
							},
							{
								name: "Max Speed",
								data: cp_max_ul_throughput,
							},
						];
						//turn off loading
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		getOperatorCellular() {
			this.$store.dispatch(GET_OPSEL);
		},

		convertValue(value) {
			// console.log(value);

			return value * 100;
		},
	},
};
