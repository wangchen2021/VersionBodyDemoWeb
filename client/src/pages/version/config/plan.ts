export interface EstimatePlan {
    name: string,
    cn: string,
    videoSrc: string,
    seconds: number,
    reps: number
}

export const plans: Record<string, EstimatePlan> = {
    Squat: {
        name: "Half Sumo Squat",
        cn: "深蹲",
        videoSrc: "http://1312576865.vod-qcloud.com/1600c0eevodcq1312576865/7ec307171397757900678175097/f0.mp4",
        seconds: 60,
        reps: 10
    }
}