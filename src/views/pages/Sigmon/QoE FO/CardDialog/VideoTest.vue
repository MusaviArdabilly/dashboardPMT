<template>
	<v-dialog
		v-model="dialogVideoTest"
		max-width="600px"
		scrollable
		@click:outside="closeDialog"
	>
		<v-card>
			<v-card-title class="d-flex justify-center"
				>Video Test (Mbps)</v-card-title
			>
			<v-divider></v-divider>
			<v-card-text class="py-5">
				<v-row v-for="(item, index) in avgVideoFo" :key="index">
					<v-col lg="2" class="d-flex justify-end align-center"
						><span class="font-weight-bold">{{
							index + 1
						}}</span></v-col
					>
					<v-col lg="2" class="d-flex justify-center align-center">
						<div
							is="v-avatar"
							:color="avatarBackground(item.name)"
							v-if="item.logo == ''"
						>
							<span class="white--text">{{
								stringInitial(item.name)
							}}</span>
						</div>
						<div is="v-avatar" v-else>
							<img
								:src="logo_url + item.logo"
								:alt="item.name + '-logo'"
							/>
						</div>
					</v-col>
					<v-col lg="8">
						<div class="d-flex">
							<div class="text-lg-body-2 text-md-body-2">
								{{ item.name }}
							</div>
							<v-spacer></v-spacer>
							<div class="font-weight-bold"></div>
						</div>
						<div class="d-flex mt-2">
							<v-row>
								<v-col cols="7">
									<v-progress-linear
										:value="item.percentage"
										height="12px"
										rounded
										color="#74B8F6"
										class="mt-4"
									>
										<div
											class="white--text font-weight-bold"
										></div>
									</v-progress-linear>
								</v-col>
								<v-col cols="5" class="d-flex">
									<div class="font-weight-bold mt-2">
										{{ item.average }}
									</div>
									<div class="ml-2 mt-2">
										({{ item.count }})
									</div>
								</v-col>
							</v-row>
						</div>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="d-flex justify-center">
				<v-btn
					@click="closeDialog"
					outlined
					elevation="0"
					flat
					rounded
					class="text-capitalize"
					width="11rem"
					>Back</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: ["avgVideoFo", "dialogVideoTest"],
	computed: {
		loading() {
			return this.$store.getters.foLoading;
		},
		logo_url() {
			return process.env.VUE_APP_API_URL;
		},
		loadingAvgSpeed() {
			return this.$store.getters.loadingAvgSpeed;
		},
		loadingAvgVideo() {
			return this.$store.getters.loadingAvgVideo;
		},
		loadingAvgWeb() {
			return this.$store.getters.loadingAvgWeb;
		},
	},
	methods: {
		closeDialog() {
			this.$parent.dialogVideoTest = false;
		},
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
	},

	filters: {
		initial: function (value) {
			var str = value;
			var matches = str.match(/\b(\w)/g);
			var acronym = matches.join("");
			return acronym.slice(0, 2);
		},
	},
};
</script>
