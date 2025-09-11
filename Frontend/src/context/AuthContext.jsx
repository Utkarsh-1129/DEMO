import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'
import toast from 'react-hot-toast'

// Export the AuthContext so it can be imported elsewhere
export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        const userData = await apiService.getUserProfile()
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials)
      localStorage.setItem('authToken', response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('Login successful!')
      return response
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData)
      localStorage.setItem('authToken', response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('Account created successfully!')
      return response
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}