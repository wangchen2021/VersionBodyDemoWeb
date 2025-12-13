import { CDN } from "@/constant"
import { calculateAngleOfLegs } from "@/shared/body/bodyAngle"
import { calculateVectorAngle, getVector } from "@/shared/utils/Math"
import type { Keypoint } from "@tensorflow-models/pose-detection"

export type CheckOps = {
    start: any[],
    progress: any[],
    finish: any[]
}

export interface CheckOpsResult {
    score: number,
    error: {
        subtitle: string,
        audio: string
    } | null
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

export const bodyErrors = {
    squat_feet_close: {
        subtitle: "Spread your feet more",
        audio: CDN + "/audio/squat_feet_close.MP3",
    },
    squat_feet_far: {
        subtitle: "Bring your feet closer",
        audio: CDN + "/audio/squat_feet_far.MP3",
    },
    not_straight_back: {
        subtitle: "Keep your back straight",
        audio: CDN + "/audio/not_straight_back.MP3",
    }
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

const checkFoots = (points: Keypoint[]): CheckOpsResult => {
    if (!points || points.length === 0) return {
        score: 10,
        error: null
    }
    const angle = calculateAngleOfLegs(points)
    if (angle < 30) {
        //脚太近
        return {
            error: bodyErrors.squat_feet_close,
            score: (40 - angle) * 2
        }
    }
    if (angle > 50) {
        //脚太远
        return {
            error: bodyErrors.squat_feet_far,
            score: (angle - 50) * 2,
        }
    }
    return {
        score: Math.abs(angle - 40) * 2,
        error: null
    }
}

const checkVerticalSpine = (points: Keypoint[]): CheckOpsResult => {
    const v1 = getVector(points[6], points[5])
    const v2 = getVector(points[12], points[11])
    const angle = calculateVectorAngle(v1, v2)
    const diff = Math.abs(angle)
    if (diff > 10) {
        //背不直
        return {
            error: bodyErrors.not_straight_back,
            score: Math.min((diff - 10) * 3, 100),
        }
    }
    return {
        score: diff * 2,
        error: null
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

