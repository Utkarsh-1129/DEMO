 

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  Upload, 
  X, 
  RotateCcw, 
  Send, 
  Loader,
  AlertCircle,
  Eye,
  Download,
  Zap
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useLanguage } from '../../context/LanguageContext'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import apiService from '../../services/api'
import toast from 'react-hot-toast'

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState('')
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  
  const { t, currentLanguage } = useLanguage()

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      handleImageSelect(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  const handleImageSelect = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB')
      return
    }

    setSelectedImage(file)
    setError('')
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      })
      
      setCameraStream(stream)
      setShowCamera(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setError('Camera access denied. Please allow camera permissions.')
      toast.error('Failed to access camera')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        handleImageSelect(file)
        stopCamera()
      }, 'image/jpeg', 0.9)
    }
  }

  const resetImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setError('')
    stopCamera()
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('language', currentLanguage)

      const result = await apiService.analyzeImage(formData)
      
      setAnalysisResult(result)
      toast.success('Image analyzed successfully!')
      
    } catch (error) {
      console.error('Error analyzing image:', error)
      setError('Failed to analyze image. Please try again.')
      toast.error('Failed to analyze image')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadResult = () => {
    if (analysisResult) {
      const dataStr = JSON.stringify(analysisResult, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'image-analysis-result.json'
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📸 {t('imageAnalysis')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLanguage === 'ml' 
            ? 'വിള രോഗങ്ങൾ കണ്ടെത്താൻ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക' 
            : 'Upload crop images for AI-powered disease detection'
          }
        </p>
      </div>

      {/* Camera Interface */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <div className="text-center space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={capturePhoto}
                  icon={<Camera className="w-4 h-4" />}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Capture Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  icon={<X className="w-4 h-4" />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Interface */}
      {!selectedImage && !showCamera && (
        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <motion.div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isDragActive ? 'Drop image here' : 'Upload Crop Image'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supports: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload className="w-4 h-4" />}
              variant="outline"
            >
              Choose File
            </Button>
            <Button
              onClick={startCamera}
              icon={<Camera className="w-4 h-4" />}
              variant="outline"
            >
              Use Camera
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageSelect(file)
            }}
            className="hidden"
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-4"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Image Preview & Analysis */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Selected Image
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetImage}
                  icon={<X className="w-4 h-4" />}
                />
              </div>
              
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected crop"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {selectedImage && `${(selectedImage.size / 1024).toFixed(1)} KB`}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={analyzeImage}
                  loading={isProcessing}
                  disabled={isProcessing}
                  icon={<Zap className="w-4 h-4" />}
                >
                  {isProcessing ? 'Analyzing...' : 'Analyze Image'}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetImage}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </Button>
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
            <LoadingSpinner size="lg" text="Analyzing your image..." />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Our AI is examining the image for crop diseases and issues...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Main Analysis */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  🔍 Analysis Results
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadResult}
                  icon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Disease Detection */}
                {analysisResult.disease && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      ⚠️ Disease Detected
                    </h4>
                    <p className="text-red-700 dark:text-red-300">
                      {analysisResult.disease.name}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Confidence: {analysisResult.disease.confidence}%
                    </p>
                  </div>
                )}
                
                {/* Crop Health */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    🌱 Crop Health Status
                  </h4>
                  <p className="text-green-700 dark:text-green-300">
                    {analysisResult.health || 'Healthy crop detected'}
                  </p>
                </div>
                
                {/* Recommendations */}
                {analysisResult.recommendations && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      💡 Recommendations
                    </h4>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Treatment */}
                {analysisResult.treatment && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      🏥 Treatment Suggestions
                    </h4>
                    <p className="text-purple-700 dark:text-purple-300">
                      {analysisResult.treatment}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Analysis Metadata */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                <span>Analysis completed</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          📋 Image Analysis Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-500">•</span>
            Take clear, well-lit photos of affected plant parts
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">•</span>
            Focus on leaves, stems, or fruits showing symptoms
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">•</span>
            Avoid blurry or heavily shadowed images
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">•</span>
            Include some healthy parts for comparison when possible
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ImageUpload

