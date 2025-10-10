import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setsidebar] = useState(false)
  const { user } = useUser()

  return user ? (
    <div className="fixed inset-0 flex flex-col bg-[#F4F7FB]">
      {/* Navbar */}
      <nav className="w-full px-8 h-14 flex items-center justify-between border-b border-gray-200 bg-white z-50">
        <img
          className="w-24 sm:w-28 cursor-pointer"
          src={assets.logo}
          onClick={() => navigate('/')}
          alt="logo"
        />
        {sidebar ? (
          <X
            onClick={() => setsidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          />
        ) : (
          <Menu
            onClick={() => setsidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          />
        )}
      </nav>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebar={sidebar} setsidebar={setsidebar} />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  )
}

export default Layout
