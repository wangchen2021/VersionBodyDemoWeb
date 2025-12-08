import React, { useEffect, useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer } from "./styles"
import Countdown, { type CountdownExpose } from '@/components/Countdown'
import { VersionStatus } from './app/versionStatus'
import { blackBoardSubTitle } from './config/subtitle'
import Camera from '@/components/Camera'
import { VersionStatusTypes } from './config/status'
import { AnimatePresence, motion } from "motion/react"

const readyFinish = () => {
    console.log("ready");
}

const Version: React.FC = () => {
    const countdownRef = useRef<CountdownExpose>(null)
    const versionStatus = useRef(new VersionStatus())
    const [status, setStatus] = useState(versionStatus.current.status)


    const start = () => {
        versionStatus.current.start()
    }

    const nextStatus = () => {
        setStatus(versionStatus.current.status)
    }

    useEffect(() => {
        versionStatus.current.bindNextCallback(nextStatus.bind(this))
    }, [])

    return (
        <Container>
            <CameraContainer>
                <Camera onload={start} versionStatus={versionStatus.current}></Camera>
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