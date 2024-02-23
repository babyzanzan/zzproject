<template>
  <div :class="{'has-logo':showLogo}" v-if="closeSide">
    <logo v-if="showLogo" :collapse="isCollapse" :fontColor="themeColor==='light'?variables.logoColorLight:variables.logoColor" :style="{'background-color':themeColor==='light'?variables.menuBgLight:variables.menuBg}" />
    <el-scrollbar wrap-class="scrollbar-wrapper" :class="themeColor" :style="{'background-color':themeColor==='light'?variables.menuBgLight:variables.menuBg}">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="themeColor==='light'?variables.menuBgLight:variables.menuBg"
        :text-color="themeColor==='light'?variables.menuTextLight:variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'themeColor',
      'closeSide'
    ]),
    routes() {
      //return this.$router.options.routes
      return this.$store.getters.menusRoutes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
