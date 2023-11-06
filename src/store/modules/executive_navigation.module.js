// actions type
export const ADD_ON_BOARDING = "addOnBoarding"
export const NEXT_ITEM = "nextItem"
export const PREV_ITEM = "prevItem"

// mutations type
export const SET_ON_BOARDING = "setOnBoarding"
export const NEXT_ON_BOARDING = "nextOnBoarding"
export const PREV_ON_BOARDING = "prevOnBoarding"

const state = {
    onboarding: 0,
}

const getters = {
    // currentOnBoarding: (state) => {
    //     return state.onboarding
    // }
    currentOnBoarding(state) {
        return state.onboarding
    }
}

const actions = {
    [ADD_ON_BOARDING](context, value) {
        console.log(value)
        context.commit(SET_ON_BOARDING, value)
    },
    [NEXT_ITEM](context, value) {
        context.commit(NEXT_ON_BOARDING, value)
    },
    [PREV_ITEM](context, value) {
        console.log(context, value)
        context.commit(PREV_ON_BOARDING, value)
    }
}

const mutations = {
    [SET_ON_BOARDING](state, payload) {
        console.log(state, payload)
        state.onboarding = payload
    },
    [NEXT_ON_BOARDING](state, payload) {
        console.log(state, payload)
        state.onboarding = state.onboarding + 1 === payload ? 0 : state.onboarding + 1;
    },
    [PREV_ON_BOARDING](state, payload) {
        console.log(state, payload)
        state.onboarding = state.onboarding - 1 < 0 ? payload - 1 : state.onboarding - 1;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}