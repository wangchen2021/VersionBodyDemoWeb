import styled from "styled-components";

export const ProcessContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15px 0;
`

export const ProgressBar = styled.div<{ value: number }>`
    height: 100%;
    background-color: #5c5b5b;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    .value{
        position: absolute;
        border-radius: 10px;
        width: 100%;
        bottom: 0;
        height: 40%;
        transition: all 0.3s ease-in-out;
    }
`