
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../context/LanguageContext'
import { INDIAN_STATES } from '../utils/constants'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      userType: user?.userType || 'farmer'
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // await apiService.updateProfile(data)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const stats = [
    {
      label: 'Total Queries',
      value: '47',
      icon: '💬',
      color: 'text-blue-600'
    },
    {
      label: 'Images Analyzed',
      value: '23',
      icon: '📸',
      color: 'text-green-600'
    },
    {
      label: 'Voice Queries',
      value: '15',
      icon: '🎤',
      color: 'text-purple-600'
    },
    {
      label: 'Days Active',
      value: '12',
      icon: '📅',
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-green-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-primary-100 capitalize">
                {user?.userType === 'farmer' ? '👨‍🌾 Farmer' : '👨‍💼 Agricultural Officer'}
              </p>
              <p className="text-primary-100 text-sm">
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            icon={isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            className="text-white hover:bg-white/20"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  leftIcon={<User className="w-5 h-5" />}
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  leftIcon={<Phone className="w-5 h-5" />}
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+]?[1-9][\d\s\-\(\)]{7,15}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  error={errors.phone?.message}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      {...register('location', { required: 'Location is required' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select your state</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state.value} value={state.value}>
                          {currentLanguage === 'ml' ? state.labelMl : state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    loading={isLoading}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {user?.location?.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Usage Statistics
            </h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export History
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage 
