import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled(motion.div)`
    width: 100%;
    height: 100%;
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