import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled.div`
    height: 100vh;
    display: flex;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    overflow: hidden;
`

export const CameraContainer = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
`

export const Guide = styled.div`
    flex: 1;
    height: 100%;
    background-color: blue;
`

export const CountDownContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: 50%;
    transform: translate(-50%,-50%);
`

export const BlackBoard = styled.div`
    width: 100%;
    height: 100%;
    background-color: #2e2e2e;
    color: white;
    font-size: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 20px;
    text-align: center;
    text-shadow: 0 7px 2px rgb(8, 8, 8); 
`

export const VideoGuide = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #2e2e2e;
`

export const InfoContainer = styled(motion.div)`
    width: 100%;
    height: 100%;
    text-align: center;
    color: white;
    .l1{
        font-size: 55px;
        margin-top: 150px;
        color: #ebebeb;
    }
    .l2{
        font-size: 55px;
        margin-top: 20px;
    }
`