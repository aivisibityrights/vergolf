'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, Calendar, Users, LogOut, CircleDot, Flag } from 'lucide-react'
import { getCurrentUser, signOut, type User as UserType } from '@/lib/supabase'

export default function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  // Check user session using getCurrentUser from supabase.ts
  useEffect(() => {
    checkUser()
    
    // Check session every 5 minutes
    const interval = setInterval(checkUser, 5 * 60 * 1000)
    
    // Check on focus
    const handleFocus = () => checkUser()
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('User check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Build navigation items
  const navItems = [
    { href: '/', label: 'หน้าแรก', icon: CircleDot },
    { href: '/courses', label: 'สนามกอล์ฟ', icon: Flag },
    { href: '/booking', label: 'จองสนาม', icon: Calendar },
    { href: '/buddy', label: 'หาเพื่อนออกรอบ', icon: Users },
  ]

  // Add dashboard link based on account type
  if (user) {
    const dashboardPath = 
      user.account_type === 'golfer' ? '/dashboard/golfer' :
      user.account_type === 'caddy' ? '/dashboard/caddy' :
      user.account_type === 'pro' ? '/dashboard/pro' :
      user.account_type === 'course_owner' ? '/dashboard/course' :
      '/dashboard'

    navItems.push({
      href: dashboardPath,
      label: 'Dashboard',
      icon: User
    })
  }

  // Helper to get display name
  const getDisplayName = (user: UserType) => {
    if (user.display_name) return user.display_name
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
    if (user.first_name) return user.first_name
    return user.email.split('@')[0]
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <CircleDot className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">VerGolf</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                            (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side - Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-24 animate-pulse bg-gray-200 rounded-md"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url}
                      alt={getDisplayName(user)}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-medium">
                        {getDisplayName(user).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700">
                    สวัสดี, {getDisplayName(user)}
                  </span>
                  {user.is_verified && (
                    <span className="text-xs text-green-600" title="AIVerID Verified">
                      ✓
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>เข้าสู่ระบบด้วย AIVerID</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                            (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Mobile auth section */}
            <div className="pt-4 border-t border-gray-200">
              {loading ? (
                <div className="px-3 py-2">
                  <div className="h-8 w-32 animate-pulse bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                <>
                  <div className="px-3 py-2 flex items-center space-x-2">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url}
                        alt={getDisplayName(user)}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-medium">
                          {getDisplayName(user).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-700">
                      สวัสดี, {getDisplayName(user)}
                    </span>
                    {user.is_verified && (
                      <span className="text-xs text-green-600" title="AIVerID Verified">
                        ✓
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mx-2 px-3 py-2 text-base font-medium text-center text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>เข้าสู่ระบบด้วย AIVerID</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}