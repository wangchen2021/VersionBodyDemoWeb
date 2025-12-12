import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Border, Container, Content } from './styles'
import AudioSwitch, { type AudioSwitchExpose } from '../AudioSwitch'
import { CDN } from '@/constant'

interface CountdownProps {
    time: number,
    autoStart?: boolean,
    finish: () => void,
}

export interface CountdownExpose {
    start: () => void
}

const finishText = "GO!"

const Countdown = forwardRef<CountdownExpose, CountdownProps>((props, ref) => {

    const timerRef = useRef<NodeJS.Timeout>(null)
    const [count, setCount] = useState(props.time)
    const audioRef = useRef<AudioSwitchExpose>(null)
    const finishFlag = useRef(false)

    const start = useCallback(() => {
        finishFlag.current = false;
        setCount(props.time);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    emitFinish();
                    return 0; 
                }
                return prevCount - 1;
            });
        }, 1500);
    }, [props.time, props.finish]);


    const playAudio = (src: string) => {
        const audio = audioRef.current
        if (audio) {
            audio.play(src, true)
        } else {
            console.error("audio play failed");
        }
    }

    const emitFinish = () => {
        if (finishFlag.current) return
        finishFlag.current = true;
        props.finish()
    }

    useImperativeHandle(ref, () => ({
        start,
    }),)

    useEffect(() => {
        if (props.autoStart) {
            start()
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (count > 0) {
            playAudio(CDN + "/audio/ding.MP3")
        } else {
            playAudio(CDN + "/audio/dd.MP3")
        }
    }, [count])

    return (
        <Container>
            <Border></Border>
            <Content>{count > 0 ? count : finishText}</Content>
            <AudioSwitch show={false} ref={audioRef}></AudioSwitch>
        </Container>
    )
})

export default Countdown