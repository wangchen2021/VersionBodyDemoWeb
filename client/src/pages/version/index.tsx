import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer, VideoGuide, InfoContainer, MainContent, BottomBar, AudioContainer } from "./styles"
import { VersionStatus } from './app'
import { AnimatePresence, motion } from "motion/react"
import { plans, VersionStatusTypes, blackBoardSubTitle, finishAudio, createFinishData } from './config'
import Mask from '@/components/Mask'
import Scanner from '@/components/Scanner'
import Camera from '@/components/Camera'
import Countdown from '@/components/Countdown'
import Progress, { type ProgressPropsData } from '@/components/Progress'
import AudioSwitch, { type AudioSwitchExpose } from '@/components/AudioSwitch'
import FinishInfo from './components/FinishInfo'
import { CDN } from '@/constant'



const Version: React.FC = () => {
    const versionStatus = useRef<VersionStatus>(new VersionStatus())
    const audioRef = useRef<AudioSwitchExpose>(null)
    const [status, setStatus] = useState(versionStatus.current.status)
    const scannerPosition = useRef<{ left: number, width: number }>({ left: 0, width: 0 })
    const videoGuideRef = useRef<HTMLVideoElement>(null)
    const [finishTimes, setFinishTimes] = useState(0)
    const [finishData, setFinishData] = useState<ProgressPropsData[]>(createFinishData(plans.Squat))

    const start = () => {
        const vs = versionStatus.current
        vs.bindPlan(plans.Squat)
        vs.bindAudio(audioRef.current)
        vs.bindNextCallback(updateStatus.bind(this))
        vs.bindRecordFinishCallback(recordFinish.bind(this))
        versionStatus.current.start()
    }

    const updateStatus = useCallback(async () => {
        await processStatus()
        playSubTitle()
        setStatus(versionStatus.current.status)
    }, [])

    const processStatus = async () => {
        const vs = versionStatus.current
        if (VersionStatusTypes.START === vs.status) {
            setupScannerParams()
        }
        if (VersionStatusTypes.DETECT === vs.status) {
            const vs = versionStatus.current
            const video = videoGuideRef.current
            vs.setStartDetectTime(Date.now())
            if (!video) return
            video.play()
        }
        if (VersionStatusTypes.FINISH === vs.status) {
            await vs.finish()
            const video = videoGuideRef.current
            if (!video) return
            video.pause()
            playFinishAudio()
        }
    }

    const playSubTitle = () => {
        const vs = versionStatus.current
        const newSubTitle = blackBoardSubTitle[vs.status]
        const oldSubTitle = blackBoardSubTitle[status]
        const audio = audioRef.current
        if (!newSubTitle || !audio) return
        if (!oldSubTitle || (oldSubTitle.text !== newSubTitle.text)) {
            audio.play(newSubTitle.audio)
        }
    }

    const setupScannerParams = () => {
        const points = versionStatus.current.render?.drawPoints
        if (!points) return
        const width = Math.abs(points[6].x - points[5].x) * 2
        scannerPosition.current = { left: points[17].x, width }
    }


    const finishScan = () => {
        console.log("scanner finish");
        setTimeout(() => {
            versionStatus.current.next()
        }, 1000)
    }

    const countdownFinish = () => {
        console.log("countdown finish");
        setTimeout(() => {
            versionStatus.current.next()
        }, 1000)
    }

    const recordFinish = useCallback((score: number) => {
        setFinishTimes((prevFinishTimes) => {
            const newIndex = prevFinishTimes;
            setFinishData((prevFinishData) => {
                const newData = [...prevFinishData];
                newData[newIndex].value = score;
                return newData;
            });
            return newIndex + 1;
        });
    }, []);

    const playFinishAudio = () => {
        const audio = audioRef.current
        if (!audio) return
        audio.play(CDN + "/audio/vf.MP3")
    }

    //监听完成次数
    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            audio.play(finishAudio)
        }
        if (finishTimes === finishData.length) {
            const vs = versionStatus.current
            vs.next()
        }
    }, [finishTimes])

    return (
        <Container>
            <AudioContainer>
                <AudioSwitch ref={audioRef}></AudioSwitch>
            </AudioContainer>
            <MainContent>
                <CameraContainer>
                    <Camera videoWidth={500} videoHeight={500} onload={start} versionStatus={versionStatus.current}></Camera>
                    {status === VersionStatusTypes.START
                        &&
                        <Scanner
                            left={scannerPosition.current.left}
                            width={scannerPosition.current.width}
                            onFinish={finishScan}>
                        </Scanner>
                    }
                    {
                        status === VersionStatusTypes.SHOW_INFO
                        &&
                        <Mask zIndex={10}>
                            <InfoContainer>
                                <div className='l1'>COMING NEXT</div>
                                <div className='l2'>{versionStatus.current.plan?.name}</div>
                                <div className='l3'>
                                    <div>
                                        <div className='l3-value'>{versionStatus.current.plan?.seconds}</div>
                                        <div className='l3-label'>Sec.</div>
                                    </div>
                                    <div>
                                        <div className='l3-value'>{versionStatus.current.plan?.reps}</div>
                                        <div className='l3-label'>Reps</div>
                                    </div>
                                </div>
                            </InfoContainer>
                        </Mask>
                    }
                </CameraContainer>
                <Guide>
                    {status <= VersionStatusTypes.START ?
                        <BlackBoard>
                            <AnimatePresence>
                                <motion.span
                                    key={status}
                                    initial={{ y: 800, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20
                                    }}
                                >
                                    {blackBoardSubTitle[status].text}
                                </motion.span>
                            </AnimatePresence>
                        </BlackBoard>
                        :
                        <VideoGuide loop muted ref={videoGuideRef} src={versionStatus.current.plan?.videoSrc}></VideoGuide>
                    }
                </Guide>
                {
                    status === VersionStatusTypes.COUNTDOWN
                    &&
                    <CountDownContainer>
                        <Countdown autoStart finish={countdownFinish} time={3}></Countdown>
                    </CountDownContainer>
                }
            </MainContent>
            <BottomBar $show={Boolean(status >= VersionStatusTypes.DETECT && status < VersionStatusTypes.FINISH)}>
                <span className='title'>Reps</span>
                <span><span className='finish'>{finishTimes}</span><span className='total'>/{versionStatus.current.plan?.reps}</span></span>
                <div className='progress-container'>
                    <Progress data={finishData}></Progress>
                </div>
            </BottomBar>
            {
                versionStatus.current.plan && status === VersionStatusTypes.FINISH
                &&
                <Mask>
                    <FinishInfo
                        reps={versionStatus.current.plan.reps}
                        name={versionStatus.current.plan.name}
                        sec={versionStatus.current.timeCount}
                        score={62}
                        ef={62}
                    >
                    </FinishInfo>
                </Mask>
            }

        </Container>
    )
}

export default Version