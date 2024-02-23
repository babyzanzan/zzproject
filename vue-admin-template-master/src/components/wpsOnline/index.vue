<!-- 在线编辑word excel ppt控件 -->
<template>
    <div>
        <iframe :src="wpsOnlineUrl" frameborder="0" :style="{'height':'600px','width':'100%','margin-left':'1px','margin-right':'10px'}"></iframe>
    </div>
</template>
<script>
export default {
    name:'wpsOnline',
    props:['wpsOnlineUrl'],
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
}
</script>