<!-- 坤坤代码动图 -->
<template>
    <div style>
        <p id="wrap"></p>
    </div>
</template>
<script>
export default {
    name:'backgroundClip',
    data () {
        return {
            
        }
    },
    computed:{
    },
    mounted(){
        const p = document.getElementById('wrap')
        p.innerText = Array(200).fill(Math.random() * 1234567890 + 1000000000).reduce((str, item) => str + parseInt(item).toString(2), '')
    }
}
</script>
<style scoped>
div,p {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
div {
    height: 100vh;
    width: 100vw;
    background: #000;
    overflow: hidden;
}
p {
    height: 100%;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: url('../../../assets/kunkunbg.gif');
    background-position: center;
    background-size: cover;
    mix-blend-mode: hard-light;
    filter: grayscale(1) invert(1);
    word-break: break-all;
}
</style>