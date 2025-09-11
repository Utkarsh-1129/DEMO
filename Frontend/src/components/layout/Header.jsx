 
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sprout, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import Button from '../ui/Button'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { currentLanguage, changeLanguage, t } = useLanguage()

  const handleLogout = async () => {
    await logout()
    setIsProfileOpen(false)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('appName')}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              className="text-gray-600 dark:text-gray-300"
            />

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => changeLanguage(currentLanguage === 'en' ? 'ml' : 'en')}
              icon={<Globe className="w-4 h-4" />}
              className="text-gray-600 dark:text-gray-300"
            >
              {currentLanguage === 'en' ? 'മലയാളം' : 'English'}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              icon={<Bell className="w-4 h-4" />}
              className="text-gray-600 dark:text-gray-300 relative"
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
              >
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.phone}
                    </p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{t('profile')}</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>{t('settings')}</span>
                  </button>
                  
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              icon={isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              className="text-gray-600 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('theme')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                />
              </div>
              
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Language
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeLanguage(currentLanguage === 'en' ? 'ml' : 'en')}
                >
                  {currentLanguage === 'en' ? 'മലയാളം' : 'English'}
                </Button>
              </div>
              
              <hr className="border-gray-200 dark:border-gray-700" />
              
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {t('profile')}
              </button>
              
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {t('settings')}
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t('logout')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header

