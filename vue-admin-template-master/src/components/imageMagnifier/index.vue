<!-- 图片放大镜插件 -->
<template>
    <div>
        <img-zoom class="zoomIMg" src="https://t12.baidu.com/it/u=2749264489,203508479&fm=30&app=106&f=JPEG?w=640&h=644&s=F128B95418F1D3E34701045C030050E2" alt="" />
    </div>
</template>
<script>
import ImgZoom from 'ht-image-zoomer'
export default {
  name: 'imageMagnifier',
  data() {
    return {
        imgsList:'https://img-home.csdnimg.cn/images/20201124032511.png'
    }
  },
  components: {
    ImgZoom // 注册 
  },
}
</script>