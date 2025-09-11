
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Camera, MessageSquare, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import Button from '../components/ui/Button'
import VoiceInput from '../components/input/VoiceInput'
import ImageUpload from '../components/input/ImageUpload'
import ChatInterface from '../components/input/ChatInterface'

const QueryPage = () => {
  const [searchParams] = useSearchParams()
  const [activeMethod, setActiveMethod] = useState('text')
  const { t } = useLanguage()

  useEffect(() => {
    const method = searchParams.get('method')
    if (method && ['voice', 'image', 'text'].includes(method)) {
      setActiveMethod(method)
    }
  }, [searchParams])

  const inputMethods = [
    {
      id: 'voice',
      title: t('voiceInput'),
      description: t('voiceInputDesc'),
      icon: Mic,
      color: 'bg-blue-500',
      component: VoiceInput
    },
    {
      id: 'image',
      title: t('imageAnalysis'),
      description: t('imageAnalysisDesc'),
      icon: Camera,
      color: 'bg-green-500',
      component: ImageUpload
    },
    {
      id: 'text',
      title: t('textChat'),
      description: t('textChatDesc'),
      icon: MessageSquare,
      color: 'bg-purple-500',
      component: ChatInterface
    }
  ]

  const activeMethodData = inputMethods.find(method => method.id === activeMethod)
  const ActiveComponent = activeMethodData?.component

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('aiAssistant')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your preferred way to interact with our AI farming assistant
        </p>
      </motion.div>

      {/* Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {inputMethods.map((method) => {
          const Icon = method.icon
          const isActive = activeMethod === method.id
          
          return (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMethod(method.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${method.color} p-2 rounded-lg text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    isActive 
                      ? 'text-primary-700 dark:text-primary-300' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Active Input Component */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMethod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default QueryPage

 
