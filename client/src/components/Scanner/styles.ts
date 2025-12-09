import styled from "styled-components";
export const ScannerContainer = styled.div`
    position: absolute;
    left: 50%;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-50%);
    z-index: 2;

    .progress{
        position: absolute;
        left: 0;
        top: 30%;
        width: 100%;
        height: 15px;
        border-radius: 20px;
        background-color: #5cff5c96;
    }
`