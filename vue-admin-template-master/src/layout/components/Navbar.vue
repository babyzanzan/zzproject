<template>
  <div class="navbar" v-if="showNavBar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    
    <breadcrumb class="breadcrumb-container" />
    
    <div class="right-menu">

      <el-tooltip class="item" effect="dark" content="内部交流" placement="bottom">
        <el-button size="small" class="search-bar" @click="toChat" circle><svg-icon icon-class="friend" /></el-button>
      </el-tooltip>

      <el-popover
        class="search-bar"
        placement="bottom"
        width="300"
        trigger="hover"
        @show="popoverShowEvent"
        @after-enter="popoverAfterEnterEvent">
        <notice @noticeNum="getNoticeNum" :activeTab="activeTab"></notice>
          <el-badge :value="noticeNumber" slot="reference" :max="10" :hidden="noticeNumber===0?true:false">
            <el-button circle size="small" ><svg-icon icon-class="bell" /></el-button>
          </el-badge>
      </el-popover>

      <el-tooltip class="item" effect="dark" :content="fullscreen?'退出全屏':'展开全屏'" placement="bottom">
        <el-button size="small" class="search-bar" @click="doFullScreen" circle><svg-icon :icon-class="fullscreen?'fullscreen-shrink':'fullscreen-expand'" /></el-button>
      </el-tooltip>
      
      <el-select
        class="search-bar"
        :class="expandSearch?'expand':'resetExpand'"
        v-model="search"
        filterable
        @focus="expendInput"
        @blur="resetInput"
        remote
        clearable
        reserve-keyword
        placeholder="关键词搜索"
        :remote-method="remoteMethod"
        :loading="loading"
        no-data-text="无数据"
        loading-text="加载中"
        ref="search">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @click.native="selectTo(item.path)">
        </el-option>
      </el-select>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="$router.push({path:'/user/personCenter'})">
            个人中心
          </el-dropdown-item>
          <el-dropdown-item @click.native="drawer = true">
            布局设置
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-drawer
      title="自定义设置"
      :visible.sync="drawer">
      <div style="padding:20px 10px 0px 20px;">
        <el-form label-position="top" label-width="80px">
          <el-form-item label="主题设置">
            <el-tooltip class="item" v-for="(theme,index) in themeListDo" effect="dark" :content="theme.label" placement="bottom-start">
              <el-image
                :style="theme.style"
                :key="theme.title"
                :src="theme.url"
                :alt="theme.title"
                @click="changeTheme(theme.title,index)"
                fit="fill">
              </el-image>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-slider
              v-model="fontSize"
              show-input
              :min="8"
              :max="25"
              @change="changeFontSize">
            </el-slider>
          </el-form-item>
          <el-form-item label="关闭标签栏">
            <el-switch
              v-model="closeTags"
              active-text="开启"
              inactive-text="关闭"
              @change="closeTagsBar">
            </el-switch>
          </el-form-item>
          <el-form-item label="关闭侧边导航栏">
            <el-switch
              v-model="closeSide"
              active-text="开启"
              inactive-text="关闭"
              @change="closeSideBar">
            </el-switch>
          </el-form-item>
          <el-form-item label="关闭顶部栏">
            <el-switch
              v-model="showNavBar"
              active-text="开启"
              inactive-text="关闭"
              @change="closeNavBar">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import notice from './Sidebar/notice.vue'
const unActiveTheme = {
        width: '50px',
        height: '50px',
        'margin-left': '10px'
      }
const activeTheme = {
        width: '80px',
        height: '80px',
        border: '2px solid #003afa',
        'margin-left': '10px'
      }
const themeList = [
      {
        title:'dark',
        url:'http://vue.ruoyi.vip/static/img/dark.412ca67e.svg',
        style: unActiveTheme,
        label:'深色主题'
      },
      {
        title:'light',
        url:'http://vue.ruoyi.vip/static/img/light.4183aad0.svg',
        style: unActiveTheme,
        label: '浅色主题'
      } 
    ]
export default {
  components: {
    Breadcrumb,
    Hamburger,
    notice
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      expandSearch: false,  // 拓展输入框 状态
      search: '',
      loading: false,
      options: [],
      fullscreen: false,
      drawer: false,
      fontSize: 14,
      themeListDo: themeList,
      closeSide: true,
      closeTags: true,
      noticeNumber: 0,
      activeTab: 'message' //激活的tab
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'menusRoutes',
      'closeNavs',
    ]),
    showNavBar:{
      get() {
          return this.closeNavs
        },
      set() {}
    },
  },
  methods: {
    //因为popover和tab绑在一起会出现bug，所以加了这个两个方法
    popoverAfterEnterEvent(){//popover加载完毕事件
      this.activeTab = 'message'
    },
    popoverShowEvent(){//popover显示事件
      this.activeTab = ''
    },

    toChat(){//跳转到聊天室页面
      this.$router.push({path:'/toChat/chatRoom'})
    },
    getNoticeNum(data){//获取消息数量
      this.noticeNumber = data
    },
    closeTagsBar(){//关闭标签栏
      this.$store.commit('settings/changeTagsBar',{closeTagsBar:this.closeTags})
    },
    closeNavBar(){//关闭顶部栏
      this.$store.commit('settings/changeNavBar',{closeNavBar:this.closeNav})
    },
    closeSideBar(){
      this.$store.commit('settings/changeSideBar',{closeSideBar:this.closeSide})
    },
    changeTheme(themeTitle,clickIndex){//改变主题
      for(let i=0;i<this.themeListDo.length;i++){
        if(clickIndex===i){
          this.themeListDo[i].style=activeTheme
        }else{
          this.themeListDo[i].style=unActiveTheme
        }
      }
      this.$store.commit('settings/changeThemeColor',{themeColor:themeTitle})
    },
    changeFontSize(){//改变字体大小
      this.$store.commit('settings/changeFontSize',{fontSize:this.fontSize})
    },
    doFullScreen(){//全屏
      if (this.fullscreen){
        if (document.exitFullscreen()){
            document.exitFullscreen();
          }else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }else if (document.mozCancelFullScreen){
            document.mozCancelFullScreen
          }else if (document.msExitFullScreen){
            document.msExitFullScreen
          }
        }else {
          let element=document.documentElement
          if (element.requestFullscreen){
            element.requestFullscreen()
          }else if (element.webkitRequestFullScreen){
            element.webkitRequestFullScreen()
          }else if (element.mozRequestFullScreen){
            element.mozRequestFullScreen()
          }else if (element.msRequestFullScreen){
            element.msRequestFullScreen()
          }
        }
        this.fullscreen=!this.fullscreen
    },
    selectTo(path){//查询跳转
      this.$router.push({path:path})
      this.search = ''  //跳转之后清空查询值
      this.$refs.search.blur()   //跳转之后 失去一次焦点
      // console.log(path)
    },
    remoteMethod(searchKey) {//输入框改变值就会执行
      this.loading = true
      if (searchKey !== ''&&this.expandSearch===true) { // 如果输入的不为空，则加载数据
        let dealOption = []
        let tempOption = this.menusRoutes  // 处理一下显示的optionList
        for(const father of tempOption){
          if(father.meta&&!father.hidden&&father.children.length>=2){ //如果父元素中有meta属性并且不为隐藏,则肯定有子元素
            for(const son of father.children){
              if(son.meta.title.indexOf(searchKey)!=-1){//如果子元素中的meta title跟搜索的有相同则返回选框
                dealOption.push({
                  value: father.meta.title + " > " + son.meta.title,
                  label: father.meta.title + " > " + son.meta.title,
                  path: father.path+"/"+son.path
                })
              }
            }
          }else if(!father.hidden&&father.children&&father.children[0].meta.title.indexOf(searchKey)!=-1){//这是单孩子的路由
            if(father.path === "/"){
              father.path=''
            }
            dealOption.push({
              value: father.children[0].meta.title,
              label: father.children[0].meta.title,
              path: father.path+"/"+father.children[0].path
            })
          }
        }
        this.options = dealOption
        this.loading = false
      }else{
        this.options = []
        this.loading = false
      }
    },
    expendInput() {  // 伸展输入框
      this.expandSearch = true
      if(this.search===''){
        this.options = []
      }
    },
    resetInput() {  // 离开输入框焦点 缩小输入框
      this.expandSearch = false
    },
    toggleSideBar() {//
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$message({
        message: '已成功退出',
        type: 'success',
        duration: 1 * 1000
      })
      this.$store.commit('settings/changeFontSize',{fontSize:14})//退出之后重置字体大小
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
  },
  mounted(){
    this.themeListDo[0].style=activeTheme
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .search-bar {
    position: relative;
    margin-right: 10px;
    top: -20px;
    transition: 0.5s
  }

  .expand {
    width: 200px;
  }

  .resetExpand {
    width: 102px;
  }


  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }



    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          margin-top: 10px;
          cursor: pointer;
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
