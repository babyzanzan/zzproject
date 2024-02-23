<!-- java代码生成器,下载的功能需要后端实现,暂时使用在在线端进行实现 -->
<template>
    <div>
        <iframe :src="linkUrl" frameborder="0" :style="{'height':ifHeight,'width':'100%','margin-left':'10px'}"></iframe>
    </div>
</template>
<script>
export default {
    name:'javaCodeGenerator',
    data () {
        return {
            linkUrl:''
        }
    },
    computed:{
        ifHeight(){
            return document.body.clientHeight + 'px'
        }
    },
    mounted(){
        this.linkUrl =  "https://java.bejson.com/generator/"
    }
}
</script>