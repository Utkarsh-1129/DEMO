
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  TrendingUp,
  Calendar,
  MessageSquare,
  Camera,
  Mic,
  ArrowRight,
  Leaf,
  AlertTriangle,
  DollarSign
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../context/LanguageContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import apiService from '../services/api'

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [recentQueries, setRecentQueries] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [weather, queries, recs] = await Promise.all([
        apiService.getWeatherData(user?.location || 'kerala').catch(() => null),
        apiService.getQueryHistory(1, 5).catch(() => ({ queries: [] })),
        apiService.getRecommendations(user?.id).catch(() => [])
      ])
      
      setWeatherData(weather)
      setRecentQueries(queries.queries || [])
      setRecommendations(recs || [])
    } catch (error) {
      console.error('Dashboard data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: t('voiceInput'),
      description: t('voiceInputDesc'),
      icon: Mic,
      color: 'bg-blue-500',
      action: () => navigate('/query?method=voice')
    },
    {
      title: t('imageAnalysis'),
      description: t('imageAnalysisDesc'),
      icon: Camera,
      color: 'bg-green-500',
      action: () => navigate('/query?method=image')
    },
    {
      title: t('textChat'),
      description: t('textChatDesc'),
      icon: MessageSquare,
      color: 'bg-purple-500',
      action: () => navigate('/query?method=text')
    }
  ]

  const mockRecommendations = [
    {
      id: 1,
      type: 'weather',
      title: t('monsoonPreparation'),
      description: 'Heavy rains expected next week. Prepare drainage systems.',
      icon: Cloud,
      priority: 'high',
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'fertilizer',
      title: t('fertilizerAlert'),
      description: 'Optimal time for nitrogen application in rice fields.',
      icon: Leaf,
      priority: 'medium',
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'market',
      title: t('marketPrice'),
      description: 'Tomato prices increased by 15% this week.',
      icon: TrendingUp,
      priority: 'low',
      color: 'text-orange-600'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-green-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-primary-100">
              Ready to optimize your farming with AI assistance?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="w-10 h-10" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('inputMethodsTitle')}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={action.action}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Get Started <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('weatherToday')}
              </h3>
              <Cloud className="w-5 h-5 text-gray-400" />
            </div>
            
            {weatherData ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {weatherData.temperature || '28'}°C
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {weatherData.condition || t('partlyCloudy')}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('humidity')}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {weatherData.humidity || '65'}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('windSpeed')}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {weatherData.windSpeed || '12'} km/h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Weather data unavailable
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('recentQueries')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/query')}
                className="text-primary-600 dark:text-primary-400"
              >
                View All
              </Button>
            </div>
            
            {recentQueries.length > 0 ? (
              <div className="space-y-3">
                {recentQueries.slice(0, 3).map((query, index) => (
                  <div key={query.id || index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {query.question || `Sample farming query ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : '2 hours ago'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No queries yet. Start asking questions!
                </p>
                <Button
                  onClick={() => navigate('/query')}
                  size="sm"
                >
                  Ask Your First Question
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Smart Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('smartRecommendations')}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {mockRecommendations.map((rec, index) => {
            const Icon = rec.icon
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="card hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <Icon className={`w-5 h-5 ${rec.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {rec.title}
                      </h4>
                      {rec.priority === 'high' && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
 
