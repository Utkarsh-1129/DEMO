
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Send,
  Loader,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import apiService from '../../services/api'
import toast from 'react-hot-toast'

const VoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState('')
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const streamRef = useRef(null)
  
  const { t, currentLanguage } = useLanguage()

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      const chunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Microphone access denied. Please allow microphone permissions.')
      toast.error('Failed to access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscript('')
    setResponse('')
    setRecordingTime(0)
    setError('')
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const processAudio = async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    setError('')
    
    try {
      // Create FormData for audio upload
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', currentLanguage)

      // Send to backend for processing
      const result = await apiService.processVoiceQuery(formData)
      
      setTranscript(result.transcript || 'Audio processed successfully')
      setResponse(result.response || 'Thank you for your query. Our AI is processing your request.')
      
      toast.success('Voice query processed successfully!')
      
    } catch (error) {
      console.error('Error processing audio:', error)
      setError('Failed to process audio. Please try again.')
      toast.error('Failed to process voice query')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎤 {t('voiceInput')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLanguage === 'ml' 
            ? 'മലയാളത്തിലോ ഇംഗ്ലീഷിലോ സംസാരിക്കുക' 
            : 'Speak in Malayalam or English'
          }
        </p>
      </div>

      {/* Recording Interface */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
        <div className="text-center space-y-6">
          {/* Recording Button */}
          <motion.div
            animate={{ 
              scale: isRecording ? [1, 1.1, 1] : 1,
              boxShadow: isRecording 
                ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
                : '0 0 0 0 rgba(59, 130, 246, 0)'
            }}
            transition={{ 
              duration: isRecording ? 1.5 : 0.3,
              repeat: isRecording ? Infinity : 0
            }}
            className="inline-block"
          >
            <Button
              size="xl"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-24 h-24 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-lg`}
              icon={isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            />
          </motion.div>

          {/* Recording Status */}
          <div className="space-y-2">
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center space-x-2"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Recording... {formatTime(recordingTime)}
                </span>
              </motion.div>
            )}
            
            {!isRecording && !audioBlob && (
              <p className="text-gray-600 dark:text-gray-400">
                {t('clickToStartRecording')}
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Audio Playback & Controls */}
      <AnimatePresence>
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎵 Recorded Audio
            </h3>
            
            <div className="space-y-4">
              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={playAudio}
                  icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetRecording}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </Button>
                
                <Button
                  onClick={processAudio}
                  loading={isProcessing}
                  disabled={isProcessing}
                  icon={<Send className="w-4 h-4" />}
                >
                  {isProcessing ? 'Processing...' : 'Send Query'}
                </Button>
              </div>
              
              {/* Recording Info */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Duration: {formatTime(recordingTime)} • 
                Size: {audioBlob ? (audioBlob.size / 1024).toFixed(1) + ' KB' : '0 KB'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Status */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card text-center"
          >
            <LoadingSpinner size="lg" text="Processing your voice query..." />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Our AI is analyzing your audio and preparing a response...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript & Response */}
      <AnimatePresence>
        {(transcript || response) && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {transcript && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  📝 Transcript
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{transcript}</p>
                </div>
              </div>
            )}
            
            {response && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  🤖 AI Response
                </h3>
                <div className="bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{response}</p>
                </div>
                
                {/* Response Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Volume2 className="w-4 h-4" />}
                      onClick={() => {
                        // Text-to-speech functionality
                        if ('speechSynthesis' in window) {
                          const utterance = new SpeechSynthesisUtterance(response)
                          utterance.lang = currentLanguage === 'ml' ? 'ml-IN' : 'en-US'
                          speechSynthesis.speak(utterance)
                        }
                      }}
                    >
                      Listen
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          💡 Voice Input Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            Speak clearly and at a moderate pace
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            Use either Malayalam or English
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            Minimize background noise for better accuracy
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            Keep recordings under 2 minutes for optimal processing
          </li>
        </ul>
      </div>
    </div>
  )
}

export default VoiceInput
 
