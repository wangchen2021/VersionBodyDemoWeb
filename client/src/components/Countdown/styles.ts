import styled, { keyframes } from "styled-components";

const CountDownAnimation = keyframes`
    0%{transform:scale(1)}
    50%{transform:scale(1.1)}
    100%{transform:scale(1)}
`
const RotateAnimation = keyframes`
    0%{
        transform: translate(-50%, -50%) rotate(0);
    }
    100%{
        transform: translate(-50%, -50%) rotate(360deg);
    }
`

export const Container = styled.div`
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: #000000a0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin:center;
    animation: ${CountDownAnimation} linear infinite 1.5s;
`

export const Content = styled.div`
    color: white;
    font-size: 80px;
`

export const Border = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    width: 170px;
    height: 170px;
    border-radius: 50%;
    z-index: 1;
    border-top:2px solid #8aff67;
    transform-origin: center;
    animation: ${RotateAnimation} infinite 2s linear;
`