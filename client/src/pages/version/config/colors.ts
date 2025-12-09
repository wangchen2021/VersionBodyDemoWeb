import { VersionStatusTypes } from "../config/status";

export const StatusFrameColors = {
    [VersionStatusTypes.CV_CHECK_WRONG]: "red",
    [VersionStatusTypes.CV_CHECK_RIGHT]: "green",
    [VersionStatusTypes.CV_CHECK_FINISH]: "green",
    [VersionStatusTypes.START]: "green",
    [VersionStatusTypes.SHOW_INFO]: "white",
    [VersionStatusTypes.COUNTDOWN]: "white",
    [VersionStatusTypes.DETECT]: "white",
    [VersionStatusTypes.FINISH]: "white"
}