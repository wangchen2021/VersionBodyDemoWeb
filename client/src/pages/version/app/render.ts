import { StatusFrameColors } from "@/pages/Version/config/colors";
import { VersionStatusTypes } from "@/pages/Version/config/status";
import { getFourVertices } from "@/shared/utils/Math"
import type { Keypoint } from "@tensorflow-models/pose-detection";
export class Render {
    canvas!: HTMLCanvasElement
    ctx!: CanvasRenderingContext2D
    diffX = 0
    diffY = 0
    radio = 0
    scoreLine = 0.3
    frameColor = StatusFrameColors[VersionStatusTypes.CV_CHECK_WRONG]
    sectionPoints = [
        [12, 14],
        [14, 16],
        [11, 13],
        [13, 15],
        [17, 5],
        [17, 6],
        [8, 10],
        [6, 8],
        [5, 7],
        [7, 9],
        [18, 12],
        [18, 11],
        [17, 19],
        [19, 20],
        [20, 21],
        [21, 22],
        [22, 18]
    ]

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

    setFrameColor(frameColor: string) {
        this.frameColor = frameColor
    }

    renderFrame(points: Keypoint[]) {
        const len = points.length
        for (let i = 0; i < len; i++) {
            const point = points[i]
            if (!point.score || point.score < this.scoreLine || i < 5) continue
            const { x, y } = point
            const { x: dx, y: dy } = this.getDrawXY(x, y)
            this.renderDot(dx, dy)
        }
        //绘制骨架
        for (let section of this.sectionPoints) {
            this.renderSection(points[section[0]], points[section[1]])
        }
    }

    renderDot(x: number, y: number) {
        const { ctx } = this
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, 2 * Math.PI)
        ctx.fillStyle = this.frameColor
        ctx.fill()
    }

    renderSection(ps: Keypoint, pe: Keypoint) {
        if ((ps.score && ps.score < this.scoreLine) || (pe.score && pe.score < this.scoreLine)) return
        ps = this.getDrawXY(ps.x, ps.y)
        pe = this.getDrawXY(pe.x, pe.y)
        const { A, B, C, D } = getFourVertices(ps, pe)
        const { ctx } = this
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(A.x, A.y)
        ctx.lineTo(C.x, C.y)
        ctx.lineTo(B.x, B.y)
        ctx.lineTo(D.x, D.y)
        ctx.lineWidth = 4
        ctx.strokeStyle = this.frameColor
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
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