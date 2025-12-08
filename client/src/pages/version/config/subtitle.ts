import { VersionStatusTypes } from "../config/status";

export const blackBoardSubTitle = {
    [VersionStatusTypes.WAIT_INIT]: "AI loading, please wait...",
    [VersionStatusTypes.CV_CHECK_WRONG]: "Stand up and start moving backwards",
    [VersionStatusTypes.CV_CHECK_RIGHT]: "Great! That's the spot!",
    [VersionStatusTypes.CV_CHECK_FINISH]: "Let's start!",
}