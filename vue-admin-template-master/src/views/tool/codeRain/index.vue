<!-- 代码雨 -->
<template>
    <div>
        <canvas id="c"></canvas>
    </div>

</template>
<script>
export default {
    name:'codeRain',
    data () {
        return {
          canvas: null,
          ctx: null,
          chinese: "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+",
          font_size: 30,
          columns: 0,
          drops: [],
        }
    },
    methods:{
        initCanvas() {
          this.canvas.height = window.innerHeight;
          this.canvas.width = window.innerWidth;
          this.columns = this.canvas.width / this.font_size;
        },
        initDrops() {
          for (let x = 0; x < this.columns; x++) {
            this.drops[x] = 1;
          }
        },
        draw() {
          this.ctx.fillStyle = "rgba(0,0,0,0.05)";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "#0F0";
          this.ctx.font = this.font_size + "px arial";
          for (let i = 0; i < this.drops.length; i++) {
            const text = this.chinese[Math.floor(Math.random() * this.chinese.length)];
            this.ctx.fillText(text, i * this.font_size, this.drops[i] * this.font_size);
            if (this.drops[i] * this.font_size > this.canvas.height && Math.random() > 0.975) {
              this.drops[i] = 0;
            }
          this.drops[i]++;
        }
      }
    },
    computed:{
    },
    mounted(){
      this.canvas = document.getElementById("c");
      this.ctx = this.canvas.getContext("2d");
      this.initCanvas();
      this.initDrops();
      setInterval(this.draw, 50);
    }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
div {
  background: black;
}
 
canvas {
  display: block;
}
</style>
