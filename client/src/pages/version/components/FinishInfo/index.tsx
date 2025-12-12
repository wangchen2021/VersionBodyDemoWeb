import React from 'react'
import { Container } from './styles'
import { Progress } from 'antd';
import type { ProgressProps } from 'antd';

interface FinishInfoProps {
    name: string,
    reps: number,
    sec: number,
    score: number,
    ef: number
}

const getValueColor = (percentage: number): ProgressProps['strokeColor'] => {
    switch (true) {
        case percentage >= 90:
            return {
                '0%': "#00fa9a",
                '100': "#008000",
            }
        case percentage >= 70:
            return {
                '0%': "#90ee90",
                '100': "#32cd32",
            }
        case percentage >= 50:
            return {
                '0%': "#ffff99",
                '100': "#ffcc00",
            }
        case percentage >= 30:
            return {
                '0%': "#ff7f50",
                '100': "#ff4500",
            }
        default:
            return {
                '0%': "#ff4d4d",
                '100': "#c71585",
            }
    }
}

const FinishInfo: React.FC<FinishInfoProps> = ({ name, reps, sec, score, ef }) => {
    return (
        <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <div className='l1'>
                <img className='l1-icon' src='http://cdn.duguqinchen.com/version_demo/ai.png'></img>
                <span className='l1-title'>Version Web</span>
            </div>
            <div className='l2'>{name}</div>
            <div className='l3'>
                <div className='l3-item'>
                    <div className='l3-value'>{sec}</div>
                    <div className='l3-label'>Sec.</div>
                </div>
                <div className='l3-item'>
                    <Progress
                        percent={score}
                        type='circle'
                        strokeColor={getValueColor(score)}
                        format={(_percent) => ``}
                        strokeLinecap='round'
                        size="default"
                    >
                    </Progress>
                    <div className='l3-p-value'>{score}</div>
                </div>
                <div className='l3-item'>
                    <div className='l3-value'>
                        <span style={{ fontSize: 90 }}>{reps}</span>
                        /
                        {reps}
                    </div>
                    <div className='l3-label'>Reps</div>
                </div>
            </div>
            <div className='l4'>
                <div>
                    <div className='l4-value'>{ef}</div>
                    <div className='l4-label'>Effectiveness</div>
                </div>
            </div>
        </Container>
    )
}

export default FinishInfo