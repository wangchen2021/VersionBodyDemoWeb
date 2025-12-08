import type { Render } from "@/pages/Version/app/render"
import { GlobalDetector } from "@/pages/Version/app/detector"
import { StatusFrameColors } from "../config/colors"
import { VersionStatusTypes } from "../config/status"
import * as poseDetection from '@tensorflow-models/pose-detection';

//状态机
export class VersionStatus {

    static scoreCvLine = 0.5

    detector: InstanceType<typeof GlobalDetector> = new GlobalDetector()
    status = VersionStatusTypes.WAIT_INIT
    render: Render | null = null
    checkFps = 5
    nextCallback: Function[] = []
    pose: poseDetection.Pose[] = []

    constructor() {
        this.status = VersionStatusTypes.WAIT_INIT
        this.detector.bindDetect(this.updatePose.bind(this))
    }

    start() {
        if (!this.render) {
            console.error("bind no render");
        } else if (!this.detector || !this.detector.isInit) {
            console.error("detector not init");
        }
        this.next()
        this.detector.startDetect()
    }

    bindRender(render: Render) {
        this.render = render
    }

    updatePose(pose: poseDetection.Pose[]) {
        this.pose = pose
        this.renderCamera()
        this.processStatus()
    }

    renderCamera() {
        const { pose } = this
        const render = this.render
        if (render) {
            render.clean()
            if (pose[0] && pose[0].keypoints) render.renderFrame(pose[0].keypoints)
        }
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
        const allPoints = this.pose[0]?.keypoints || []
        if (allPoints.length === 0) return;
        const points = [allPoints[5], allPoints[6], allPoints[10], allPoints[9], allPoints[12], allPoints[11]]
        // const points = [allPoints[5], allPoints[6], allPoints[10], allPoints[9], allPoints[12], allPoints[11], allPoints[15], allPoints[16]]
        if (!points.some(point => !point.score || point.score < VersionStatus.scoreCvLine)) {
            this.next()
        }
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
        return this
    }

    bindNextCallback(fn: Function) {
        this.nextCallback.push(fn)
    }

    triggerNextCallbacks() {
        this.nextCallback.forEach(fn => fn())
    }
}