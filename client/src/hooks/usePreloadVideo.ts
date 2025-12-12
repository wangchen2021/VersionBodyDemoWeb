import { useRef, useCallback } from 'react';

export const usePreloadVideo = () => {
  // 缓存已加载的视频实例
  const videoCache = useRef<Record<string, HTMLVideoElement>>({});

  // 预加载视频：传入单个URL，仅做缓存
  const preloadVideo = useCallback((videoUrl: string) => {
    if (!videoUrl || videoCache.current[videoUrl]) return; // 空URL/已缓存则跳过
    const video = document.createElement('video');
    videoCache.current[videoUrl] = video; // 缓存实例
    video.src = videoUrl;
    video.preload = 'auto'; // 预加载视频资源
    video.muted = true; // 避免部分浏览器限制
    video.load(); // 主动加载
  }, []);

  return { preloadVideo };
};