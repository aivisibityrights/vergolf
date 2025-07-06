'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// แยก component ที่ใช้ useSearchParams
function LoginContent() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [showMockLogin, setShowMockLogin] = useState(true)
  
  useEffect(() => {
    // Check for error messages from callback
    const error = searchParams.get('error')
    if (error) {
      switch (error) {
        case 'oauth_failed':
          setErrorMessage('การเข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง')
          break
        case 'oauth_cancelled':
          setErrorMessage('คุณยกเลิกการเข้าสู่ระบบ')
          break
        case 'no_code':
          setErrorMessage('ไม่พบรหัสยืนยันจาก AIVerID')
          break
        default:
          setErrorMessage('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
      }
    }
  }, [searchParams])
  
  // Build AIVerID OAuth URL
  const getAIVerIDLoginUrl = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_AIVERID_CLIENT_ID || 'aiv_vergolf_production_2025',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/oauth/callback`,
      response_type: 'code',
      scope: 'profile email',
      state: Math.random().toString(36).substring(7) // Random state for security
    })
    
    return `${process.env.NEXT_PUBLIC_AIVERID_AUTH_URL}?${params.toString()}`
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">VG</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">VerGolf</span>
          </Link>
        </div>
      </nav>
      
      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              ยินดีต้อนรับกลับ
            </h2>
            <p className="text-lg text-gray-600">
              เข้าสู่ระบบเพื่อจองสนามกอล์ฟ
            </p>
          </div>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}
          
          {/* Login Card */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
            <div className="space-y-6">
              
              {/* Mock Login - ใช้งานจริงตอนนี้ */}
              {showMockLogin && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🚀 Development Mode
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      เลือกประเภทผู้ใช้เพื่อทดสอบระบบ
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    
                    <Link
                      href="/api/oauth/mock?user=golfer"
                      className="flex flex-col items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <span className="text-2xl mb-1">⛳</span>
                      <span className="text-sm font-medium">นักกอล์ฟ</span>
                    </Link>
  
                    <Link
                      href="/api/oauth/mock?user=caddie"
                      className="flex flex-col items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-2xl mb-1">🏌️</span>
                      <span className="text-sm font-medium">แคดดี้</span>
                    </Link>
  
                    <Link
                      href="/api/oauth/mock?user=pro"
                      className="flex flex-col items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <span className="text-2xl mb-1">🏆</span>
                      <span className="text-sm font-medium">โปรกอล์ฟ</span>
                    </Link>
  
                    <Link
                      href="/api/oauth/mock?user=course"
                      className="flex flex-col items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <span className="text-2xl mb-1">🏌️‍♂️</span>
                      <span className="text-sm font-medium">สนามกอล์ฟ</span>
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowMockLogin(false)}
                      className="w-full text-sm text-gray-500 hover:text-gray-700"
                    >
                      ดู AIVerID Login (ยังใช้งานไม่ได้)
                    </button>
                  </div>
                </div>
              )}
              
              {/* AIVerID Login - Hidden by default */}
              {!showMockLogin && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ AIVerID Login ยังไม่พร้อมใช้งาน - รอ client registration
                    </p>
                  </div>
                  
                  <a
                    href={getAIVerIDLoginUrl()}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 text-gray-400 bg-gray-100 rounded-xl cursor-not-allowed pointer-events-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Sign in with AIVerID
                  </a>
                  
                  <button
                    onClick={() => setShowMockLogin(true)}
                    className="w-full text-sm text-blue-600 hover:text-blue-700"
                  >
                    กลับไปใช้ Mock Login
                  </button>
                </div>
              )}
              
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              การเข้าใช้งานถือว่ายอมรับ
              <Link href="/terms" className="text-blue-600 hover:text-blue-500 mx-1">ข้อกำหนด</Link>
              และ
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500 ml-1">นโยบายความเป็นส่วนตัว</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-md w-full">
            <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">กำลังโหลด...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}