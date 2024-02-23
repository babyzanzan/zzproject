import { asyncRoutes, constantRoutes } from '@/router'
import { fetchUserMenuList } from '@/api/user'
import Layout from '@/layout'

/**
 * 把从后端查询的菜单数据拼装成路由格式的数据
 * @param routes
 * @param data 后端返回的菜单数据
 */
export function generaMenu(routes, data) {
    // 注释掉的是动态路由，需要动态路由可取消注释即可
    data.forEach(item1 => {
        //path不为空的话，就新建一个对象，装数据
      if (item1.path !== '') {
          //这个就仿照目录的机构，搭建
        const menu = {  // 一级列表
          path: item1.path,
          component: Layout, //这个不用写data里面的内容，引用就行了
          redirect: item1.redirect,
          children: [],
          name: item1.name,
          meta: JSON.parse(item1.meta)
        }
        // 如果有二级子标签
        //遍历子标签，并加入到主目录的children中去
        if(item1.children){
          JSON.parse(item1.children).forEach(item2 => {
            const menu2 = {   // 二级列表
              path: item2.path,
              component: (resolve) => require([`@/views${item2.component}`], resolve),
              name: item2.name,
              meta: item2.meta,
              children: [],
            }
            if(item2.children){  // 如果有三级子标签
              item2.children.forEach(item3 => {
                const menu3 = {   //三级列表
                  path: item3.path,
                  component: (resolve) => require([`@/views${item3.component}`], resolve),
                  name: item3.name,
                  meta: item3.meta,
                }
                menu2.children.push(menu3)
              })
            }
            //加入到主目录的children中去
            menu.children.push(menu2)
          })
        }
        routes.push(menu)
        }
    })
    //把404加到最后，因为作者说  // 404 page must be placed at the end !!!
    const menu4 = {
        path: '*',
        redirect: '/404',
        hidden: true
    }
    //追加
    routes.push(menu4)
    return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 拼接静态路由和动态路由
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, userId) {
    return new Promise(resolve => {
      // 后端获取用户菜单，并加入全局状态
      // fetchUserMenuList({userId:userId}).then(res => {  // 获取用户的菜单权限信息
      //   const menuData = Object.assign([], res.data)  // 菜单数据
      //   const tempAsyncRoutes = Object.assign([], asyncRoutes)   // 暂存 动态菜单
      //   const accessedRoutes = generaMenu(tempAsyncRoutes, menuData)  // 拼接菜单
      //   commit('SET_ROUTES', accessedRoutes)
      //   resolve(state.routes)
      // }).catch(error => {
      //   console.log(error)
      // })

      let res = {}
      console.log(userId)
      if(userId===0){//管理员
      //模拟动态菜单
      res = [{
        path: '/systemInformation',
        component: Layout,
        redirect: '/systemInformation/accountManagement',
        name: 'SystemInformation',
        meta:  JSON.stringify({ title: '系统管理', icon: 'el-icon-s-tools' }),
        children: JSON.stringify([
          {
            path: 'accountManagement',
            name: 'AccountManagement',
            component: '/systemInformation/accountManagement/index',
            meta: { title: '账号管理', icon: 'el-icon-s-custom' }
          },
          {
            path: 'DIYtemplate',
            name: 'DIYtemplate',
            component: '/systemInformation/DIYtemplate/index',
            meta: { title: '自定义模板', icon: 'el-icon-brush' }
          },
          {
            path: 'permissionDescription',
            name: 'PermissionDescription',
            component: '/systemInformation/permissionDescription/index',
            meta: { title: '权限说明', icon: 'el-icon-message-solid' }
          },
          {
            path: 'dictionaryManagement',
            name: 'DictionaryManagement',
            component: '/systemInformation/dictionaryManagement/index',
            meta: { title: '字典管理', icon: 'el-icon-message-solid' }
          },
        ]),
        },{
          path: '/baseInformation',
          component: Layout,
          redirect: '/baseInformation/commodityInformation',
          name: 'BaseInformation',
          meta: JSON.stringify({ title: '基本信息', icon: 'el-icon-phone-outline' }),
          children: JSON.stringify([
            {
              path: 'commodityInformation',
              name: 'CommodityInformation',
              component: '/baseInformation/commodityInformation/index',
              meta: { title: '商品信息', icon: 'el-icon-s-custom' }
            },
            {
              path: 'licenseInformation',
              name: 'LicenseInformation',
              component: '/baseInformation/licenseInformation/index',
              meta: { title: '证照信息', icon: 'el-icon-message-solid' }
            },
            {
              path: 'purchaseOrderRecord',
              name: 'PurchaseOrderRecord',
              component: '/baseInformation/purchaseOrderRecord/index',
              meta: { title: '采购记录', icon: 'el-icon-message-solid' }
            }
          ]),
          }]
      }
        const menuData = Object.assign([], res)  // 菜单数据
        const tempAsyncRoutes = Object.assign([], asyncRoutes)   // 暂存 动态菜单
        const accessedRoutes = generaMenu(tempAsyncRoutes, menuData)  // 拼接菜单
        console.log(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(state.routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
