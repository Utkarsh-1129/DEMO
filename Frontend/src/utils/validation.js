
// Form validation utilities
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[1-9][\d\s\-\(\)]{7,15}$/
  return phoneRegex.test(phone)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
}

export const validateImageFile = (file) => {
  const maxSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760 // 10MB
  const supportedFormats = process.env.REACT_APP_SUPPORTED_IMAGE_FORMATS?.split(',') || ['jpeg', 'jpg', 'png', 'webp']
  
  const fileExtension = file.name.split('.').pop().toLowerCase()
  
  return {
    isValid: file.size <= maxSize && supportedFormats.includes(fileExtension),
    isValidSize: file.size <= maxSize,
    isValidFormat: supportedFormats.includes(fileExtension),
    size: file.size,
    maxSize,
    format: fileExtension,
    supportedFormats
  }
}

export const validateAudioFile = (file) => {
  const maxSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760 // 10MB
  const supportedFormats = process.env.REACT_APP_SUPPORTED_AUDIO_FORMATS?.split(',') || ['webm', 'mp3', 'wav']
  
  const fileExtension = file.name.split('.').pop().toLowerCase()
  
  return {
    isValid: file.size <= maxSize && supportedFormats.includes(fileExtension),
    isValidSize: file.size <= maxSize,
    isValidFormat: supportedFormats.includes(fileExtension),
    size: file.size,
    maxSize,
    format: fileExtension,
    supportedFormats
  }
}

frontend/src/utils/storage.js
// Local storage utilities with error handling
class StorageManager {
  constructor() {
    this.isAvailable = this.checkAvailability()
  }

  checkAvailability() {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  set(key, value) {
    if (!this.isAvailable) return false
    
    try {
      const serializedValue = JSON.stringify({
        value,
        timestamp: Date.now(),
        version: process.env.REACT_APP_VERSION || '1.0.0'
      })
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  get(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue
    
    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue
      
      const parsed = JSON.parse(item)
      return parsed.value
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  }

  remove(key) {
    if (!this.isAvailable) return false
    
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  clear() {
    if (!this.isAvailable) return false
    
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

  // Get all keys with a specific prefix
  getKeys(prefix = '') {
    if (!this.isAvailable) return []
    
    try {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          keys.push(key)
        }
      }
      return keys
    } catch (error) {
      console.error('Storage getKeys error:', error)
      return []
    }
  }

  // Check if storage is getting full
  getStorageInfo() {
    if (!this.isAvailable) return null
    
    try {
      let totalSize = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length
        }
      }
      
      return {
        used: totalSize,
        usedMB: (totalSize / 1024 / 1024).toFixed(2),
        itemCount: localStorage.length
      }
    } catch (error) {
      console.error('Storage info error:', error)
      return null
    }
  }
}

export const storage = new StorageManager()

// Specific storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  AUTH_TOKEN: 'auth_token',
  QUERY_HISTORY: 'query_history',
  OFFLINE_DATA: 'offline_data',
  SETTINGS: 'app_settings'
}

// Performance monitoring utilities
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
  }

  // Start timing an operation
  startTiming(label) {
    this.metrics.set(label, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    })
  }

  // End timing an operation
  endTiming(label) {
    const metric = this.metrics.get(label)
    if (metric) {
      metric.endTime = performance.now()
      metric.duration = metric.endTime - metric.startTime
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${metric.duration.toFixed(2)}ms`)
      }
      
      return metric.duration
    }
    return null
  }

  // Get timing for a label
  getTiming(label) {
    return this.metrics.get(label)
  }

  // Get all timings
  getAllTimings() {
    const timings = {}
    this.metrics.forEach((value, key) => {
      timings[key] = value
    })
    return timings
  }

  // Monitor component render times
  measureComponent(componentName, renderFn) {
    this.startTiming(`${componentName}_render`)
    const result = renderFn()
    this.endTiming(`${componentName}_render`)
    return result
  }

  // Monitor API call performance
  async measureApiCall(apiName, apiCall) {
    this.startTiming(`api_${apiName}`)
    try {
      const result = await apiCall()
      this.endTiming(`api_${apiName}`)
      return result
    } catch (error) {
      this.endTiming(`api_${apiName}`)
      throw error
    }
  }

  // Monitor memory usage
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      }
    }
    return null
  }

  // Monitor network performance
  getNetworkInfo() {
    if (navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      }
    }
    return null
  }

  // Clear all metrics
  clear() {
    this.metrics.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()

// React performance utilities
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return React.memo((props) => {
    return performanceMonitor.measureComponent(
      componentName,
      () => <WrappedComponent {...props} />
    )
  })
}

// Debounce utility for performance
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle utility for performance
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Offline functionality utilities
import { storage, STORAGE_KEYS } from './storage'

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine
    this.listeners = new Set()
    this.queuedRequests = []
    
    this.setupEventListeners()
    this.loadQueuedRequests()
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners('online')
      this.processQueuedRequests()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners('offline')
    })
  }

  // Add listener for online/offline events
  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners(status) {
    this.listeners.forEach(callback => callback(status, this.isOnline))
  }

  // Queue requests for when back online
  queueRequest(request) {
    const queuedRequest = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      ...request
    }
    
    this.queuedRequests.push(queuedRequest)
    this.saveQueuedRequests()
    
    return queuedRequest.id
  }

  // Process queued requests when back online
  async processQueuedRequests() {
    if (!this.isOnline || this.queuedRequests.length === 0) return

    const requests = [...this.queuedRequests]
    this.queuedRequests = []
    this.saveQueuedRequests()

    for (const request of requests) {
      try {
        await this.executeRequest(request)
      } catch (error) {
        console.error('Failed to process queued request:', error)
        // Re-queue failed requests
        this.queuedRequests.push(request)
      }
    }

    this.saveQueuedRequests()
  }

  async executeRequest(request) {
    const { url, method, data, headers } = request
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return response.json()
  }

  // Save/load queued requests to localStorage
  saveQueuedRequests() {
    storage.set(STORAGE_KEYS.OFFLINE_DATA, {
      queuedRequests: this.queuedRequests,
      lastUpdated: Date.now()
    })
  }

  loadQueuedRequests() {
    const offlineData = storage.get(STORAGE_KEYS.OFFLINE_DATA, {})
    this.queuedRequests = offlineData.queuedRequests || []
  }

  // Clear all queued requests
  clearQueue() {
    this.queuedRequests = []
    this.saveQueuedRequests()
  }

  // Get offline status and queue info
  getStatus() {
    return {
      isOnline: this.isOnline,
      queuedRequests: this.queuedRequests.length,
      lastSync: storage.get(STORAGE_KEYS.OFFLINE_DATA, {}).lastUpdated
    }
  }
}

export const offlineManager = new OfflineManager()

// React hook for offline status
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = React.useState(offlineManager.isOnline)
  const [queuedRequests, setQueuedRequests] = React.useState(0)

  React.useEffect(() => {
    const unsubscribe = offlineManager.addListener((status, online) => {
      setIsOnline(online)
      setQueuedRequests(offlineManager.queuedRequests.length)
    })

    return unsubscribe
  }, [])

  return {
    isOnline,
    queuedRequests,
    clearQueue: () => offlineManager.clearQueue()
  }
}
