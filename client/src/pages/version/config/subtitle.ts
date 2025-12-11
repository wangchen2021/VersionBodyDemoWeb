import { CDN } from "@/constant";
import { VersionStatusTypes } from "../config/status";

export const blackBoardSubTitle = {
    [VersionStatusTypes.WAIT_INIT]:
    {
        audio: "",
        text: "AI loading, please wait..."
    },
    [VersionStatusTypes.CV_CHECK_WRONG]:
    {
        audio: CDN + "/audio/v1.MP3",
        text: "Stand up and start moving backwards"
    },
    [VersionStatusTypes.CV_CHECK_RIGHT]:
    {
        audio: CDN + "/audio/v2.MP3",
        text: "Great! That's the spot!"
    },
    [VersionStatusTypes.CV_CHECK_FINISH]:
    {
        audio: CDN + "/audio/v3.MP3",
        text: "Let's start!",
    },
    [VersionStatusTypes.START]:
    {
        audio: CDN + "/audio/v3.MP3",
        text: "Let's start!",
    },
}