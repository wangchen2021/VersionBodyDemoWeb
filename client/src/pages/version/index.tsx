import React, { useRef, useState } from 'react'
import { Container, Guide, CountDownContainer, BlackBoard, CameraContainer } from "./styles"
import Countdown, { type CountdownExpose } from '@/components/Countdown'
import { VersionStatus } from './config/status'
import { blackBoardSubTitle } from './config/subtitle'
import Camera from '@/components/Camera'

const countDownTime = 3

const readyFinish = () => {
    console.log("ready");
}

const Version: React.FC = () => {
    const countdownRef = useRef<CountdownExpose>(null)
    const versionStatus = useRef(new VersionStatus())
    const [status, setStatus] = useState(versionStatus.current.status)

    const next = () => {
        versionStatus.current.next()
        setStatus(versionStatus.current.status)
    }

    return (
        <Container>
            <CameraContainer>
                <Camera></Camera>
            </CameraContainer>
            <Guide>
                {status <= VersionStatus.START ?
                    <BlackBoard>
                        {blackBoardSubTitle[status]}
                    </BlackBoard>
                    :
                    <video></video>
                }
            </Guide>
            {
                status === VersionStatus.COUNTDOWN && <CountDownContainer>
                    <Countdown ref={countdownRef} finish={readyFinish} time={countDownTime}></Countdown>
                </CountDownContainer>
            }
        </Container>
    )
}

export default Version