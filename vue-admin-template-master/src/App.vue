<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      fontSizeDef: '14px'
    }
  },
  mounted(){
    // setInterval(()=>{
    //   debugger
    // },500)
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))   //监听页面刷新触发事件
  },
  methods:{
    beforeunloadHandler(e) {    //根据事件进行操作进行操作
      this.$store.dispatch('user/setFlag', 0)
    }
  },
}
</script>
