<!-- 滑动解锁模块 -->
<template>
    <div>
        <div slot="content" style="margin-top:20px;margin-left:20px;">
            <imageVerify 
                ref="imageVerify"
                :l="0"
                :r="0"
                :w="catcha.w"
                :h="catcha.h"
                :sh="catcha.sh"
                :sw="catcha.sw"
                :blockx="catcha.blockx"
                :blocky="catcha.blocky"
                :imgurl="catcha.imgurl"
                :miniimgurl="catcha.miniimgurl"
                :slider-text="catcha.text"
                @success="onSuccess"
                @fail="onFail"
                @refresh="onRefresh"
            />
        </div>
    </div>
</template>
<script>
import imageVerify from '@/components/slidUnlocked/index.vue'
export default {
    name:'sildLocked',
    components:{
        imageVerify
    },
    data(){
        return{
            catcha: {
                imgurl: 'https://img2.baidu.com/it/u=1814561676,2470063876&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',    // 大图，格式为http或者静态资源或base64都可
                miniimgurl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201801%2F04%2F20180104224518_wf2x8.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1710829502&t=b6292acb148aa62f591e0f5add6f31d3',    // 小图，格式为http或者静态资源或base64都可
                text: '向右滑动完成拼图',
                blockx: 10,     
                blocky: 30,  // 小图y轴位置
                h: 200,    // 大图高度
                w: 300,   // 大图宽度
                sh: 50,   // 小图高度
                sw: 50,   // 小图宽度
                modifyImg: ''
            },
        }
    },
    methods: {
        // 拼图成功的事件
        onSuccess(left) {
            this.visiblePop = false
            this.handleSubmit('formInline')
        },
        // 拼图失败的事件
        onFail() {
      
        },
        // 刷新拼图的事件
        onRefresh() {

        }
    }
}
</script>
