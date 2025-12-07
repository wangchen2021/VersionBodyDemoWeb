import React, { useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { isMobile } from 'react-device-detect';
import { Canvas, Container, Video } from './styles';
import { Render } from './render';

const FPS = 20
const videoWidth = 500
const videoHeight = 500
const videoRatio = videoWidth / videoHeight

const Camera: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null);
    const posenetModelRef = useRef<posenet.PoseNet>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isDetecting = useRef(false)
    const render = useRef<Render>(null)
    const detectTimer = useRef<NodeJS.Timeout>(null)

    const clean = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const srcObject = video.srcObject as any
            const tracks = srcObject.getTracks();
            tracks.forEach((track: any) => track.stop());
            video.srcObject = null;
        }
        isDetecting.current = false
        window.removeEventListener("resize", windowReSize)
        if (detectTimer.current) {
            clearInterval(detectTimer.current)
        }
    }

    const toggleCamera = async () => {
        try {
            // 请求摄像头权限并绑定视频流
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user', // 前置摄像头（环境摄像头：environment
                    width: { ideal: videoWidth },
                    height: { ideal: videoHeight },
                },
            });
            const video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                video.play();
                isDetecting.current = true
                video.oncanplaythrough = () => {
                    console.log("start detect");
                    window.addEventListener("resize", windowReSize)
                    initRender();
                    windowReSize()
                    startDetect()
                };
            }
        } catch (err) {
            console.error('no permission of camera：', err);
            isDetecting.current = false
            alert('please open camera permission');
        }
    };

    const startDetect = () => {
        detectTimer.current = setInterval(() => {
            detectPose()
        }, 1000 / FPS)
    }

    const detectPose = async () => {
        if (!posenetModelRef.current || !isDetecting.current) return;
        try {
            const video = videoRef.current;
            if (!video) return
            // 检测人体关键点（singlePerson: true 检测单人，false 检测多人）
            const pose = await posenetModelRef.current.estimateSinglePose(video, {
                flipHorizontal: true,
            });
            render.current?.renderFrame(pose.keypoints)
        } catch (err) {
            console.error('detect fail', err);
        }
    }

    const initRender = () => {
        const canvas = canvasRef.current
        const video = videoRef.current;
        if (canvas && video) {
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            render.current = new Render(canvas, ctx)
        } else {
            console.error("no canvas or video instance");
        }
    }

    const windowReSize = () => {
        const container = containerRef.current
        const renderInstance = render.current
        const canvas = canvasRef.current
        if (container && renderInstance && canvas) {
            renderInstance.resetDiff()
            const { height, width } = container.getBoundingClientRect()
            canvas.width = width
            canvas.height = height
            const containerRatio = width / height
            if (containerRatio > videoRatio) {
                //高裁剪
                const radio = width / videoWidth
                const videoFullHeight = videoHeight * radio
                renderInstance.diffY = (videoFullHeight - height) / 2
                renderInstance.radio = radio
            } else {
                //宽裁剪
                const radio = height / videoHeight
                const videoFullWidth = videoWidth * radio
                renderInstance.diffX = (videoFullWidth - width) / 2
                renderInstance.radio = radio
            }
        }
    }

    useEffect(() => {
        const loadPosenet = async () => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();
                posenetModelRef.current = await posenet.load({
                    architecture: 'ResNet50',
                    outputStride: 16,
                    inputResolution: { width: videoWidth, height: videoHeight },
                    multiplier: isMobile ? 0.75 : 1.0,
                    quantBytes: 4
                });
                console.log("load finish");
                toggleCamera()
            } catch (err) {
                console.error('load error', err);
            }
        };
        loadPosenet();
        return () => {
            clean()
        }
    }, [])

    return (
        <Container ref={containerRef}>
            <Video playsInline width={videoWidth} height={videoHeight} ref={videoRef}></Video>
            <Canvas ref={canvasRef} width={videoWidth} height={videoHeight}></Canvas>
        </Container>
    )
}

export default Camera
