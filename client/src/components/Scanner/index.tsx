import React from 'react'
import { ScannerContainer } from './styles'
import { AnimatePresence, motion, type Transition } from "motion/react"

interface ScannerProps {
    onFinish?: Function,
    left: number,
    width: number
}

const transition: Transition = {
    duration: 3,
    ease: "easeInOut",
    times: [0, 0.7, 1]
}

const Scanner: React.FC<ScannerProps> = ({ onFinish, left, width }) => {

    const finishScan = () => {
        onFinish && onFinish()
    }

    return (
        <ScannerContainer style={{ width, left }}>
            <AnimatePresence>
                <motion.div
                    initial={{ top: '100%', opacity: 1 }}
                    animate={{
                        top: ["100%", "0%", "100%"],
                    }}
                    exit={{ opacity: 0 }}
                    transition={transition}
                    onAnimationComplete={finishScan}
                    className='progress'>
                </motion.div>
            </AnimatePresence>
        </ScannerContainer>
    )
}

export default Scanner