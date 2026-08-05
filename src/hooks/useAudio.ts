import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAudioProps {
  autoPlay?: boolean;
  onEnd?: () => void;
}

export function useAudio({ autoPlay = true, onEnd }: UseAudioProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const playAudio = useCallback(async (url: string) => {
    try {
      // Para o áudio atual se estiver tocando
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      currentUrlRef.current = url;

      audio.volume = volume;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        if (onEnd) onEnd();
      };
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
      };

      if (autoPlay) {
        await audio.play();
      }

      return audio;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }, [autoPlay, volume, onEnd]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    }
  }, []);

  const setAudioVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    volume,
    playAudio,
    pauseAudio,
    stopAudio,
    setAudioVolume,
  };
}