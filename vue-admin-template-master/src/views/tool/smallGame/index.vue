<!-- 遥控飞船 解压小游戏 -->
<template>
    <div>
        <canvas id="canvas" style="background:black;"></canvas>
    </div>
</template>
<script>
    export default {
    name:'smallGame',
    data () {
        return {
            aa:''
        }
    },
    methods:{
        startGame() {
            let that = this
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
            class Ship {
                constructor() {
                    this.x = 0
                    this.y = 0
                    this.v = 0
                    this.angle = 0
                    this.flag = false
                }
                draw(context) {
                    if (this.x < 0) {
                        this.x = context.canvas.width
                    } else if (this.x > context.canvas.width) {
                        this.x = 0
                    }
                    if (this.y < 0) {
                        this.y = context.canvas.height
                    } else if (this.y > context.canvas.height) {
                        this.y = 0
                    }
                    if (this.v >= 20) {
                        this.v = 20
                    }
                    var vx = this.v * Math.cos(this.angle)
                    var vy = this.v * Math.sin(this.angle)
                    this.x += vx
                    this.y += vy
                    context.save()
                    context.translate(this.x, this.y)
                    context.rotate(this.angle)
                    context.beginPath()
                    context.moveTo(-15, -10)
                    context.lineTo(-15, 10)
                    context.lineTo(10, 0)
                    context.closePath()
                    context.lineWidth = 2
                    context.strokeStyle = "white"
                    context.stroke()
                    if (this.v > 0) {
                        context.beginPath()
                        context.moveTo(-15, -5)
                        context.lineTo(-15 - this.v * (this.flag ? 1 : 3), 0)
                        context.lineTo(-15, 5)
                        context.closePath()
                        context.stroke()
                        this.flag = !this.flag
                    }
                    context.restore()
                }
            }
            class Control {
                constructor() {
                    this.xTail = 0
                    this.yTail = 0
                    this.xHead = 0
                    this.yHead = 0
                    this.visible = false
                }
                draw(context) {
                    if (!this.visible) return
                    context.save()
                    context.beginPath()
                    context.strokeStyle = "cyan"
                    context.lineWidth = 6
                    context.arc(this.xTail, this.yTail, 40, 0, Math.PI * 2)
                    context.stroke()
                    context.beginPath()
                    context.lineWidth = 2
                    context.arc(this.xTail, this.yTail, 60, 0, Math.PI * 2)
                    context.stroke()
                    context.beginPath()
                    context.arc(this.xHead, this.yHead, 40, 0, Math.PI * 2)
                    context.stroke()
                    context.restore()
                }
            }
            function captureMouse(element) {
                var mouse = { x: 0, y: 0 }
                element.addEventListener('mousemove', function (event) {
                    var x = event.pageX - element.offsetLeft
                    var y = event.pageY - element.offsetTop
                    mouse.x = x
                    mouse.y = y
                })
                return mouse
            }
            var context = canvas.getContext('2d')
            var ship = new Ship()
            ship.x = canvas.width / 2
            ship.y = canvas.height / 2
            var control = new Control()
            var mouse = captureMouse(canvas)
            canvas.addEventListener('mousedown', function () {
                control.xHead = control.xTail = mouse.x
                control.yHead = control.yTail = mouse.y
                control.visible = true
            })
            canvas.addEventListener('mousemove', function () {
                if (control.visible) {
                    control.xHead = mouse.x
                    control.yHead = mouse.y
                    var dx = control.xHead - control.xTail
                    var dy = control.yHead - control.yTail
                    var d = Math.sqrt(dx * dx + dy * dy)
                    ship.v = d * 0.1
                    ship.angle = Math.atan2(dy, dx)
                }
            })
            canvas.addEventListener('mouseup', function () {
                control.visible = false
            });
            (function drawFrame() {
                that.aa = window.requestAnimationFrame(drawFrame)
                context.clearRect(0, 0, canvas.width, canvas.height)
                ship.draw(context)
                control.draw(context)
            })()
        }
    },
    computed:{
    },
    mounted(){
        this.canvas = document.getElementById("canvas");
        this.startGame()
    },
    beforeDestroy() {
        window.cancelAnimationFrame(this.aa)
    },
}
</script>