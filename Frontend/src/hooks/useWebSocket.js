 

import { useEffect, useRef, useState } from 'react'
import wsService from '../services/websocket'

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const handlersRef = useRef(new Map())

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect()

    // Setup connection status handler
    wsService.on('connectionStatus', ({ connected }) => {
      setIsConnected(connected)
    })

    // Setup message handler
    wsService.on('message', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      wsService.disconnect()
    }
  }, [])

  const sendMessage = (type, data) => {
    wsService.emit(type, data)
  }

  const subscribe = (eventType, handler) => {
    wsService.on(eventType, handler)
    handlersRef.current.set(eventType, handler)
  }

  const unsubscribe = (eventType) => {
    wsService.off(eventType)
    handlersRef.current.delete(eventType)
  }

  return {
    isConnected,
    messages,
    sendMessage,
    subscribe,
    unsubscribe,
  }
}

