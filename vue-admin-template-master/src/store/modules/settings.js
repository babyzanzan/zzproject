import defaultSettings from '@/settings'
import Layout from '@/layout'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  tagTitle: [{
    path: "/dashboard",
    title: "主页"
  }],  //navbartitle中的标签页列表
  selectedTableName: '', // 再自定义报表中选中的表格名称
      permissionConfiguration_detail: [
        {
          id: 1,
          label: '系统管理', 
          children: [{
            id: 3,
            label: '账号管理'
          }, {
            id: 4,
            label: '自定义模板'
          }, {
            id: 5,
            label: '权限说明'
          }, {
            id: 6,
            label: '字典管理'
          }]},
        {
            id:2, 
            label: '工具插件', 
            children: [{
              id: 7,
              label: '敬请期待'
            }]}
        ],
  permissionConfiguration:[{
    id: 1,
    label: '系统管理',
  },{
    id:2, 
    label: '工具插件', 
  }
],
  avatarList:[
    'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
  ],
  fontSize: 14,
  themeColor: 'dark',
  closeTagsBar: true,
  closeNavBar: true,
  closeSideBar: true,
  chatInfo:'',
  showChatHover: false,
  selectCondition: {}
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  addNavbarTag: (state, payload) => {  //添加navbar上的标签列表
    let tagObj = {   // 定义对象
      title: payload.title,
      path: payload.path
    }
    state.tagTitle.push(tagObj)
  },

  setSelectTableName: (state, payload) => {  // 获取选择的tablename
    state.selectedTableName = payload.selectedTableName
  },

  changeFontSize: (state, payload) => {//改变字体大小
    state.fontSize = payload.fontSize
  },

  changeThemeColor: (state, payload) => {//改变主题颜色
    state.themeColor = payload.themeColor
  },

  changeTagsBar: (state, payload) => {//关闭tagsbar
    state.closeTagsBar = payload.closeTagsBar
  },

  changeNavBar: (state, payload) => {//关闭navbar
    state.closeNavBar = payload.closeNavBar
  },

  changeSideBar: (state, payload) => {//关闭navbar
    state.closeSideBar = payload.closeSideBar
  },

  changeChatInfo: (state, payload) => {//点击未读消息，跳转到聊天室
    state.chatInfo = payload.chatInfo
  },

  changeShowChatHover:(state, payload) => {//显示小窗聊天框
    state.showChatHover = payload.showChatHover
  },

  changeSelectCondition:(state, payload) => {//动态查询的条件对象
    state.selectCondition = payload.selectCondition
  },

  initTag: (state) => {   // 初始化tag标签
    state.tagTitle = [{
      path: "/dashboard",
      title: "主页",
    }]
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 
  closeTags({ commit }, tag) {//关闭tag标签
    return new Promise(resolve => {
      let items = tag
      let clickIndex = state.tagTitle.indexOf(items)
      let needJump = ''
      state.tagTitle.splice(clickIndex, 1)
      if((clickIndex===state.tagTitle.length)&&state.tagTitle.length!==0){// 如果点击的标签小于标签长度，则跳到最后一个页面，否则就跳到上一个页面
        needJump = state.tagTitle[clickIndex-1].path
        resolve(needJump)
      }else{
        needJump = state.tagTitle[state.tagTitle.length-1].path
        resolve(needJump)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

