'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users, Trophy, Clock, ChevronRight } from 'lucide-react'

interface UserSession {
  name: string
  email: string
  userType: string
}

interface Booking {
  id: string
  course_name: string
  play_date: string
  tee_time: string
  players: number
  status: 'confirmed' | 'pending' | 'completed'
}

export default function GolferDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({
    totalRounds: 0,
    averageScore: 0,
    favoritesCourse: '',
    upcomingGames: 0
  })

  const checkSession = useCallback(async () => {
    const response = await fetch('/api/oauth/session')
    const data = await response.json()
    
    if (!data.session || data.session.userType !== 'golfer') {
      router.push('/login')
      return
    }
    
    setUser(data.session)
  }, [router]) // เพิ่ม router เป็น dependency

  const loadDashboardData = async () => {
    // Mock data for now
    setRecentBookings([
      {
        id: '1',
        course_name: 'Alpine Golf Club',
        play_date: '2025-07-02',
        tee_time: '08:00',
        players: 4,
        status: 'confirmed'
      },
      {
        id: '2',
        course_name: 'Riverdale Golf Course',
        play_date: '2025-07-05',
        tee_time: '13:30',
        players: 2,
        status: 'pending'
      }
    ])
    
    setStats({
      totalRounds: 42,
      averageScore: 85,
      favoritesCourse: 'Alpine Golf Club',
      upcomingGames: 2
    })
  }

  useEffect(() => {
    checkSession()
    loadDashboardData()
  }, [checkSession]) // เพิ่ม checkSession เป็น dependency

  const handleSignOut = async () => {
    await fetch('/api/oauth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">VG</span>
                </div>
                <span className="text-xl font-bold text-gray-900">VerGolf</span>
              </Link>
              
              <div className="hidden md:flex space-x-4">
                <Link href="/booking" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  จองสนาม
                </Link>
                <Link href="/history" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  ประวัติการเล่น
                </Link>
                <Link href="/scores" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  สกอร์การ์ด
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">สวัสดี, {user?.name || 'นักกอล์ฟ'}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ยินดีต้อนรับ, {user?.name || 'นักกอล์ฟ'}! ⛳
          </h1>
          <p className="text-gray-600 mt-1">
            จัดการการจองและติดตามสถิติการเล่นกอล์ฟของคุณ
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รอบที่เล่นทั้งหมด</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalRounds}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">สกอร์เฉลี่ย</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.averageScore}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">สนามโปรด</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{stats.favoritesCourse}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">นัดที่จะมาถึง</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.upcomingGames}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/booking" className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 transition-colors">
            <h3 className="text-lg font-semibold mb-2">จองสนามกอล์ฟ</h3>
            <p className="text-green-100 text-sm">ค้นหาและจองสนามกอล์ฟที่คุณชื่นชอบ</p>
            <ChevronRight className="h-5 w-5 mt-4" />
          </Link>

          <Link href="/booking/caddie" className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors">
            <h3 className="text-lg font-semibold mb-2">จองแคดดี้</h3>
            <p className="text-blue-100 text-sm">เลือกแคดดี้ที่เหมาะกับสไตล์การเล่นของคุณ</p>
            <ChevronRight className="h-5 w-5 mt-4" />
          </Link>

          <Link href="/lessons" className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 transition-colors">
            <h3 className="text-lg font-semibold mb-2">จองคอร์สเรียน</h3>
            <p className="text-purple-100 text-sm">พัฒนาทักษะกับโปรกอล์ฟมืออาชีพ</p>
            <ChevronRight className="h-5 w-5 mt-4" />
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">การจองล่าสุด</h2>
          </div>
          <div className="divide-y">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{booking.course_name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(booking.play_date).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.tee_time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.players} คน
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'ยืนยันแล้ว' : 
                       booking.status === 'pending' ? 'รอยืนยัน' : 'เสร็จสิ้น'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {recentBookings.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">ยังไม่มีการจอง</p>
                <Link href="/booking" className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
                  จองสนามกอล์ฟ →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}