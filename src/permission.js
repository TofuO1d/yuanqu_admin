// 权限控制
import router from './router'
import store from './store'
import { asyncRoutes } from './router/asyncRoutes'
const WHITE_LIST = ['/login', '/404']

// 处理一级路由权限数据
function getFirstRoutePerms (permsArr) {
  const newArr = permsArr.map(item => {
    return item.split(':')[0]
  })
  return [...new Set(newArr)]
}

// 处理二级路由权限数据
function getSecondRoutePerms (permsArr) {
  const newArr = permsArr.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  // Set()处理后的数组是伪数组
  return [...new Set(newArr)]
}

function getRoutes (firstRoutePerms, secondRoutePerms, asyncRoutes) {
  if (firstRoutePerms.includes('*')) {
    return asyncRoutes
  }
  const firstRoutes = asyncRoutes.filter(item =>
    firstRoutePerms.includes(item.permission)
  )
  console.log(firstRoutes)
  const routes = firstRoutes.map(item => {
    return {
      ...item,
      children: item.children.filter(item =>
        secondRoutePerms.includes(item.permission)
      )
    }
  })
  console.log('routes', routes)
  return routes
}
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  // 有token
  if (token) {
    next()
    // 获取用户信息
    if (!store.state.user.profile.id) {
      // 1. 调用action函数获取用户权限数据
      const perms = await store.dispatch('user/getProfile')
      // 2. 把后端的权限数组格式化成我们自己的俩个权限数据
      console.log('当前的权限数据为:', perms)
      const firstRoutePerms = getFirstRoutePerms(perms)
      console.log(firstRoutePerms)
      const secondRoutePerms = getSecondRoutePerms(perms)
      console.log(secondRoutePerms)
      const routes = getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes)
      console.log(routes) //问题出现在上面！！！！
      routes.forEach(item => router.addRoute(item))
      store.commit('user/setMenuList', routes)
    }
  } else {
    // 没有token
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
