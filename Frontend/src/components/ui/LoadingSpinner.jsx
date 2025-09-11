 
import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className,
  text,
  overlay = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    primary: 'text-primary-500',
    white: 'text-white',
    gray: 'text-gray-500',
    green: 'text-green-500',
  }

  const Spinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={clsx(sizes[size], colors[color], className)}
    >
      <svg fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
          <Spinner />
          {text && (
            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Spinner />
      {text && (
        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner

