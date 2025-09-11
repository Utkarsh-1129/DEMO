 
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  MessageSquare, 
  User, 
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import clsx from 'clsx'

const Navigation = () => {
  const location = useLocation()
  const { t } = useLanguage()

  const navigationItems = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: t('query'),
      href: '/query',
      icon: MessageSquare,
      current: location.pathname === '/query'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: location.pathname === '/analytics'
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      current: location.pathname === '/calendar'
    },
    {
      name: t('profile'),
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile'
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    },
  ]

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative',
                    {
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': isActive,
                      'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white': !isActive,
                    }
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation


