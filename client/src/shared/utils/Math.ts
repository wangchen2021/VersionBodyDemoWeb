import type { Keypoint } from "@tensorflow-models/pose-detection"

export const calculateLengthBetweenToPoints = (p1: Keypoint, p2: Keypoint) => {
    const { x: x1, y: y1 } = p1
    const { x: x2, y: y2 } = p2
    const diffX = x2 - x1
    const diffY = y2 - y1
    // 距离 = √[(x₂ - x₁)² + (y₂ - y₁)²]
    const length = Math.pow(diffX * diffX + diffY * diffY, 0.5)
    return length
}


/**
 * 输入A/B两点，计算四个顶点坐标（A/B/D/C）
 * - AC/AD与AB夹角±45°，长度为AB的1/6
 * @param pointA A点坐标
 * @param pointB B点坐标
 * @returns 四个顶点坐标（A/B/D/C）
 */
export const getFourVertices = (pointA: Keypoint, pointB: Keypoint) => {
    // 1. 计算向量AB的dx、dy和长度
    const abLength = calculateLengthBetweenToPoints(pointA, pointB)

    // 避免AB重合导致计算异常
    if (abLength === 0) {
        return {
            A: pointA,
            B: pointB,
            C: pointA,
            D: pointA
        };
    }

    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;

    // 2. 向量单位化（方向不变，长度=1）
    const unitDx = dx / abLength;
    const unitDy = dy / abLength;

    // 3. 计算C点（+45°，长度=AB/6）
    const rad45 = Math.PI / 4; // 45°弧度
    const cLen = abLength / 6;
    const pointC: Keypoint = {
        x: pointA.x + (unitDx * Math.cos(rad45) - unitDy * Math.sin(rad45)) * cLen,
        y: pointA.y + (unitDx * Math.sin(rad45) + unitDy * Math.cos(rad45)) * cLen
    };

    // 4. 计算D点（-45°，长度=AB/6）
    const radMinus45 = -Math.PI / 4; // -45°弧度
    const pointD: Keypoint = {
        x: pointA.x + (unitDx * Math.cos(radMinus45) - unitDy * Math.sin(radMinus45)) * cLen,
        y: pointA.y + (unitDx * Math.sin(radMinus45) + unitDy * Math.cos(radMinus45)) * cLen
    };

    // 返回四个顶点
    return {
        A: pointA,
        B: pointB,
        C: pointC,
        D: pointD
    };
};


/**
 * 输入A/B两点，输出AB向量上的4个点
 * - 第1个点：距A点为 1/6 AB总长度
 * - 第2/3/4个点：平分剩余 4/5 AB长度
 * @param pointA A点坐标
 * @param pointB B点坐标
 * @returns 4个点的坐标数组（按距A由近到远排序）
 */
export const getFourPointsOnTwoPoints = (pointA: Keypoint, pointB: Keypoint): Keypoint[] => {
    // 1. 计算AB向量的dx、dy和总长度
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    const abTotalLength = Math.sqrt(dx * dx + dy * dy);

    // 避免AB重合导致计算异常
    if (abTotalLength === 0) {
        return [pointA, pointA, pointA, pointA];
    }

    // 2. 计算AB向量的单位方向（x/y轴单位增量）
    const unitDx = dx / abTotalLength;
    const unitDy = dy / abTotalLength;

    // 3. 定义各点距A点的长度
    const len1 = abTotalLength * (1 / 6); // 第1个点：1/5总长度
    const remainingLen = abTotalLength - len1; // 剩余长度
    const stepLen = remainingLen / 3; // 剩余3段，每段长度

    const len2 = len1 + stepLen; // 第2个点距A的长度
    const len3 = len2 + stepLen; // 第3个点距A的长度
    const len4 = abTotalLength;  // 第4个点=B点（距A总长度）

    // 4. 计算4个点的坐标
    const point1: Keypoint = {
        x: pointA.x + unitDx * len1,
        y: pointA.y + unitDy * len1
    };
    const point2: Keypoint = {
        x: pointA.x + unitDx * len2,
        y: pointA.y + unitDy * len2
    };
    const point3: Keypoint = {
        x: pointA.x + unitDx * len3,
        y: pointA.y + unitDy * len3
    };
    const point4: Keypoint = {
        x: pointA.x + unitDx * len4,
        y: pointA.y + unitDy * len4
    };

    return [point1, point2, point3, point4];
};