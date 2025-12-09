import React from 'react'
import { MaskContainer } from './styles'

interface MaskProps {
    zIndex?: number
    children?: React.ReactNode
}

const Mask: React.FC<MaskProps> = ({ zIndex, children }) => {
    return (
        <MaskContainer style={{ zIndex: zIndex ? zIndex : 1 }}>
            {children}
        </MaskContainer>
    )
}

export default Mask