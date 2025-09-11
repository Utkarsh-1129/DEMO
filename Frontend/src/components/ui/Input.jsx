 
import React, { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  labelClassName,
  type = 'text',
  ...props
}, ref) => {
  const inputClasses = clsx(
    'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white': !error,
      'border-red-500 focus:ring-red-500': error,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  )

  return (
    <div className={containerClassName}>
      {label && (
        <label className={clsx('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2', labelClassName)}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 w-5 h-5">
              {leftIcon}
            </span>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-400 w-5 h-5">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

