import React from 'react'
import { ScannerContainer } from './styles'
import { AnimatePresence, motion } from "motion/react"

interface ScannerProps {
    onFinish?: Function,
    left: number,
    width: number
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
                    animate={{ top: "0%", opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
                    onAnimationComplete={finishScan}
                    className='progress'>
                </motion.div>
            </AnimatePresence>
        </ScannerContainer>
    )
}

export default Scanner