
import { io } from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.eventHandlers = new Map()
    this.isConnected = false
  }

  connect() {
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'
    
    try {
      this.socket = io(WS_URL, {
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('authToken')
        }
      })

      this.setupEventListeners()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.handleConnectionError()
    }
  }

  setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.isConnected = true
      this.reconnectAttempts = 0
      this.emit('connectionStatus', { connected: true })
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.isConnected = false
      this.emit('connectionStatus', { connected: false })
      this.attemptReconnect()
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
      this.handleConnectionError()
    })

    // Handle incoming messages
    this.socket.on('message', (data) => {
      this.handleMessage('message', data)
    })

    this.socket.on('notification', (data) => {
      this.handleMessage('notification', data)
    })

    this.socket.on('queryResponse', (data) => {
      this.handleMessage('queryResponse', data)
    })

    this.socket.on('typingIndicator', (data) => {
      this.handleMessage('typingIndicator', data)
    })
  }

  handleMessage(eventType, data) {
    const handler = this.eventHandlers.get(eventType)
    if (handler) {
      handler(data)
    }
  }

  on(eventType, handler) {
    this.eventHandlers.set(eventType, handler)
  }

  off(eventType) {
    this.eventHandlers.delete(eventType)
  }

  emit(eventType, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventType, data)
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, delay)
    }
  }

  handleConnectionError() {
    this.isConnected = false
    this.emit('connectionStatus', { connected: false })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Specific methods for farming app
  sendQuery(queryData) {
    this.emit('query', queryData)
  }

  sendTypingIndicator(isTyping) {
    this.emit('typing', { isTyping })
  }

  joinRoom(roomId) {
    this.emit('joinRoom', { roomId })
  }

  leaveRoom(roomId) {
    this.emit('leaveRoom', { roomId })
  }
}

export default new WebSocketService()
