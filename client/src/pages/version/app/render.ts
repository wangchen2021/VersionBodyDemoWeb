import { StatusFrameColors } from "@/pages/Version/config/colors";
import { VersionStatusTypes } from "@/pages/Version/config/status";
import { getFourVertices } from "@/shared/utils/Math"
import type { Keypoint } from "@tensorflow-models/pose-detection";
import type { BodyErrorType } from "../config";
export class Render {
    canvas!: HTMLCanvasElement
    ctx!: CanvasRenderingContext2D
    diffX = 0
    diffY = 0
    radio = 0
    scoreLine = 0.3
    frameColor = StatusFrameColors[VersionStatusTypes.CV_CHECK_WRONG]
    lineWidth = 5
    drawPoints: Keypoint[] = []
    animalId = 0
    renderError: BodyErrorType | null = null
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
        const drawPoints: Keypoint[] = []
        for (let i = 0; i < len; i++) {
            const point = points[i]
            const { x, y } = point
            const { x: dx, y: dy } = this.getDrawXY(x, y)
            drawPoints.push({ ...point, x: dx, y: dy })
            if (!point.score || point.score < this.scoreLine || i < 5) continue
            this.renderDot(dx, dy)
        }

        this.drawPoints = drawPoints

        for (let section of this.sectionPoints) {
            this.renderSection(drawPoints[section[0]], drawPoints[section[1]])
        }
        this.renderErrorTip()
    }

    renderErrorTip() {
        const error = this.renderError
        if (!error) return
        switch (error.name) {
            case "squat_feet_close":
                this.renderArrow(this.drawPoints[15], this.drawPoints[16])
                this.renderArrow(this.drawPoints[16], this.drawPoints[15])
                break
            case "squat_feet_far":
                this.renderArrow(this.drawPoints[15], this.drawPoints[16])
                this.renderArrow(this.drawPoints[16], this.drawPoints[15])
                break
            case "not_straight_back":
                const errorSections = [
                    [17, 19],
                    [19, 20],
                    [20, 21],
                    [21, 22],
                    [22, 18]
                ]
                for (let item of errorSections) {
                    this.renderSection(this.drawPoints[item[0]], this.drawPoints[item[1]], StatusFrameColors[VersionStatusTypes.CV_CHECK_WRONG], this.lineWidth * 1.5)
                }
                break
        }
    }

    setRenderError(err: BodyErrorType | null) {
        this.renderError = err
    }

    renderDot(x: number, y: number) {
        const { ctx } = this
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, 2 * Math.PI)
        ctx.fillStyle = this.frameColor
        ctx.fill()
    }

    renderSection(ps: Keypoint, pe: Keypoint, color?: string, lineWidth?: number) {
        if ((ps.score && ps.score < this.scoreLine) || (pe.score && pe.score < this.scoreLine)) return
        const { A, B, C, D } = getFourVertices(ps, pe)
        const { ctx } = this
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(A.x, A.y)
        ctx.lineTo(C.x, C.y)
        ctx.lineTo(B.x, B.y)
        ctx.lineTo(D.x, D.y)
        ctx.lineWidth = lineWidth || this.lineWidth
        ctx.strokeStyle = color || this.frameColor
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }

    renderArrow(A: Keypoint, B: Keypoint, arrowSize?: number) {
        if ((A.score && A.score < this.scoreLine) || (B.score && B.score < this.scoreLine)) return
        const arrowLineWidth = this.lineWidth * 4
        const size = arrowSize || arrowLineWidth * 4
        const angle = Math.atan2(B.y - A.y, B.x - A.x)
        const { ctx } = this
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(A.x, A.y)
        ctx.lineTo(B.x, B.y)
        ctx.lineWidth = arrowLineWidth
        ctx.strokeStyle = StatusFrameColors[VersionStatusTypes.CV_CHECK_WRONG]
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(B.x, B.y)
        ctx.lineTo(
            B.x - size * Math.cos(angle - Math.PI / 6),
            B.y - size * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
            B.x - size * Math.cos(angle + Math.PI / 6),
            B.y - size * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fillStyle = StatusFrameColors[VersionStatusTypes.CV_CHECK_WRONG]
        ctx.fill()
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