import { VersionStatusTypes } from "../config/status";

export const StatusFrameColors = {
    [VersionStatusTypes.CV_CHECK_WRONG]: "#ff0033",
    [VersionStatusTypes.CV_CHECK_RIGHT]: "#00ff66",
    [VersionStatusTypes.CV_CHECK_FINISH]: "#00ff66",
    [VersionStatusTypes.START]: "#00ff66",
    [VersionStatusTypes.SHOW_INFO]: "white",
    [VersionStatusTypes.COUNTDOWN]: "white",
    [VersionStatusTypes.DETECT]: "white",
    [VersionStatusTypes.FINISH]: "white"
};