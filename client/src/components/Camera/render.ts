export class Render {
    canvas!: HTMLCanvasElement
    ctx!: CanvasRenderingContext2D
    diffX = 0
    diffY = 0
    radio = 0
    scoreLine = 0.3
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.ctx = ctx
    }

    private getDrawXY = (x: number, y: number) => {
        return {
            x: x * this.radio - this.diffX,
            y: y * this.radio - this.diffY
        }
    }

    renderFrame(points: any[]) {
        this.clean()
        for (let point of points) {
            if (point.score < this.scoreLine) continue
            const { x, y } = point.position
            const { x: dx, y: dy } = this.getDrawXY(x, y)
            this.renderDot(dx, dy)
        }
    }

    renderDot(x: number, y: number) {
        const { ctx } = this
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = "red"
        ctx.fill()
    }

    resetDiff() {
        this.diffX = 0
        this.diffY = 0
    }

    clean() {
        const { ctx, canvas } = this
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
}