import React, { useEffect, useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer } from "./styles"
import Countdown, { type CountdownExpose } from '@/components/Countdown'
import { VersionStatus } from './app/versionStatus'
import { blackBoardSubTitle } from './config/subtitle'
import Camera from '@/components/Camera'
import { VersionStatusTypes } from './config/status'
import { AnimatePresence, motion } from "motion/react"
import Scanner from '@/components/Scanner'

const readyFinish = () => {
    console.log("ready");
}

const Version: React.FC = () => {
    const countdownRef = useRef<CountdownExpose>(null)
    const versionStatus = useRef(new VersionStatus())
    const [status, setStatus] = useState(versionStatus.current.status)
    const scannerPosition = useRef<{ left: number, width: number }>({ left: 0, width: 0 })

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
        versionStatus.current.bindNextCallback(updateStatus.bind(this))
    }, [])

    return (
        <Container>
            <CameraContainer>
                <Camera onload={start} versionStatus={versionStatus.current}></Camera>
                {status === VersionStatusTypes.START
                    &&
                    <Scanner
                        left={scannerPosition.current.left}
                        width={scannerPosition.current.width}
                        onFinish={finishScan}>
                    </Scanner>
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
                    <video></video>
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