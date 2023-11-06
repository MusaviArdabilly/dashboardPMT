import JwtService from "../../services/jwt.services";

// actions type
export const GET_OPSEL = "getOpsel";
export const GET_OPSEL_FO = "getOpselFo";

// mutations type
export const SET_OPSEL = "setOpsel";
export const SET_OPSEL_FO = "setOpselFo";
export const SET_LOADING = "setLoading";

const state = {
	opsel: [],
	opselFo: [],
	item_opsel: [
		{
			id: 0,
			name: "All Operator Cellular",
		},
	],
	item_opselFo: [{ id: 0, name: "All Operator FO" }],
	loading: false,
};

const getters = {
	getOpsel() {
		return state.opsel;
	},
	item_opselFo() {
		return state.item_opselFo;
	},
	item_opsel() {
		return state.item_opsel;
	},
};

const actions = {
	[GET_OPSEL](context) {
		context.commit(SET_LOADING, true);
		const data = {
			limit: 10,
			page: 1,
			sort: "desc",
			status: "true",
			type: 1,
		};
		
		console.log("API URL:", process.env.VUE_APP_API_URL);
		fetch(process.env.VUE_APP_API_URL + `api/v1/id/cell-operator`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${JwtService.getToken()}`,
			},
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.error == false) {
					state.item_opsel = [
						{
							id: 0,
							name: "All Operator Cellular",
						},
					];
					for (let item of result.data.data) {
						state.item_opsel.push(item);
					}
					let opsel = [];
					for (let data of result.data.data) {
						if (data.is_active != false) {
							opsel.push(data);
						}
					}
					context.commit(SET_OPSEL, opsel);
					context.commit(SET_LOADING, false);
				}
			})
			.catch((err) => {
				console.log(err);
				if (err.response.status == 401) {
					this.$router.push("/auth/login");
				}
			});
	},
	[GET_OPSEL_FO](context) {
		context.commit(SET_LOADING, true);
		const data = {
			limit: -1,
			page: 1,
			sort: "asc",
			status: "true",
			type: 2,
		};

		return new Promise((resolve, reject) => {
			fetch(process.env.VUE_APP_API_URL + `api/v1/id/cell-operator`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JwtService.getToken()}`,
				},
			})
				.then((response) => response.json())
				.then((result) => {
					if (result.error == false) {
						state.item_opselFo = [
							{
								id: 0,
								name: "All Operator FO",
							},
						];
						for (let item of result.data.data) {
							state.item_opselFo.push(item);
						}
						let opsel = [];
						for (let data of result.data.data) {
							if (data.is_active != false) {
								opsel.push(data);
							}
						}
						context.commit(SET_OPSEL_FO, opsel);
						context.commit(SET_LOADING, false);
						resolve();
					}
				})
				.catch((err) => {
					reject();
					console.log(err);
					if (err.response.status == 401) {
						this.$router.push("/auth/login");
					}
				});
		});
	},
};

const mutations = {
	[SET_OPSEL](state, payload) {
		state.opsel = payload;
	},
	[SET_OPSEL_FO](state, payload) {
		state.opselFo = payload;
	},

	[SET_LOADING](state, payload) {
		state.loading = payload;
	},
};

export default {
	state,
	actions,
	mutations,
	getters,
};
