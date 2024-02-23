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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: '/noredirect',
    children: [
      {
        path: 'personCenter',
        component: () => import('@/views/personCenter/index'),
        name: 'PersonCenter',
        meta: { title: '个人中心', icon: 'el-icon-user' }
      }
    ]
  },

  {
    path: '/detail',
    component: Layout,
    hidden: true,
    redirect: '/noredirect',
    children: [
      {
        path: 'infoDetail',
        component: () => import('@/views/infoDetail/index'),
        name: 'InfoDetail',
        meta: { title: '新增(修改)详情页', icon: 'el-icon-user' }
      },
      {
        path: 'showDetail',
        component: () => import('@/views/showDetail/index'),
        name: 'ShowDetail',
        meta: { title: '查看详情页', icon: 'el-icon-user' }
      }
    ]
  },

  {
    path: '/toChat',
    component: Layout,
    hidden: true,
    redirect: '/chatRoom',
    children: [{
      path: 'chatRoom',
      name: 'ChatRoom',
      component: () => import('@/views/chatRoom/index'),
      meta: { title: '聊天窗口', icon: 'el-icon-s-promotion' }
    }]
  },

  {
    path: '/hyBigScreen',
    component: Layout,
    redirect: '/HyBigScreen',
    children: [{
      path: 'hyBigScreen',
      name: 'HyBigScreen',
      component: () => import('@/views/hyBigScreen/index'),
      meta: { title: '大屏显示', icon: 'el-icon-lollipop' }
    }]
  },


  // {
  //   path: '/personCenter',
  //   component: Layout,
  //   redirect: '/personCenter',
  //   children: [{
  //     path: 'personCenter',
  //     name: 'PersonCenter',
  //     component: () => import('@/views/personCenter/index'),
  //     meta: { title: '个人中心', icon: 'el-icon-user' }
  //   }]
  // },


  // 新版本的路由
  // {
  //   path: '/systemInformation',
  //   component: Layout,
  //   redirect: '/systemInformation/accountManagement',
  //   name: 'SystemInformation',
  //   meta: { title: '系统管理', icon: 'el-icon-s-tools' },
  //   children: [
  //     {
  //       path: 'accountManagement',
  //       name: 'AccountManagement',
  //       component: () => import('@/views/systemInformation/accountManagement/index'),
  //       meta: { title: '账号管理', icon: 'el-icon-s-custom' }
  //     },
  //     {
  //       path: 'DIYtemplate',
  //       name: 'DIYtemplate',
  //       component: () => import('@/views/systemInformation/DIYtemplate/index'),
  //       meta: { title: '自定义模板', icon: 'el-icon-brush' }
  //     },
  //     {
  //       path: 'permissionDescription',
  //       name: 'PermissionDescription',
  //       component: () => import('@/views/systemInformation/permissionDescription/index'),
  //       meta: { title: '权限说明', icon: 'el-icon-message-solid' }
  //     },
  //     {
  //       path: 'dictionaryManagement',
  //       name: 'DictionaryManagement',
  //       component: () => import('@/views/systemInformation/dictionaryManagement/index'),
  //       meta: { title: '字典管理', icon: 'el-icon-message-solid' }
  //     },
  //   ]
  // }, 

  {
    path: '/tool',
    component: Layout,
    redirect: '/tool/chatGPT',
    name: 'Tool',
    meta: { title: '工具插件', icon: 'el-icon-info' },
    children: [
      {
        path: 'sildUnlock',
        name: 'SildUnlock',
        component: () => import('@/views/tool/sildUnlock/index'),
        meta: { title: '图片解锁', icon: 'el-icon-s-goods' }
      },
      {
        path: 'backgroundClip',
        name: 'BackgroundClip',
        component: () => import('@/views/tool/backgroundClip/index'),
        meta: { title: '坤坤代码动图', icon: 'el-icon-s-goods' }
      },
      {
        path: 'codeRain',
        name: 'CodeRain',
        component: () => import('@/views/tool/codeRain/index'),
        meta: { title: '文字雨', icon: 'el-icon-s-goods' }
      },
      {
        path: 'smallGame',
        name: 'SmallGame',
        component: () => import('@/views/tool/smallGame/index'),
        meta: { title: '解压小游戏', icon: 'el-icon-s-goods' }
      },
      {
        path: 'inspectionRolling',
        name: 'InspectionRolling',
        component: () => import('@/views/tool/inspectionRolling/index'),
        meta: { title: '视差滚动', icon: 'el-icon-s-goods' }
      },
      {
        path: 'gantt',
        name: 'Gantt',
        component: () => import('@/views/tool/gantt/index'),
        meta: { title: '甘特图', icon: 'el-icon-s-goods' }
      },
      {
        path: 'chatGPT',
        name: 'ChatGPT',
        component: () => import('@/views/tool/chatGPT/index'),
        meta: { title: 'ChatGPT', icon: 'el-icon-s-goods' }
      },
      {
        path: 'codeEdit',
        name: 'CodeEdit',
        component: () => import('@/views/tool/codeEdit/index'),
        meta: { title: '代码编辑器', icon: 'el-icon-s-shop' }
      },
      {
        path: 'echarts',
        name: 'Echarts',
        component: () => import('@/views/tool/echarts/index'),
        meta: { title: '图表', icon: 'el-icon-star-on' }
      },
      {
        path: 'excel',
        name: 'Excel',
        component: () => import('@/views/tool/excel/index'),
        meta: { title: '表单导入导出', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'formGenerator',
        name: 'FormGenerator',
        component: () => import('@/views/tool/formGenerator/index'),
        meta: { title: '表单编辑器', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'guidStep',
        name: 'GuidStep',
        component: () => import('@/views/tool/guidStep/index'),
        meta: { title: '新手引导', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'iframe',
        name: 'Iframe',
        component: () => import('@/views/tool/iframe/index'),
        meta: { title: '外连接', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'imageMagnifier',
        name: 'ImageMagnifier',
        component: () => import('@/views/tool/imageMagnifier/index'),
        meta: { title: '图片放大镜', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'javaCodeGenerator',
        name: 'JavaCodeGenerator',
        component: () => import('@/views/tool/javaCodeGenerator/index'),
        meta: { title: 'java代码生成器', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/tool/map/index'),
        meta: { title: '地图', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'markDown',
        name: 'MarkDown',
        component: () => import('@/views/tool/markDown/index'),
        meta: { title: 'markdown编辑器', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'QRCode',
        name: 'QRCode',
        component: () => import('@/views/tool/QRCode/index'),
        meta: { title: '二维码生成', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'richTextEditor',
        name: 'RichTextEditor',
        component: () => import('@/views/tool/richTextEditor/index'),
        meta: { title: '富文本编辑器', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'show3D',
        name: 'Show3D',
        component: () => import('@/views/tool/show3D/index'),
        meta: { title: '3D建模', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'signName',
        name: 'SignName',
        component: () => import('@/views/tool/signName/index'),
        meta: { title: '电子签名', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'splitPanel',
        name: 'SplitPanel',
        component: () => import('@/views/tool/splitPanel/index'),
        meta: { title: '动态分割', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'unitConvert',
        name: 'UnitConvert',
        component: () => import('@/views/tool/unitConvert/index'),
        meta: { title: '单位转换', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'videoPlayer',
        name: 'VideoPlayer',
        component: () => import('@/views/tool/videoPlayer/index'),
        meta: { title: '视频播放', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'wordSpeak',
        name: 'WordSpeak',
        component: () => import('@/views/tool/wordSpeak/index'),
        meta: { title: '文字朗读', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'workFlow',
        name: 'WorkFlow',
        component: () => import('@/views/tool/workFlow/index'),
        meta: { title: '工作流', icon: 'el-icon-camera-solid' }
      },
      {
        path: 'wpsOnline',
        name: 'WpsOnline',
        component: () => import('@/views/tool/wpsOnline/index'),
        meta: { title: '在线文档', icon: 'el-icon-camera-solid' }
      }
    ]
  }, 

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: '外部链接', icon: 'link' }
  //     }
  //   ]
  // },


  
]

export const asyncRoutes = [
]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.$addRoutes = (params) => {
  router.matcher = new Router({mode: 'history'}).matcher;
  router.addRoutes(params)
}

export default router
