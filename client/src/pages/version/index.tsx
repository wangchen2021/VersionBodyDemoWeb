import React, { useEffect, useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer, VideoGuide, InfoContainer } from "./styles"
import Countdown, { type CountdownExpose } from '@/components/Countdown'
import { VersionStatus } from './app'
import { AnimatePresence, motion } from "motion/react"
import { plans, VersionStatusTypes, blackBoardSubTitle } from './config'
import Mask from '@/components/Mask'
import Scanner from '@/components/Scanner'
import Camera from '@/components/Camera'

const readyFinish = () => {
    console.log("ready");
}

const Version: React.FC = () => {
    const countdownRef = useRef<CountdownExpose>(null)
    const versionStatus = useRef(new VersionStatus())
    const [status, setStatus] = useState(versionStatus.current.status)
    const scannerPosition = useRef<{ left: number, width: number }>({ left: 0, width: 0 })
    const videoGuideRef = useRef<HTMLVideoElement>(null)

    const start = () => {
        versionStatus.current.start()
    }

    const updateStatus = () => {
        if (VersionStatusTypes.START === versionStatus.current.status) {
            setupScannerParams()
        }
        setStatus(versionStatus.current.status)
    }

    const setupScannerParams = () => {
        const points = versionStatus.current.render?.drawPoints
        if (!points) return
        const width = Math.abs(points[6].x - points[5].x) * 2
        scannerPosition.current = { left: points[17].x, width }
    }


    const finishScan = () => {
        console.log("finish scan");
        setTimeout(() => {
            versionStatus.current.next()
        }, 1000)
    }

    useEffect(() => {
        versionStatus.current.bindPlan(plans.Squat)
        versionStatus.current.bindNextCallback(updateStatus.bind(this))
    }, [])

    return (
        <Container>
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
                <Mask>
                    <InfoContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='l1'>COMING NEXT</div>
                        <div className='l2'>{versionStatus.current.plan?.name}</div>
                        <div>
                            <div>
                                {versionStatus.current.plan?.seconds}
                            </div>
                            <div>
                                {versionStatus.current.plan?.reps}
                            </div>
                        </div>
                    </InfoContainer>
                </Mask>
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
                status === VersionStatusTypes.COUNTDOWN && <CountDownContainer>
                    <Countdown ref={countdownRef} finish={readyFinish} time={3}></Countdown>
                </CountDownContainer>
            }
        </Container>
    )
}

export default Version