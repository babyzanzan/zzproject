import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import fullscreen from 'vue-fullscreen'

import '@/icons' // icon
import '@/permission' // permission control

//视频播放器插件
import VideoPlayer from 'vue-video-player/src';
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'


 //引入quill-editor编辑器  富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
 
 //实现quill-editor编辑器拖拽上传图片
import * as Quill from 'quill'
import { ImageDrop } from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop)
 
 //实现quill-editor编辑器调整图片尺寸
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

 //右键菜单
import Contextmenu from "vue-contextmenujs"

 //复制
import VueClipBoard from 'vue-clipboard2'

//Vant移动端样式
import Vant from 'vant';
import 'vant/lib/index.css';

// 引入Print.js
import print from "@/utils/print";

//引入地图
import VueAMap from 'vue-amap';

// 首页引导插件  新手引导
import intro from 'intro.js' // introjs库
import 'intro.js/introjs.css' // introjs默认css样式
// introjs还提供了多种主题，可以通过以下方式引入
import 'intro.js/themes/introjs-modern.css' // introjs主题
 
//可拖动抽屉
import '@/utils/drawer-drag'

//大屏可视化
import dataV from '@jiaminghi/data-view'

//markdown
import mavonEditor from 'mavon-editor'
 
import 'mavon-editor/dist/css/index.css'
 
Vue.use(mavonEditor);

Vue.use(dataV)

// 放入vue原型中
Vue.prototype.printJson = print.printJson

// 把intro.js加入到vue的prototype中，方便使用，就可以直接通过this.$intro()来调用了
Vue.prototype.$intro = intro


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

//粘贴
Vue.use(VueClipBoard)

//视频播放器插件
Vue.use(VideoPlayer)

//右键菜单
Vue.use(Contextmenu);

//移动端样式
Vue.use(Vant);

//全屏
Vue.use(fullscreen)

//地图
Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  key: '1c294ae862697c49ad75e157bc4f4d70',  //key
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  v: '1.4.4',
  uiVersion: '1.0.11'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
