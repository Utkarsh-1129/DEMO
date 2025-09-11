 import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language)
      localStorage.setItem('language', language)
    }
  }

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isRTL: currentLanguage === 'ar', // Add RTL support if needed
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
