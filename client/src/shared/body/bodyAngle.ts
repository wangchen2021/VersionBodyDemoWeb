import type { Keypoint } from "@tensorflow-models/pose-detection";
import { calculateVectorAngle, getVector } from "../utils/Math";

export function calculateAngleOfLegs(keypoints: Keypoint[]) {
    const v1 = getVector(keypoints[12],keypoints[14])
    const v2 = getVector(keypoints[11],keypoints[13]) 
    return calculateVectorAngle(v1, v2)
}