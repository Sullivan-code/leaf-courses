"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audio: Blob | null;
  audioUrl?: string | null;
  isPlaying?: boolean;
  volume?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onVolumeChange?: (volume: number) => void;
  autoPlay?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function AudioPlayer({
  audio,
  audioUrl: externalAudioUrl,
  isPlaying: externalIsPlaying,
  volume: externalVolume = 1,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  autoPlay = true,
  onClose,
  className,
}: AudioPlayerProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [internalVolume, setInternalVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const volume = externalVolume !== undefined ? externalVolume : internalVolume;

  // Criar URL do blob quando receber áudio
  useEffect(() => {
    if (audio instanceof Blob) {
      const url = URL.createObjectURL(audio);
      setAudioUrl(url);
      
      // Cleanup old URL
      return () => {
        if (audioUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
      };
    } else if (externalAudioUrl) {
      setAudioUrl(externalAudioUrl);
    }
  }, [audio, externalAudioUrl]);

  // Configurar áudio quando URL estiver disponível
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      if (autoPlay) {
        audioRef.current.play().catch(error => {
          console.log('Autoplay prevented:', error);
        });
      }
    }
  }, [audioUrl, autoPlay]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setInternalIsPlaying(true);
          if (onPlay) onPlay();
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setInternalIsPlaying(false);
      if (onPause) onPause();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setInternalIsPlaying(false);
      setCurrentTime(0);
      if (onStop) onStop();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setInternalVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (onVolumeChange) onVolumeChange(newVolume);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setInternalIsPlaying(false);
    setCurrentTime(0);
    if (onStop) onStop();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
      className
    )}>
      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? handlePause : handlePlay}
        className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors text-white flex-shrink-0"
        aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {/* Progress Bar */}
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono min-w-[36px]">
          {formatTime(currentTime)}
        </span>
        
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono min-w-[36px]">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVolumeChange({ target: { value: volume === 0 ? '1' : '0' } } as any)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Alternar volume"
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Volume"
        />
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Fechar player"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}