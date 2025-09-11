
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/auth'
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(credentials) {
    return this.client.post('/auth/login', credentials)
  }

  async register(userData) {
    return this.client.post('/auth/register', userData)
  }

  async logout() {
    return this.client.post('/auth/logout')
  }

  async getUserProfile() {
    return this.client.get('/user/profile')
  }

  async updateProfile(profileData) {
    return this.client.put('/user/profile', profileData)
  }

  // Query endpoints
  async submitQuery(queryData) {
    return this.client.post('/query', queryData)
  }

  async getQueryHistory(page = 1, limit = 10) {
    return this.client.get(`/query/history?page=${page}&limit=${limit}`)
  }

  async getQueryById(queryId) {
    return this.client.get(`/query/${queryId}`)
  }

  // Image analysis
  async analyzeImage(imageFile, additionalData = {}) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })
    
    return this.client.post('/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // Longer timeout for image processing
    })
  }

  // Voice processing
  async processVoice(audioBlob, language = 'en') {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    formData.append('language', language)
    
    return this.client.post('/voice/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // Longer timeout for voice processing
    })
  }

  // Weather data
  async getWeatherData(location) {
    return this.client.get(`/weather?location=${encodeURIComponent(location)}`)
  }

  // Recommendations
  async getRecommendations(userId) {
    return this.client.get(`/recommendations/${userId}`)
  }

  // Crop calendar
  async getCropCalendar(location, cropType) {
    return this.client.get(`/crop-calendar?location=${location}&crop=${cropType}`)
  }

  // Market prices
  async getMarketPrices(location, crop) {
    return this.client.get(`/market-prices?location=${location}&crop=${crop}`)
  }
}

export default new APIService()
