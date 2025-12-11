import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { Container } from './styles'
import { CDN } from '@/constant'

const openIcon = CDN + "/openAudio.png"
const closeIcon = CDN + "/closeAudio.png"

export interface AudioSwitchExpose {
    play: (src: string) => void
}

const AudioSwitch = forwardRef<AudioSwitchExpose>((_props, ref) => {

    const [open, setOpen] = useState(false)
    const hasPermission = useRef(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioSrc = useRef<string>(null)
    const isPlay = useRef(false)

    const checkPermission = useCallback(() => {
        if (hasPermission.current) return
        const audio = audioRef.current
        if (audio) {
            console.log("open audio");
            audioPlay()
            hasPermission.current = true
        }
    }, [audioRef])

    const changeOpen = () => {
        checkPermission()
        setOpen(prev => {
            if (!prev) {
                audioPlay(true)
            } else {
                audioEnd()
            }
            return !prev
        })
    }

    const play = (src: string) => {
        audioSrc.current = src
        audioPlay()
    }

    const audioPlay = (skip?: boolean) => {
        if (!open && !skip) return
        const audio = audioRef.current
        const src = audioSrc.current
        if (!audio || !src) return
        audioEnd() // 中断上次播放
        audio.src = src
        audio.currentTime = 0
        audio.play()
        isPlay.current = true
        audio.onended = () => {
            isPlay.current = false
        }
        audio.onerror = (err) => {
            console.error("audio err:" + err);
        }
    }

    const audioEnd = () => {
        const audio = audioRef.current
        if (!audio) return
        audio.pause()
        isPlay.current = false
    }

    useImperativeHandle(ref, () => ({
        play
    }))

    return (
        <Container onClick={changeOpen} whileHover={{ scale: 1.1 }}>
            <img className='icon' src={open ? openIcon : closeIcon}></img>
            <audio ref={audioRef}></audio>
        </Container>
    )
})

export default AudioSwitch