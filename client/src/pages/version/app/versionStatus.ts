import type { Render } from "@/pages/Version/app/render"
import { GlobalDetector } from "@/pages/Version/app/detector"
import { StatusFrameColors, VersionStatusTypes } from "../config"
import * as poseDetection from '@tensorflow-models/pose-detection';
import type { EstimatePlan } from "../config/plan";
import type { AudioSwitchExpose } from "@/components/AudioSwitch";

//状态机
export class VersionStatus {

    static scoreCvLine = 0.5

    detector: InstanceType<typeof GlobalDetector> = new GlobalDetector()
    status = VersionStatusTypes.WAIT_INIT
    render: Render | null = null
    checkFps = 5
    nextCallback: Function[] = []
    pose: poseDetection.Pose[] = []
    taskTimer: NodeJS.Timeout | null = null
    plan: EstimatePlan | null = null
    startRecordAction = false
    actionScore = 100
    recordFinishCallback: Array<(score: number) => any> = []
    audio: AudioSwitchExpose | null = null
    timeCount = 0
    startDetectTime!: number

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

    bindPlan(plan: EstimatePlan) {
        this.plan = plan
    }

    bindAudio(audio: AudioSwitchExpose | null) {
        this.audio = audio
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
                this.keepRightPose()
                break
            case VersionStatusTypes.CV_CHECK_FINISH:
                this.next()
                break
            case VersionStatusTypes.START:
                //wait render
                break
            case VersionStatusTypes.SHOW_INFO:
                this.waitInfoShow()
                break
            case VersionStatusTypes.COUNTDOWN:
                //wait countdown
                break
            case VersionStatusTypes.DETECT:
                this.detectPlan()
                //detecting
                break
            case VersionStatusTypes.FINISH:
                //finished
                break
            default:
                break
        }
    }

    setStartDetectTime(time: number) {
        this.startDetectTime = time
    }

    detectPlan() {
        if (this.startRecordAction) return this.recordAction()
        const { plan, pose } = this
        if (!plan || !pose || !pose[0]) return;
        const { trigger } = plan
        if (trigger(pose[0].keypoints)) {
            this.startRecordAction = true
            this.recordAction()
        }
    }

    recordAction() {
        const { plan, pose } = this
        if (!plan || !pose || !pose[0]) return
        const { actionEnd } = plan
        if (actionEnd(pose[0].keypoints)) {
            this.recordFinish()
        }
    }

    recordFinish() {
        console.log("finish one rep");
        const { plan, recordFinishCallback, actionScore, pose } = this
        if (!plan || !pose || !pose[0]) return
        const finishCheckOps = plan.checkOps.finish

        //check
        finishCheckOps.forEach(fn => {
            fn(pose[0].keypoints)
        })

        //finish callback
        recordFinishCallback.forEach(fn => {
            fn(actionScore)
        });

        //reset
        this.startRecordAction = false
        this.actionScore = 100
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

    waitInfoShow() {
        if (this.taskTimer) return
        this.taskTimer = setTimeout(() => {
            this.next()
            clearTimeout(this.taskTimer!)
            this.taskTimer = null
        }, 5000);
    }

    keepRightPose() {
        if (this.taskTimer) return
        this.taskTimer = setTimeout(() => {
            this.next()
            clearTimeout(this.taskTimer!)
            this.taskTimer = null
        }, 3000)
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
        const { nextCallback } = this
        if (!nextCallback.includes(fn)) {
            nextCallback.push(fn)
        }
    }

    bindRecordFinishCallback(fn: (score: number) => any) {
        const { recordFinishCallback } = this
        if (!recordFinishCallback.includes(fn)) {
            recordFinishCallback.push(fn)
        }
    }

    triggerNextCallbacks() {
        this.nextCallback.forEach(fn => fn())
    }

    finish() {
        return new Promise((resolve, _reject) => {
            console.log("finish");
            setTimeout(() => {
                const { detector, startDetectTime } = this
                this.timeCount = Math.floor((Date.now() - startDetectTime) / 1000)
                detector.pause()
                detector.source?.pause()
                resolve(this.timeCount)
            }, 1500);
        })
    }
}