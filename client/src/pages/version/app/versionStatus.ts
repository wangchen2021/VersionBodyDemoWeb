import type { Render } from "@/pages/Version/app/render"
import { GlobalDetector } from "@/pages/Version/app/detector"
import { StatusFrameColors } from "../config/colors"
import { VersionStatusTypes } from "../config/status"

//状态机
export class VersionStatus {

    static scoreCvLine = 0.5

    detector: InstanceType<typeof GlobalDetector> = new GlobalDetector()
    status = VersionStatusTypes.CV_CHECK_WRONG
    taskTimer: NodeJS.Timeout | null = null
    render: Render | null = null
    checkFps = 5
    nextCallback: Function[] = []

    constructor() {
        this.status = VersionStatusTypes.CV_CHECK_WRONG
    }

    bindRender(render: Render) {
        this.render = render
    }

    start() {
        if (!this.render) {
            console.error("bind no render");
        } else if (!this.detector || !this.detector.isInit) {
            console.error("detector not init");
        }
        this.processStatus()
    }

    processStatus() {
        switch (this.status) {
            case VersionStatusTypes.CV_CHECK_WRONG:
                this.cvCheckWrong()
                break
            case VersionStatusTypes.CV_CHECK_RIGHT:
                break
        }
    }

    cvCheckWrong() {
        this.taskTimer = setInterval(() => {
            const allPoints = this.detector.pose[0].keypoints
            const points = [allPoints[5], allPoints[6], allPoints[10], allPoints[9], allPoints[12], allPoints[11]]
            // const points = [allPoints[5], allPoints[6], allPoints[10], allPoints[9], allPoints[12], allPoints[11], allPoints[15], allPoints[16]]
            if (!points.some(point => !point.score || point.score < VersionStatus.scoreCvLine)) {
                this.next()
                clearInterval(this.taskTimer!)
                this.taskTimer = null
            }
        }, 1000 / this.checkFps)
    }

    updateFrameColor() {
        this.render?.setFrameColor(StatusFrameColors[this.status])
    }

    next() {
        if (this.status < VersionStatusTypes.FINISH) {
            this.status++
            this.updateFrameColor()
        } else {
            console.warn(`Status is already set as finish`);
        }
        this.triggerNextCallbacks()
        this.processStatus()
        return this
    }

    bindNextCallback(fn: Function) {
        this.nextCallback.push(fn)
    }

    triggerNextCallbacks() {
        this.nextCallback.forEach(fn => fn())
    }
}