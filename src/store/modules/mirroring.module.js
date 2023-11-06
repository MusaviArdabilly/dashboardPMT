// actions type
export const ADD_ITEM = "addItem"

// mutations type
export const SET_ITEM = "setItem"

const state = {
    qoe_item: "Public Opinion Satisfaction",
}

const getters = {
    currentItem(state) {
        return state.qoe_item
    }
}

const actions = {
    [ADD_ITEM](context, value) {
        console.log(value)
        context.commit(SET_ITEM, value)
    }
}

const mutations = {
    [SET_ITEM](state, payload) {
        console.log(state, payload)
        state.qoe_item = payload
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}