import { CDN } from "@/constant"
import { calculateAngleOfLegs } from "@/shared/body/bodyAngle"
import { calculateVectorAngle, getVector } from "@/shared/utils/Math"
import type { Keypoint } from "@tensorflow-models/pose-detection"

export type CheckOps = {
    start: any[],
    progress: any[],
    finish: any[]
}

export interface EstimatePlan {
    name: string,
    cn: string,
    videoSrc: string,
    seconds: number,
    reps: number,
    trigger: (points: Keypoint[]) => Boolean,
    actionEnd: (points: Keypoint[]) => Boolean,
    checkOps: CheckOps
}


const SquatTrigger = (points: Keypoint[]) => {
    if (!points || points.length === 0) return false
    const angle = calculateAngleOfLegs(points)
    const ly = points[8].y
    const ry = points[7].y
    const cy = points[21].y
    if (angle > 90) {
        return true
    }
    if (ly > cy && ry > cy) {
        return true
    }
    return false
}

const SquatActionEnd = (points: Keypoint[]) => {
    if (!points || points.length === 0) return false
    const lv1 = getVector(points[12], points[14])
    const lv2 = getVector(points[14], points[16])
    const lv3 = getVector(points[11], points[13])
    const lv4 = getVector(points[13], points[15])
    const l1Angle = calculateVectorAngle(lv1, lv2)
    const l2Angle = calculateVectorAngle(lv3, lv4)
    if (l1Angle > 15 || l2Angle > 15) {
        return false
    }
    return !SquatTrigger(points)
}

const checkFoots = (points: Keypoint[]) => {
    if (!points || points.length === 0) return false
    const angle = calculateAngleOfLegs(points)
    if (angle < 30) {
        //脚太近
        return false
    }
    if (angle > 70) {
        //脚太远
        return false
    }
    return true
}

const checkVerticalSpine = (points: Keypoint[]) => {
    const v1 = getVector(points[6], points[5])
    const v2 = getVector(points[17], points[18])
    const angle = calculateVectorAngle(v1, v2)
    const diff = Math.abs(90 - angle)
    if (diff > 15) {
        //背不直
    }
}

export const createFinishData = (plan: EstimatePlan) => {
    const res = []
    for (let i = 0; i < plan.reps; i++) {
        res.push({
            value: 0,
            total: 100
        })
    }
    return res
}


export const plans: Record<string, EstimatePlan> = {
    Squat: {
        name: "Half Sumo Squat",
        cn: "深蹲",
        videoSrc: CDN + "/video/v1.mp4",
        seconds: 60,
        reps: 10,
        trigger: SquatTrigger,
        actionEnd: SquatActionEnd,
        checkOps: {
            start: [],
            progress: [],
            finish: [checkFoots, checkVerticalSpine]
        }
    }
}

