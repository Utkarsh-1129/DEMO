 
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  User, 
  Bot, 
  Loader, 
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Input from '../ui/Input'
import apiService from '../../services/api'
import toast from 'react-hot-toast'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: currentLanguage === 'ml' 
          ? 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായകനാണ്. എന്തെങ്കിലും ചോദ്യങ്ങൾ ഉണ്ടോ?'
          : 'Hello! I\'m your AI farming assistant. How can I help you today?',
        timestamp: new Date(),
        suggestions: [
          currentLanguage === 'ml' ? 'നെല്ലിന്റെ രോഗങ്ങൾ' : 'Rice diseases',
          currentLanguage === 'ml' ? 'കാലാവസ്ഥ പ്രവചനം' : 'Weather forecast',
          currentLanguage === 'ml' ? 'വിള വിലകൾ' : 'Crop prices',
          currentLanguage === 'ml' ? 'വളം ഉപയോഗം' : 'Fertilizer usage'
        ]
      }
    ])
  }, [currentLanguage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await apiService.sendChatMessage({
        message: messageText.trim(),
        language: currentLanguage,
        userId: user?.id,
        context: messages.slice(-5) // Send last 5 messages for context
      })

      // Simulate typing delay
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.message || 'Thank you for your question. Let me help you with that.',
          timestamp: new Date(),
          suggestions: response.suggestions || []
        }

        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }

      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }

  const speakMessage = (content) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = currentLanguage === 'ml' ? 'ml-IN' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: currentLanguage === 'ml' 
          ? 'ചാറ്റ് ക്ലിയർ ചെയ്തു. പുതിയ സംഭാഷണം ആരംഭിക്കാം!'
          : 'Chat cleared. Let\'s start a fresh conversation!',
        timestamp: new Date()
      }
    ])
  }

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user'
    const isError = message.isError

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-primary-500 text-white' 
              : isError
                ? 'bg-red-500 text-white'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>

          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-primary-500 text-white' 
              : isError
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            
            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs opacity-75">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message Actions */}
            {!isUser && (
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => speakMessage(message.content)}
                    className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start space-x-3 max-w-3xl">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              💬 {t('textChat')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered farming assistant
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Clear Chat
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentLanguage === 'ml' 
                  ? 'നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുക...' 
                  : 'Type your farming question...'
                }
                className="resize-none"
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              loading={isLoading}
              icon={<Send className="w-4 h-4" />}
              className="px-4 py-2"
            >
              Send
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Tips */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          💡 Chat Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Ask specific questions about crops, diseases, or farming practices
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Use either Malayalam or English - I understand both!
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Include details like crop type, symptoms, or location for better help
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Try the suggested questions for quick answers
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ChatInterface

