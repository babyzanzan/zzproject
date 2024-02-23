const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menusRoutes: state => state.permission.routes,
  userId: state => state.user.userId,
  flag: state => state.user.flag,
  fontSize: state => state.settings.fontSize,
  themeColor: state => state.settings.themeColor,
  tags: state => state.settings.tagTitle,
  closeTags: state => state.settings.closeTagsBar,
  closeNavs: state => state.settings.closeNavBar,
  closeSide: state => state.settings.closeSideBar,
  chatInfo: state => state.settings.chatInfo,
  showChatHover: state => state.settings.showChatHover,
  selectCondition: state => state.settings.selectCondition
}
export default getters
