import React, { useEffect, useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer } from "./styles"
import Countdown, { type CountdownExpose } from '@/components/Countdown'
import { VersionStatus } from './app/versionStatus'
import { blackBoardSubTitle } from './config/subtitle'
import Camera from '@/components/Camera'
import { VersionStatusTypes } from './config/status'
import { motion } from "motion/react"

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
        setStatus(status + 1)
    }

    useEffect(() => {
        versionStatus.current.bindNextCallback(nextStatus)
    }, [])

    return (
        <Container>
            <CameraContainer>
                <Camera onload={start} versionStatus={versionStatus.current}></Camera>
            </CameraContainer>
            <Guide>
                {status <= VersionStatusTypes.START ?
                    <BlackBoard>
                        <motion.span
                            key={status}
                            initial={{ y: 800, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -800, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {blackBoardSubTitle[status]}
                        </motion.span>
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