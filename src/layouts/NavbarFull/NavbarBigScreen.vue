<template>
	<div class="nav-bg-scrn pa-5">
		<v-card class="pa-5 bg-scrn" elevation="2">
			<v-row>
				<v-col cols="4" class="d-flex mt-2">
					<router-link to="/">
						<v-icon>mdi-home</v-icon>
					</router-link>
					<div class="ml-2 mt-1 font-weight-bold grey--text">
						Executive Dashboard - {{ title }}
					</div>
				</v-col>
				<v-spacer></v-spacer>
				<v-col cols="3" lg="2" class="mt-2">
					<v-select
						v-if="user != null"
						background-color="white"
						outlined
						hide-details
						rounded
						v-model="selected_language"
						:items="language"
						item-value="value"
						dense
						@change="changeLanguage"
					>
						<template v-slot:item="{ item }">
							<img
								class="select-flag"
								:src="item.image"
								:alt="item.value"
							/>
							{{ item.name }}
						</template>
						<template v-slot:selection="{ item }">
							<img
								class="select-flag"
								:src="item.image"
								:alt="item.value"
							/>
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
import UK from "../../assets/icon/flag/uk.png";
import ID from "../../assets/icon/flag/id.png";
import JwtService from "../../services/jwt.services";
import UserTopNav from "../../components/UserTopNav.vue";

export default {
	components: {
		UserTopNav,
	},
	data: () => ({
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
		title: "",
	}),

	mounted() {
		this.user = JwtService.getUser();
		this.$i18n.locale = this.user.language;
		this.selected_language = this.user.language;
	},

	created() {
		console.log(this.$route);
		this.title = this.$route.name;
	},

	methods: {
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
.bg-scrn {
	border-radius: 20px !important;
}

.v-input--selection-controls {
	margin-top: 0px;
}

.select-flag {
	height: 2em;
	margin-right: 1em;
}
</style>
