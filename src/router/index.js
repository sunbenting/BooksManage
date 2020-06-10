import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/importTableExcel',
    component: () => import('@/views/importTableExcel'),
    hidden: true
  },
  // 批次管理
  {
    path: '/',
    component: Layout,
    // redirect: '/union-web',
    children: [{
      path: '/',
      name: '/',
      component: () => import('@/views/batchManage/index'),
      meta: { title: '批次管理', icon: 'dashboard' },
      noCache: true
    }]
  },
  // 图书管理
  {
    path: '/bookManagement',
    component: Layout,
    redirect: '/bookManagement',
    children: [
      {
        path: '/bookManagement',
        name: 'bookManagement',
        meta: { title: '图书管理', icon: 'table' },
        component: () => import('@/views/bookManagement/index')
      }
    ]
  },


//评论管理
  {
    path: '/reviewsManage',
    component: Layout,
    redirect: '/reviewsManage',   
    children: [
      {
        path: '/reviewsManage',
        name: 'reviewsManage',
        meta: {
          title: '评论管理',
          icon: 'form'
        },
        component: () => import('@/views/reviewsManage/index')
      }
    ]
   
  },
//订单管理
  {
    path: '/orderManage',
    component: Layout,
    redirect: '/orderManage',   
    children: [
      {
        path: '/orderManage',
        name: 'orderManage',
        meta: {
          title: '订单管理',
          icon: 'nested'
        },
        component: () => import('@/views/orderManage/index')
      }
    ]
   
  },
  //系统管理
  {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage',   
    children: [
      {
        path: '/systemManage',
        name: 'systemManage',
        meta: {
          title: '系统管理',
          icon: 'system'
        },
        component: () => import('@/views/systemManage/index')
      }
    ]
   
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
