'use client'

import Link from 'next/link'
import { Calendar, Users, Trophy, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [user, setUser] = useState(null)

  // Check auth status on mount
  useEffect(() => {
    // TODO: Check real auth status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/oauth/session')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [])

  // Mock data for popular courses
  const popularCourses = [
    { id: 1, name: 'สนามกอล์ฟธนบุรี', location: 'กรุงเทพฯ', price: 2500, image: '/api/placeholder/400/300' },
    { id: 2, name: 'Alpine Golf Club', location: 'ปทุมธานี', price: 3200, image: '/api/placeholder/400/300' },
    { id: 3, name: 'Siam Country Club', location: 'ชลบุรี', price: 4500, image: '/api/placeholder/400/300' },
    { id: 4, name: 'Black Mountain', location: 'หัวหิน', price: 3800, image: '/api/placeholder/400/300' },
    { id: 5, name: 'Blue Canyon', location: 'ภูเก็ต', price: 5200, image: '/api/placeholder/400/300' },
    { id: 6, name: 'Chiang Mai Highlands', location: 'เชียงใหม่', price: 2800, image: '/api/placeholder/400/300' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              จองสนามกอล์ฟ หาเพื่อนออกรอบ
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
              แพลตฟอร์มกอล์ฟอันดับ 1 ของไทย รวมสนามกว่า 300 แห่งทั่วประเทศ
            </p>
            
            {/* CTA Buttons */}
            {user ? (
              <div className="space-x-4">
                <Link
                  href="/courses"
                  className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  จองสนามกอล์ฟ
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition"
                >
                  ไปที่แดชบอร์ด
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  เข้าสู่ระบบด้วย AIVerID
                </Link>
                <Link
                  href="/courses"
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition"
                >
                  ดูสนามกอล์ฟ
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ทำไมต้อง VerGolf?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">จองง่าย จ่ายสะดวก</h3>
              <p className="text-gray-600">
                จองสนามได้ 24 ชั่วโมง ชำระผ่านบัตรเครดิต หรือ QR Payment
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">หาเพื่อนออกรอบ</h3>
              <p className="text-gray-600">
                ระบบ AI จับคู่เพื่อนที่เล่นสไตล์เดียวกัน ไม่ต้องออกรอบคนเดียว
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">สะสมแต้ม รับส่วนลด</h3>
              <p className="text-gray-600">
                ยิ่งจองมาก ยิ่งได้ส่วนลดมาก พร้อมสิทธิพิเศษสำหรับสมาชิก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">สนามยอดนิยม</h2>
            <Link href="/courses" className="text-green-600 hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{course.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ฿{course.price.toLocaleString()}
                    </span>
                    {user ? (
                      <Link
                        href={`/booking?course=${course.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        จองเลย
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        เข้าสู่ระบบเพื่อจอง
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นการเล่นกอล์ฟแบบใหม่?
          </h2>
          <p className="text-xl mb-8">
            สมัครฟรี! ใช้ AIVerID เดียว เข้าถึงทุกบริการในระบบ
          </p>
          {!user && (
            <Link
              href="/login"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              สมัครสมาชิกฟรี
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
