<template>
    <div>
        <iframe :src="linkUrl" frameborder="0" :style="{'height':ifHeight,'width':'100%','margin-left':'10px'}"></iframe>
    </div>
</template>
<script>
export default {
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
        this.linkUrl =  "https://www.bilibili.com/"
    }
}
</script>