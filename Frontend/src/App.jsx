import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './context/ThemeContext'

// Pages
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import QueryPage from './pages/QueryPage'
import ProfilePage from './pages/ProfilePage'

// Components
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="gradient-bg min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/auth" 
              element={
                !isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AuthPage />
                  </motion.div>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Layout />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="query" element={<QueryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App