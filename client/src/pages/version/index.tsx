import React, { useCallback, useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer, VideoGuide, InfoContainer, MainContent, BottomBar } from "./styles"
import { VersionStatus } from './app'
import { AnimatePresence, motion } from "motion/react"
import { plans, VersionStatusTypes, blackBoardSubTitle } from './config'
import Mask from '@/components/Mask'
import Scanner from '@/components/Scanner'
import Camera from '@/components/Camera'
import Countdown from '@/components/Countdown'
import Progress, { type ProgressPropsData } from '@/components/Progress'



const Version: React.FC = () => {
    const versionStatus = useRef<VersionStatus>(new VersionStatus())
    const [status, setStatus] = useState(versionStatus.current.status)
    const scannerPosition = useRef<{ left: number, width: number }>({ left: 0, width: 0 })
    const videoGuideRef = useRef<HTMLVideoElement>(null)
    const [finishTimes, setFinishTimes] = useState(0)
    const [finishData, setFinishData] = useState<ProgressPropsData[]>([
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
        { value: 0, total: 100 },
    ])

    const start = () => {
        const vs = versionStatus.current
        vs.bindPlan(plans.Squat)
        vs.bindNextCallback(updateStatus.bind(this))
        vs.bindRecordFinishCallback(recordFinish.bind(this))
        versionStatus.current.start()
    }

    const updateStatus = useCallback(() => {
        if (VersionStatusTypes.START === versionStatus.current.status) {
            setupScannerParams()
        }
        setStatus(versionStatus.current.status)
    }, [])

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


    return (
        <Container>
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
                                    {blackBoardSubTitle[status]}
                                </motion.span>
                            </AnimatePresence>
                        </BlackBoard>
                        :
                        <VideoGuide ref={videoGuideRef} src={versionStatus.current.plan?.videoSrc}></VideoGuide>
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
            <BottomBar $show={Boolean(status >= VersionStatusTypes.DETECT)}>
                <span className='title'>Reps</span>
                <span><span className='finish'>{finishTimes}</span><span className='total'>/{versionStatus.current.plan?.reps}</span></span>
                <div className='progress-container'>
                    <Progress data={finishData}></Progress>
                </div>
            </BottomBar>
        </Container>
    )
}

export default Version