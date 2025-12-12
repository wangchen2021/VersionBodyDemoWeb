import { useRef, useCallback } from 'react';

export const usePreloadAudio = () => {
  // 缓存已加载的音频实例
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  // 预加载音频：传入URL数组，仅做缓存
  const preloadAudio = useCallback((audioUrls: string[]) => {
    audioUrls.forEach(url => {
      if (!url || audioCache.current[url]) return; // 空URL/已缓存则跳过
      const audio = new Audio(url);
      audioCache.current[url] = audio; // 缓存实例
      audio.preload = 'auto'; // 触发浏览器预加载
      audio.load(); // 主动加载（兼容部分浏览器）
    });
  }, []);

  return { preloadAudio };
};