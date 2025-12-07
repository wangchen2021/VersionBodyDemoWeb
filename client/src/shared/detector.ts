import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';

class Detector {
    static instance: Detector
    modelRef!: poseDetection.PoseDetector
    isInit = false
    task: Function[] = []

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();
                this.modelRef = await poseDetection.createDetector(
                    poseDetection.SupportedModels.MoveNet,
                    {
                        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
                        enableSmoothing: true
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

    async detectVideo(video: HTMLVideoElement) {
        const pose = await this.modelRef.estimatePoses(video, {
            flipHorizontal: false,
        });
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
}

export const GlobalDetector = new Proxy(Detector, {
    construct(target, args, newReceiver) {
        if (!target.instance) {
            target.instance = Reflect.construct(target, args, newReceiver)
        }
        return target.instance
    }
})