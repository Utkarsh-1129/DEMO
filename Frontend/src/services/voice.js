 
class VoiceRecordingService {
  constructor() {
    this.mediaRecorder = null
    this.audioChunks = []
    this.stream = null
    this.recognition = null
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    this.isRecording = false
    this.onTranscriptUpdate = null
    this.onRecordingStateChange = null
  }

  async startRecording(language = 'en-US') {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })

      // Setup MediaRecorder for audio capture
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start(100) // Collect data every 100ms

      // Setup Speech Recognition for real-time transcription
      if (this.isSupported) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = this.getLanguageCode(language)

        this.recognition.onresult = (event) => {
          let transcript = ''
          let isFinal = false

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            transcript += result[0].transcript
            if (result.isFinal) {
              isFinal = true
            }
          }

          if (this.onTranscriptUpdate) {
            this.onTranscriptUpdate(transcript, isFinal)
          }
        }

        this.recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
        }

        this.recognition.start()
      }

      this.isRecording = true
      if (this.onRecordingStateChange) {
        this.onRecordingStateChange(true)
      }

    } catch (error) {
      console.error('Error starting recording:', error)
      throw new Error('Microphone access denied. Please allow microphone access and try again.')
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.isRecording) {
        reject(new Error('Not currently recording'))
        return
      }

      try {
        // Stop MediaRecorder
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
            resolve(audioBlob)
          }
          this.mediaRecorder.stop()
        }

        // Stop Speech Recognition
        if (this.recognition) {
          this.recognition.stop()
        }

        // Stop media stream
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop())
        }

        this.isRecording = false
        if (this.onRecordingStateChange) {
          this.onRecordingStateChange(false)
        }

      } catch (error) {
        reject(error)
      }
    })
  }

  getLanguageCode(language) {
    const languageMap = {
      'en': 'en-US',
      'ml': 'ml-IN',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
    }
    return languageMap[language] || 'en-US'
  }

  setTranscriptCallback(callback) {
    this.onTranscriptUpdate = callback
  }

  setRecordingStateCallback(callback) {
    this.onRecordingStateChange = callback
  }

  isRecordingActive() {
    return this.isRecording
  }

  isSpeechRecognitionSupported() {
    return this.isSupported
  }

  // Convert audio blob to different formats if needed
  async convertAudioFormat(audioBlob, targetFormat = 'wav') {
    // This would require additional libraries like lamejs for MP3 conversion
    // For now, return the original blob
    return audioBlob
  }

  // Get audio duration
  async getAudioDuration(audioBlob) {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }
      audio.src = URL.createObjectURL(audioBlob)
    })
  }
}

export default new VoiceRecordingService()

