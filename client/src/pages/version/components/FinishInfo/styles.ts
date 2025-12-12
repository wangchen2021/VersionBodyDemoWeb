import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled(motion.div)`
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    flex-direction: column;

    .l1{
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        flex: 2;
    }

    .l1-icon{
        width: 50px;
        height: 50px;
        margin-right: 20px;
    }

    .l1-title{
        font-size: 30px;
    }

    .l2{
        flex: 1;
        margin-top: 50px;
        text-align: center;
        font-size: 60px;
    }

    .l3{
        margin: 0 auto;
        margin-top: 50px;
        display: flex;
        width: 50%;
        align-items: center;
        justify-content: space-between;
        font-size: 70px;
        flex: 3;
    }

    .l3-item{
        position: relative;
        text-align: center;
    }

    .l3-label{
        margin-top: 20px;
    }

    .l3-value{
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }

    .l3-p-value{
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 30px;
    }

    .l4{
        display: flex;
        flex: 3;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .l4-value{
        font-size: 50px;
    }
    .l4-label{
        margin-top: 10px;
        font-size: 25px;
    }
`