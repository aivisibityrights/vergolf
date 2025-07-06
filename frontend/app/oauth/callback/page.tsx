'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithAIVerID } from '@/lib/supabase'

// แยก component ที่ใช้ useSearchParams ออกมา
function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get code or error from URL params
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          setStatus('error')
          setErrorMessage('การเข้าสู่ระบบถูกยกเลิก')
          setTimeout(() => router.push('/login?error=oauth_cancelled'), 2000)
          return
        }

        if (!code) {
          setStatus('error')
          setErrorMessage('ไม่พบรหัสยืนยัน')
          setTimeout(() => router.push('/login?error=no_code'), 2000)
          return
        }

        // Exchange code for user data
        const result = await signInWithAIVerID(code)

        if (result.isNewUser) {
          // New user - save data and go to onboarding
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('aiverIdData', JSON.stringify(result.aiverIdData))
          }
          router.push('/onboarding')
        } else {
          // Existing user - go to their dashboard
          const userType = result.user.user_type || result.user.account_type || 'golfer'
          router.push(`/dashboard/${userType}`)
        }
      } catch (error) {
        console.error('Sign in error:', error)
        setStatus('error')
        setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
        setTimeout(() => router.push('/login?error=oauth_failed'), 2000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center">
          {status === 'loading' ? (
            <>
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                กำลังเข้าสู่ระบบ
              </h2>
              <p className="text-gray-600">
                กำลังยืนยันตัวตนกับ AIVerID...
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                เกิดข้อผิดพลาด
              </h2>
              <p className="text-gray-600">
                {errorMessage}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                กำลังกลับไปหน้า Login...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function AuthCallback() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="text-center">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-transparent mx-auto"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                กำลังโหลด...
              </h2>
              <p className="text-gray-600">
                รอสักครู่...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}