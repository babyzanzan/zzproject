<!-- 微信登录控件 -->
<!-- 
    appid:就是我们获取的appid
    scope:默认为snsapi_login
    theme:二维码颜色
    redirect_uri:回调域名，开发平台获取，当用户授权后就会跳转到这个地址
    href:二维码的样式
-->
<template>
    <div>
        <wxlogin :appid="appid" scope="snsapi_login" :theme="'black'"  :redirect_uri="redirect_uri" :href="'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX2Jyb3dzZXIgew0KICBkaXNwbGF5OiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnFyY29kZSB7DQogIGJvcmRlcjogbm9uZTsNCiAgd2lkdGg6IDIwMHB4Ow0KICBoZWlnaHQ6IDIwMHB4Ow0KfQ0KLmltcG93ZXJCb3ggLnN0YXR1c3sNCiAgZGlzcGxheTogbm9uZQ0KfQ=='"></wxlogin>
    </div>
</template>
<script>
import wxlogin from "vue-wxlogin";
export default {
    name:'wxLogin',
    components:{
        wxlogin
    }
}
</script>