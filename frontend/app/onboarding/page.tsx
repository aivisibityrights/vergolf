'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type UserType = 'golfer' | 'caddie' | 'pro' | 'course'

interface UserProfile {
  first_name: string
  last_name: string
  phone: string
  user_type: UserType
  // Golfer specific
  handicap?: number
  play_frequency?: string
  preferred_days?: string[]
  // Caddie specific
  experience_years?: number
  languages?: string[]
  rate_per_round?: number
  // Pro specific
  certification?: string
  teaching_experience?: number
  specialties?: string[]
  // Course specific
  course_name?: string
  holes?: number
  location?: string
  facilities?: string[]
}

interface AIVerIDData {
  aiverid?: string
  name?: string
  email?: string
  verified?: boolean
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    phone: '',
    user_type: 'golfer'
  })
  const [aiveridData, setAiveridData] = useState<AIVerIDData | null>(null)

  const checkUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Check if user already completed onboarding
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (existingProfile?.user_type) {
        // Already onboarded, redirect to dashboard
        router.push(`/dashboard/${existingProfile.user_type}`)
        return
      }

      // Get AIVerID data from user metadata
      const metadata = user.user_metadata
      setAiveridData(metadata)
      
      // Parse name from AIVerID if available
      if (metadata?.name) {
        const nameParts = metadata.name.split(' ')
        setProfile(prev => ({
          ...prev,
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
        }))
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      setLoading(false)
    }
  }, [supabase, router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setProfile(prev => ({ ...prev, user_type: type }))
    setStep(2)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      // Save profile to database
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: `${profile.first_name} ${profile.last_name}`, // รวม first + last เก็บใน name
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          user_type: profile.user_type,
          aiverid: aiveridData?.aiverid || null, // ใช้ aiverid ไม่ใช่ aiverid_id
          // Golfer fields
          handicap: profile.handicap,
          play_frequency: profile.play_frequency,
          // Caddie fields
          experience_years: profile.experience_years,
          rate_per_round: profile.rate_per_round,
          // Pro fields
          certification: profile.certification,
          teaching_experience: profile.teaching_experience,
          // Course fields
          course_name: profile.course_name,
          holes: profile.holes,
          location: profile.location,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // Redirect to appropriate dashboard
      router.push(`/dashboard/${profile.user_type}`)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ยินดีต้อนรับสู่ VerGolf! 🏌️‍♂️
          </h1>
          <p className="text-gray-400">
            {aiveridData?.name && `สวัสดีคุณ ${aiveridData.name}, `}
            กรุณาเลือกประเภทบัญชีของคุณ
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-green-500' : 'bg-gray-600'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Select User Type */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              คุณต้องการใช้ VerGolf ในฐานะอะไร?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Golfer */}
              <button
                onClick={() => handleUserTypeSelect('golfer')}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">⛳</div>
                <h3 className="text-xl font-bold text-white mb-2">นักกอล์ฟ</h3>
                <p className="text-gray-400 text-sm">
                  จองสนาม, หาเพื่อนตี, จองแคดดี้, บันทึกสกอร์
                </p>
              </button>

              {/* Caddie */}
              <button
                onClick={() => handleUserTypeSelect('caddie')}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🏌️‍♀️</div>
                <h3 className="text-xl font-bold text-white mb-2">แคดดี้</h3>
                <p className="text-gray-400 text-sm">
                  รับงาน, จัดการตารางเวลา, สร้างรายได้เพิ่ม
                </p>
              </button>

              {/* Pro */}
              <button
                onClick={() => handleUserTypeSelect('pro')}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">โปรกอล์ฟ</h3>
                <p className="text-gray-400 text-sm">
                  สอนกอล์ฟ, จัดการนักเรียน, ขายคอร์สเรียน
                </p>
              </button>

              {/* Golf Course */}
              <button
                onClick={() => handleUserTypeSelect('course')}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🏌️</div>
                <h3 className="text-xl font-bold text-white mb-2">สนามกอล์ฟ</h3>
                <p className="text-gray-400 text-sm">
                  จัดการ Tee Time, โปรโมชั่น, รายงานผล
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Complete Profile */}
        {step === 2 && userType && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              กรอกข้อมูลเพิ่มเติม
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Common Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    placeholder="ชื่อ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    placeholder="นามสกุล"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                  placeholder="08x-xxx-xxxx"
                />
              </div>

              {/* Golfer Specific Fields */}
              {userType === 'golfer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Handicap (ถ้ามี)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="36"
                      value={profile.handicap || ''}
                      onChange={(e) => setProfile({...profile, handicap: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="0-36"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ความถี่ในการเล่น
                    </label>
                    <select
                      value={profile.play_frequency || ''}
                      onChange={(e) => setProfile({...profile, play_frequency: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    >
                      <option value="">เลือกความถี่</option>
                      <option value="weekly">ทุกสัปดาห์</option>
                      <option value="biweekly">2 สัปดาห์ครั้ง</option>
                      <option value="monthly">เดือนละครั้ง</option>
                      <option value="occasional">นานๆ ครั้ง</option>
                    </select>
                  </div>
                </>
              )}

              {/* Caddie Specific Fields */}
              {userType === 'caddie' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ประสบการณ์ (ปี)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={profile.experience_years || ''}
                      onChange={(e) => setProfile({...profile, experience_years: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="จำนวนปีที่เป็นแคดดี้"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ค่าแคดดี้ต่อรอบ (บาท)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={profile.rate_per_round || ''}
                      onChange={(e) => setProfile({...profile, rate_per_round: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="เช่น 500"
                    />
                  </div>
                </>
              )}

              {/* Pro Specific Fields */}
              {userType === 'pro' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ใบรับรอง/ใบประกอบวิชาชีพ
                    </label>
                    <input
                      type="text"
                      value={profile.certification || ''}
                      onChange={(e) => setProfile({...profile, certification: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="เช่น PGA Professional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ประสบการณ์การสอน (ปี)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={profile.teaching_experience || ''}
                      onChange={(e) => setProfile({...profile, teaching_experience: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="จำนวนปีที่สอนกอล์ฟ"
                    />
                  </div>
                </>
              )}

              {/* Course Specific Fields */}
              {userType === 'course' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ชื่อสนามกอล์ฟ
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.course_name || ''}
                      onChange={(e) => setProfile({...profile, course_name: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="ชื่อสนามกอล์ฟ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      จำนวนหลุม
                    </label>
                    <select
                      value={profile.holes || ''}
                      onChange={(e) => setProfile({...profile, holes: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    >
                      <option value="">เลือกจำนวนหลุม</option>
                      <option value="9">9 หลุม</option>
                      <option value="18">18 หลุม</option>
                      <option value="27">27 หลุม</option>
                      <option value="36">36 หลุม</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ที่ตั้ง
                    </label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="เช่น กรุงเทพมหานคร"
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'กำลังบันทึก...' : 'เริ่มใช้งาน VerGolf'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}