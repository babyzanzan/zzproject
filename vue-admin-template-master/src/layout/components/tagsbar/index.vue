<!-- 标签控件 -->
<template>
    <div class="tag-bar" v-if="closeTags">
        <div class="left-menu">
            <el-tabs type="card" 
                @tab-click="clickTitle"
                @tab-remove="handleClose"
                style="height: 41px;margin-left: 10px;margin-right: 30px;"
                v-model="tabsValue">
                <el-tab-pane
                    :key="tag.path"
                    v-for="(tag,index) in tags"
                    :label="tag.title"
                    :closable="!(tag.title==='主页'&&index===0)"
                    :name="tag.title"
                    >
                </el-tab-pane>
            </el-tabs>
        </div>
        <div :class="closeNavs?'close-tags':'close-tags-nohead'" id="closeTags">
            <el-dropdown @command="handleCommand" @visible-change="rotateTagsClose">
                <span class="el-dropdown-link">
                    <i slot="reference" class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="optionItem in tagsOptions" :key="optionItem.value" :command="optionItem.value">{{optionItem.lable}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
      return {
        items: [],
        tagsOptions: [{
            value:'closeTags',
            lable:'清空标签'
        }],
        tabsValue:'主页'
      }
    },
    watch: {
        $route(newValue,oldValue) {//监听路由变化 
            let newRouter = this.tags.every(function(tag) {//如果新增的路由不在原先路由内，则新增
                return tag.path !== newValue.path;
            })
            if(newRouter){
                this.addNavbarTag()
            }
            this.tabsValue = newValue.meta.title
        },
    },
    computed:{
        ...mapGetters(['tags','closeTags','closeNavs']),
    },
    mounted(){//加载控件时的路由判断和tab的active显示
        let router = this.$route
        let newRouter = this.tags.every(function(tag) {//如果加载的不路由在原先路由内
            return tag.title !== router.meta.title;
        })
        if(router.meta.title!==this.tabsValue&&newRouter){//如果加载的时候路由和tab的值不一样，添加路由到tab
            this.addNavbarTag()
        }
        this.tabsValue = router.meta.title
    },
    methods: {
        covertNameToTag(tabName){//将tab的名字转换成tag对象
            let tag = {}
            for(const element of this.tags){
                if(tabName===element.title){
                    tag = element
                }
            }
            return tag
        },
        clickTitle(tab){   // 点击标题路由
            this.tabsValue = tab.label
            let toPath = this.covertNameToTag(tab.label).path
            this.$router.push({ path: toPath })            // 跳转
        },
        addNavbarTag(){   // 添加表头路由
            let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
            this.$store.commit('settings/addNavbarTag', { title: matched[(matched.length)-1].meta.title , path: matched[(matched.length)-1].path })
        },
        // handleLink(item) {
        //     const { redirect, path } = item
        //     if (redirect) {
        //         this.$router.push(redirect)
        //         return
        //     }
        //     this.$router.push(this.pathCompile(path))
        // },
        handleClose(tabName) {   //删除 navbartagtitle
            let tagItem = this.covertNameToTag(tabName)
            this.$store.dispatch('settings/closeTags', tagItem)
            .then(res=>{
                res?this.$router.push({path:res}):''
            })
        },
        rotateTagsClose(state){//旋转 tags关闭菜单
            state?closeTags.classList.add('rotateTags'):closeTags.classList.remove('rotateTags')
        },
        handleCommand(command) {//初始化tag标签,即关闭所有标签页（除主页）
            if(command==='closeTags'){
                this.$store.commit('settings/initTag')
                this.$router.push({path:'/dashboard'})
            }
        }
    }
}
</script>
<style>
.tag-bar {
    width: 100%;
    background-color: rgb(244, 248, 252);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.left-menu {
    line-height: 40px;
    position: relative;
}
.close-tags {
    position: absolute;
    right: 10px;
    top: 85px;
}
.close-tags-nohead {
    position: absolute;
    right: 10px;
    top: 13px;
}
.el-tabs__item.is-active {
    background-color: rgb(255, 255, 255);
}
#closeTags{
  transition:all 0.5s;
}
/* 动画旋转45度 */
#closeTags.rotateTags{
  transform:rotate(45deg);
}
#closeTags.rotateTags span{
  color:skyblue;
}
</style>
