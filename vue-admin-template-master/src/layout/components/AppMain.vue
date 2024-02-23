<template>
  <section class="app-main">
    <chatRoomHover  v-if="showChatHover"/>

    <el-tooltip class="item refresh-head " effect="dark" content="还原顶部栏" placement="bottom" v-if="!closeNavs">
      <el-button icon="el-icon-caret-top" circle size="mini" style="color: skyblue;position: absolute; left: 50%;"  @click="refreshLayout"></el-button>
    </el-tooltip>

    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import chatRoomHover from '@/components/chatRoomHover/index.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  components:{
    chatRoomHover
  },
  computed: {
    key() {
      return this.$route.path
    },
    ...mapGetters([
      'showChatHover',
      'closeNavs'
    ])
  },
  methods:{
    refreshLayout(){//全屏模式下返回原来的布局
      this.$store.commit('settings/changeNavBar',{closeNavBar:true})
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.refresh-head {
  margin-top: 5px;
  z-index: 999;
  position: relative;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
