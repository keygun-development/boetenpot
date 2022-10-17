import Vuex from 'vuex'
import Cookie from 'js-cookie';

const createStore = () => {
    return new Vuex.Store({
        state: {
            user: Cookie.get('jwt') ?? ''
        },

        getters: {
            getUser(state) {
                return state.user
            }
        },

        mutations: {
            SET_USER(state, account) {
                state.user = account
            }
        },

        actions: {
            login({commit}, user) {
                commit('SET_USER', user)
                Cookie.set('jwt', user, { expires: 365});
            }
        },
    })
}

export default createStore;
