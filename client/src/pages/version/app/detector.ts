import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import { calculateLengthBetweenToPoints, getFourPointsOnTwoPoints } from '../../../shared/utils/Math';
import { CDN } from '@/constant';

class Detector {
    static instance: Detector
    modelRef!: poseDetection.PoseDetector
    isInit = false
    task: Function[] = []
    pose: poseDetection.Pose[] = []
    source: HTMLVideoElement | null = null
    FPS = 20
    detectorTimer: NodeJS.Timeout | null = null
    detectCallback: Array<(pose: poseDetection.Pose[]) => any> = []

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();
                this.modelRef = await poseDetection.createDetector(
                    poseDetection.SupportedModels.MoveNet,
                    {
                        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
                        enableSmoothing: true,
                        modelUrl: CDN + "/movenet-tfjs-singlepose-thunder-v4/model.json",
                    }
                );
                console.log("load finish");
                this.isInit = true
                this.triggerFinish()
                resolve(this.modelRef)
            } catch (err) {
                console.error("load failed", err);
                reject(err)
            }
        })
    }

    setSource(src: HTMLVideoElement) {
        this.source = src
    }

    startDetect() {
        console.log("start detect");
        this.detectorTimer = setInterval(() => {
            this.detectPose()
        }, 1000 / this.FPS)
    }

    async detectPose() {
        try {
            const video = this.source
            if (!video) return
            await this.detectVideo(video)
            this.triggerDetectCallbacks()
        } catch (err) {
            console.error('detect fail', err);
        }
    }

    bindDetect(fn: (pose: poseDetection.Pose[]) => any) {
        this.detectCallback.push(fn)
    }

    triggerDetectCallbacks() {
        const { pose } = this
        this.detectCallback.forEach(fn => fn(pose))
    }

    async detectVideo(video: HTMLVideoElement) {
        const pose = await this.modelRef.estimatePoses(video, {
            flipHorizontal: false,
        });
        let points = pose[0]?.keypoints;
        if (points) {

            //添加颈部中心点 [17]
            const pointsLeftShoulder = points[6]
            const pointsRightShoulder = points[5]
            const shoulderLength = calculateLengthBetweenToPoints(pointsLeftShoulder, pointsRightShoulder)
            const centerPoint = {
                x: (pointsLeftShoulder.x + pointsRightShoulder.x) / 2,
                y: (pointsLeftShoulder.y + pointsRightShoulder.y) / 2 - shoulderLength / 6,
            }
            points.push(centerPoint)

            //添加腰中心点 [18]
            const pointsLeftLum = points[12]
            const pointsRightLum = points[11]
            const lumCenterPoint = {
                x: (pointsLeftLum.x + pointsRightLum.x) / 2,
                y: (pointsLeftLum.y + pointsRightLum.y) / 2,
            }
            points.push(lumCenterPoint)

            //获取脊柱点 [19,20,21,22]
            const spinePoints = getFourPointsOnTwoPoints(centerPoint, lumCenterPoint)
            points.push(...spinePoints)

        }
        this.pose = pose
        return pose
    }

    bindFinish(fn: Function, args: any[], context: any) {
        this.task.push(fn.bind(context, args))
    }

    triggerFinish() {
        while (this.task.length > 0) {
            const callback = this.task.shift()
            callback && callback()
        }
    }

    pause() {
        if (this.detectorTimer) {
            clearInterval(this.detectorTimer)
        }
    }

    destroy() {
        if (this.detectorTimer) {
            clearInterval(this.detectorTimer)
            this.detectorTimer = null
            this.modelRef.dispose()
            this.isInit = false
            this.source = null
            this.pose = []
        }
    }
}

export const GlobalDetector = new Proxy(Detector, {
    construct(target, args, newReceiver) {
        if (!target.instance) {
            target.instance = Reflect.construct(target, args, newReceiver)
        }
        return target.instance
    }
})