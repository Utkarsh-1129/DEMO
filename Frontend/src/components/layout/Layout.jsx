 
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          <div className="container-custom">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

