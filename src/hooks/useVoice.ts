// src/hooks/useVoice.ts
import { useState, useCallback, useRef } from 'react';

interface UseVoiceProps {
  onTranscriptionComplete?: (text: string) => void;
}

export function useVoice({ onTranscriptionComplete }: UseVoiceProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Resetar estado
      setRecordingDuration(0);
      chunksRef.current = [];

      // Solicitar acesso ao microfone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;

      // Criar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Coletar dados de áudio
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Quando parar a gravação
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        setIsRecording(false);
        
        // Limpar timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        try {
          // Criar blob com o áudio
          const audioBlob = new Blob(chunksRef.current, { 
            type: 'audio/webm;codecs=opus' 
          });
          
          if (audioBlob.size === 0) {
            console.warn('Áudio vazio, ignorando...');
            setIsProcessing(false);
            return;
          }

          console.log(`🎤 Áudio gravado: ${(audioBlob.size / 1024).toFixed(2)} KB`);

          // Enviar para transcrição
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch('/api/speech', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to transcribe audio');
          }

          const data = await response.json();
          console.log('📝 Texto transcrito:', data.text);

          if (data.text && onTranscriptionComplete) {
            onTranscriptionComplete(data.text);
          } else {
            console.warn('Nenhum texto transcrito');
          }

        } catch (error) {
          console.error('Error processing audio:', error);
          alert('Erro ao processar áudio. Tente novamente.');
        } finally {
          setIsProcessing(false);
          setRecordingDuration(0);
        }

        // Limpar stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Iniciar gravação
      mediaRecorder.start(1000);
      setIsRecording(true);

      // Iniciar timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      console.log('🎙️ Gravação iniciada!');

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, [onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Parando gravação...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      chunksRef.current = [];
      setRecordingDuration(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Limpar stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      console.log('❌ Gravação cancelada');
    }
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    isProcessing,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    formatDuration,
  };
}