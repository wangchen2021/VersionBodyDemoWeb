import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Border, Container, Content } from './styles'

interface CountdownProps {
    time: number,
    autoStart?: boolean,
    finish: () => void
}

export interface CountdownExpose {
    start: () => void
}

const finishText = "GO!"

const Countdown = forwardRef<CountdownExpose, CountdownProps>((props, ref) => {

    const timerRef = useRef<NodeJS.Timeout>(null)
    const [count, setCount] = useState(props.time)
    const [finishFlag, setFinishFlag] = useState(false)

    const start = useCallback(() => {
        setFinishFlag(false);
        setCount(props.time);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    setFinishFlag(true);
                    finish();
                    return 0; // 最终置0，避免负数
                }
                return prevCount - 1;
            });
        }, 1000);
    }, [props.time, props.finish]);

    const finish = () => {
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

    return (
        <Container>
            <Border></Border>
            <Content>{finishFlag ? finishText : count}</Content>
        </Container>
    )
})

export default Countdown