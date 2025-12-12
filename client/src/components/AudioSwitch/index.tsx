import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Container } from './styles'
import { CDN } from '@/constant'

const openIcon = CDN + "/openAudio.png"
const closeIcon = CDN + "/closeAudio.png"

export interface AudioSwitchExpose {
    play: (src: string, skip?: boolean) => void
    audioEnd: () => void
}

interface AudioSwitchProps {
    show?: boolean
}

const AudioSwitch = forwardRef<AudioSwitchExpose, AudioSwitchProps>(({ show = true }, ref) => {

    const [open, setOpen] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioSrc = useRef<string>(null)
    const isPlay = useRef(false)

    const changeOpen = () => {
        setOpen(prev => {
            return !prev
        })
    }

    const play = (src: string, skip?: boolean) => {
        audioSrc.current = src
        audioPlay(skip)
    }

    const audioPlay = useCallback(async (skip?: boolean) => {
        if (!open && !skip) return
        const audio = audioRef.current
        const src = audioSrc.current
        if (!audio || !src) return
        audio.currentTime = 0
        audio.src = src
        audio.currentTime = 0
        audio.play()
            .then(() => {
                isPlay.current = true
            })
            .catch((err) => {
                console.log(err);
            })
        audio.onended = () => {
            isPlay.current = false
        }
        audio.onerror = (err) => {
            console.error("audio err:" + err);
        }
    }, [open])

    const audioEnd = () => {
        const audio = audioRef.current
        if (!audio || !isPlay) return
        audio.pause()
    }

    useImperativeHandle(ref, () => ({
        play,
        audioEnd,
    }))

    useEffect(() => {
        if (open) {
            audioPlay()
        }
    }, [open])

    return (
        <Container $show={show} onClick={changeOpen} whileHover={{ scale: 1.1 }}>
            <img className='icon' src={open ? openIcon : closeIcon}></img>
            <audio ref={audioRef}></audio>
        </Container>
    )
})

export default AudioSwitch