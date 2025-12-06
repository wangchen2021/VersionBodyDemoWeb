//状态机
export class VersionStatus {

    static CV_CHECK_WRONG = 0
    static CV_CHECK_RIGHT = 1
    static CV_CHECK_FINISH = 2
    static START = 3
    static SHOW_INFO = 4
    static COUNTDOWN = 5
    static DETECT = 6
    static FINISH = 7

    status = VersionStatus.CV_CHECK_WRONG

    constructor() {
        this.status = VersionStatus.CV_CHECK_WRONG
    }

    next() {
        this.status++
        return this
    }
}