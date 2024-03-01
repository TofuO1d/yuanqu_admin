import { loginAPI } from '@/api/user'
import { setToken, getToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken() || ''
  },
  mutations: {
    setToken (state, newToken) {
      state.token = newToken
      setToken(newToken)
    }
  },
  actions: {
    async loginAction (store, data) {
      const res = await loginAPI(data)
      store.commit('setToken', res.data.token)
    }
  }
}
