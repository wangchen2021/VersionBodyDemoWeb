import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

export const Video = styled.video`
    position: absolute;
    left: 0%;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    transform: scaleX(-1);
`

export const Canvas = styled.canvas`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
`