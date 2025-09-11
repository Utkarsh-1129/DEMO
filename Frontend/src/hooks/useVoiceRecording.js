
import { useState, useCallback, useRef } from 'react'
import voiceService from '../services/voice'
import { useLanguage } from '../context/LanguageContext'

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const { currentLanguage } = useLanguage()
  const audioRef = useRef(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setTranscript('')
      
      // Set up callbacks
      voiceService.setTranscriptCallback((text, isFinal) => {
        setTranscript(text)
      })
      
      voiceService.setRecordingStateCallback((recording) => {
        setIsRecording(recording)
      })

      await voiceService.startRecording(currentLanguage)
    } catch (err) {
      setError(err.message)
      setIsRecording(false)
    }
  }, [currentLanguage])

  const stopRecording = useCallback(async () => {
    try {
      setIsProcessing(true)
      const audioBlob = await voiceService.stopRecording()
      audioRef.current = audioBlob
      return audioBlob
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      return await stopRecording()
    } else {
      await startRecording()
      return null
    }
  }, [isRecording, startRecording, stopRecording])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isRecording,
    transcript,
    isProcessing,
    error,
    audioBlob: audioRef.current,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
    clearError,
    isSupported: voiceService.isSpeechRecognitionSupported(),
  }
}
 
