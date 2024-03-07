import { getProfileAPI, loginAPI } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import { routes, resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: getToken() || '',
    profile: {},
    menuList: []
  },
  mutations: {
    setMenuList (state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes]
    },
    setToken (state, newToken) {
      state.token = newToken
      setToken(newToken)
    },
    removeToken (state) {
      state.token = ''
      removeToken()
    },
    setProfile (state, profile) {
      state.profile = profile
    },
    clearMenuList (state) {
      state.menuList = []
      resetRouter()
    }
  },
  actions: {
    async loginAction (store, data) {
      const res = await loginAPI(data)
      store.commit('setToken', res.data.token)
    },
    async getProfile (store) {
      const res = await getProfileAPI()
      store.commit('setProfile', res.data)
      return res.data.permissions
    }
  }
}
