// 放置全局指令
import Vue from 'vue'
import store from '@/store'
const adminPerms = '*:*:*'
Vue.directive('permission', {
  // el使用自定义指令的dom元素
  // binding一个对象，记录详情内容
  inserted (el, binding) {
    const perms = store.state.user.profile.permissions
    if (perms.includes(adminPerms)) {
      return
    }
    if (!perms.includes(binding.value)) {
      el.remove()
    }
  }
})
