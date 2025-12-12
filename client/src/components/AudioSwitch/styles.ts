import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled(motion.div) <{ $show: boolean }>`
    width: ${(props) => { return props.$show ? '100%' : '0' }};
    height: ${(props) => { return props.$show ? '100%' : '0' }};
    border-radius: 50%;
    background-color: #616161;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon{
        width: 50%;
        height: 50%;
    }
`