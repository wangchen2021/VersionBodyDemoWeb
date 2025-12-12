import React, { memo } from 'react'
import { ProcessContainer, ProgressBar, ValueLabel } from './styles'

export type ProgressPropsData = {
    value: number
    total?: number
}

export interface ProgressProps {
    data: ProgressPropsData[]
    showLabel?: boolean
}

const getValueColor = (percentage: number) => {
    switch (true) {
        case percentage >= 90:
            return 'linear-gradient(to bottom, #00fa9a, #008000)'
        case percentage >= 70:
            return 'linear-gradient(to bottom, #90ee90, #32cd32)'
        case percentage >= 50:
            return 'linear-gradient(to bottom, #ffff99, #ffcc00)'
        case percentage >= 30:
            return 'linear-gradient(to bottom, #ff7f50, #ff4500)'
        default:
            return 'linear-gradient(to bottom, #ff4d4d, #c71585)'
    }
}

const Progress: React.FC<ProgressProps> = memo(({ data, showLabel = false }) => {
    const length = data.length
    return (
        <ProcessContainer>
            {data.map((item, index) => {
                const total = item.total ? item.total : 1
                const value = item.value
                const percentage = Math.floor((value / total) * 100)
                return (
                    <ProgressBar style={{ width: `${100 / (2 * length)}%` }} key={index} value={item.value}>
                        <div style={{ background: getValueColor(percentage), height: `${percentage}%` }} className='value'>
                            {
                                showLabel
                                &&
                                <ValueLabel>{percentage}</ValueLabel>
                            }
                        </div>
                    </ProgressBar>
                )
            })}
        </ProcessContainer>
    )
})

export default Progress