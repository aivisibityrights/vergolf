# VerGolf Development Patterns
*Standard patterns for consistent development*

## 🎯 Conditional Rendering Pattern

### Philosophy
- Single page, multiple states
- Progressive enhancement
- SEO friendly

### Implementation

#### 1. Basic Conditional Content
```typescript
// ✅ Logged in users see booking button
{user && (
  <button 
    onClick={handleBooking}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    จองสนาม
  </button>
)}

// ✅ Guests see login prompt
{!user && (
  <div className="bg-blue-50 p-4 rounded-lg">
    <p className="text-gray-700 mb-2">เข้าสู่ระบบเพื่อจองสนาม</p>
    <Link href="/login" className="text-blue-600 hover:underline">
      Sign in with AIVerID →
    </Link>
  </div>
)}
```

#### 2. Role-based Content
```typescript
// Create reusable component
function RoleOnly({ 
  roles, 
  children 
}: { 
  roles: AccountType[], 
  children: React.ReactNode 
}) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.account_type)) return null
  return <>{children}</>
}

// Usage
<RoleOnly roles={['golfer', 'pro']}>
  <AdvancedStats />
</RoleOnly>

// Inline approach
{user?.account_type === 'course_owner' && (
  <AdminPanel />
)}
```

#### 3. Progressive Disclosure
```typescript
export default function CoursePage({ course }: { course: GolfCourse }) {
  const { user } = useAuth()
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Everyone sees basic info */}
      <h1 className="text-3xl font-bold">{course.name}</h1>
      <p className="text-gray-600">{course.province}</p>
      <p className="text-2xl mt-4">
        Weekday: ฿{course.price_weekday?.toLocaleString()}
      </p>
      
      {/* Members see extra features */}
      {user && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Member Benefits</h3>
          <p>• Priority booking</p>
          <p>• 10% discount</p>
          <BookingCalendar courseId={course.id} />
        </div>
      )}
      
      {/* Guests see call-to-action */}
      {!user && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="mb-3">🏌️ Join VerGolf to book this course!</p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Sign in with AIVerID
          </Link>
        </div>
      )}
    </div>
  )
}
```

## 🔐 Authentication Flow Pattern

### 1. Auth Context Setup
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, type User } from '@/lib/supabase'

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  checkUser: () => Promise<void>
}>({
  user: null,
  loading: true,
  checkUser: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    checkUser()
    
    // Re-check on focus
    const handleFocus = () => checkUser()
    window.addEventListener('focus', handleFocus)
    
    return () => window.removeEventListener('focus', handleFocus)
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, loading, checkUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 2. Protected Route Component
```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { AccountType } from '@/lib/supabase'

export function ProtectedRoute({
  children,
  roles,
  redirectTo = '/login'
}: {
  children: React.ReactNode
  roles?: AccountType[]
  redirectTo?: string
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
    
    if (!loading && user && roles && !roles.includes(user.account_type)) {
      router.push('/dashboard')
    }
  }, [user, loading, roles, router, redirectTo])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    )
  }
  
  if (!user || (roles && !roles.includes(user.account_type))) {
    return null
  }
  
  return <>{children}</>
}
```

### 3. Require Auth Hook
```typescript
// hooks/useRequireAuth.ts
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useRequireAuth() {
  const { user } = useAuth()
  const router = useRouter()
  
  const requireAuth = (action: string): boolean => {
    if (!user) {
      toast.error(`กรุณาเข้าสู่ระบบเพื่อ${action}`)
      router.push('/login')
      return false
    }
    return true
  }
  
  return { requireAuth }
}
```

## 📱 Responsive Design Pattern

### Mobile First Approach
```typescript
// Start with mobile, enhance for larger screens
export function CourseCard({ course }: { course: GolfCourse }) {
  return (
    <div className="
      w-full                    // Mobile: full width
      md:w-1/2                  // Tablet: half width
      lg:w-1/3                  // Desktop: third width
      p-2                       // Mobile: small padding
      md:p-3                    // Tablet: medium padding
      lg:p-4                    // Desktop: large padding
    ">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={course.images?.[0] || '/placeholder.jpg'}
          alt={course.name}
          className="
            w-full h-40           // Mobile: shorter
            md:h-48               // Tablet: medium
            lg:h-56               // Desktop: taller
            object-cover
          "
        />
        <div className="p-4">
          <h3 className="
            text-lg               // Mobile: smaller
            md:text-xl            // Tablet: medium
            lg:text-2xl           // Desktop: larger
            font-semibold
          ">
            {course.name}
          </h3>
        </div>
      </div>
    </div>
  )
}
```

### Responsive Grid Layout
```typescript
export function CoursesGrid({ courses }: { courses: GolfCourse[] }) {
  return (
    <div className="
      grid 
      grid-cols-1               // Mobile: 1 column
      sm:grid-cols-2            // Small tablets: 2 columns
      md:grid-cols-3            // Tablets: 3 columns
      lg:grid-cols-4            // Desktop: 4 columns
      gap-4                     // Consistent gap
      p-4
    ">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

## 🎨 UI State Patterns

### Loading States
```typescript
export function CoursesList() {
  const [courses, setCourses] = useState<GolfCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchCourses()
  }, [])
  
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const data = await getGolfCourses()
      setCourses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchCourses}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    )
  }
  
  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No courses found</p>
      </div>
    )
  }
  
  return <CoursesGrid courses={courses} />
}
```

### Optimistic Updates
```typescript
export function BookingForm({ course }: { course: GolfCourse }) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (formData: BookingData) => {
    setSubmitting(true)
    
    // Optimistic: Show success immediately
    toast.success('กำลังจองสนาม...')
    
    try {
      const booking = await createBooking({
        ...formData,
        course_id: course.id,
        status: 'pending'
      })
      
      // Real success
      toast.success('จองสนามสำเร็จ!')
      router.push(`/booking/${booking.booking_code}`)
      
    } catch (error) {
      // Rollback on error
      toast.error('จองสนามไม่สำเร็จ กรุณาลองใหม่')
      console.error('Booking error:', error)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={submitting}
        className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        {submitting ? 'กำลังดำเนินการ...' : 'ยืนยันการจอง'}
      </button>
    </form>
  )
}
```

## 📁 File Organization

### Folder Structure
```
app/
├── (public)/              # No auth required
│   ├── page.tsx          # Homepage
│   ├── courses/
│   │   ├── page.tsx      # Courses list
│   │   └── [slug]/
│   │       └── page.tsx  # Course detail
│   └── about/
│       └── page.tsx
│
├── (auth)/               # Auth flow
│   ├── login/
│   └── oauth/callback/
│
├── (member)/             # Requires login
│   ├── dashboard/
│   │   ├── golfer/
│   │   ├── caddy/
│   │   └── course/
│   ├── booking/
│   └── profile/
│
└── api/                  # API routes
    ├── oauth/
    ├── courses/
    └── bookings/

components/
├── ui/                   # Basic components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── features/            # Feature components
│   ├── booking/
│   ├── courses/
│   └── users/
└── layouts/            # Layout components
    ├── Header.tsx
    └── Footer.tsx
```

### Import Order Convention
```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 2. External packages
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'

// 3. Internal - contexts/hooks
import { useAuth } from '@/contexts/AuthContext'
import { useRequireAuth } from '@/hooks/useRequireAuth'

// 4. Internal - components
import { Button } from '@/components/ui/Button'
import { CourseCard } from '@/components/features/courses/CourseCard'

// 5. Internal - lib/utils
import { getGolfCourses, createBooking } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

// 6. Types
import type { GolfCourse, Booking } from '@/lib/supabase'

// 7. Styles (if any)
import styles from './styles.module.css'
```

## 🧪 Testing Patterns

### Component Testing Example
```typescript
// __tests__/CourseCard.test.tsx
import { render, screen } from '@testing-library/react'
import { CourseCard } from '@/components/features/courses/CourseCard'
import { mockCourse } from '@/test/mocks'

describe('CourseCard', () => {
  it('displays course information', () => {
    render(<CourseCard course={mockCourse} />)
    
    expect(screen.getByText(mockCourse.name)).toBeInTheDocument()
    expect(screen.getByText(`฿${mockCourse.price_weekday}`)).toBeInTheDocument()
    expect(screen.getByText(mockCourse.province)).toBeInTheDocument()
  })
  
  it('shows login prompt for guests', () => {
    render(<CourseCard course={mockCourse} user={null} />)
    
    expect(screen.getByText(/เข้าสู่ระบบ/)).toBeInTheDocument()
  })
  
  it('shows booking button for logged in users', () => {
    const mockUser = { id: '1', account_type: 'golfer' }
    render(<CourseCard course={mockCourse} user={mockUser} />)
    
    expect(screen.getByText(/จองสนาม/)).toBeInTheDocument()
  })
})
```

### API Route Testing
```typescript
// __tests__/api/bookings.test.ts
import { POST } from '@/app/api/bookings/route'
import { createMockRequest } from '@/test/utils'

describe('POST /api/bookings', () => {
  it('requires authentication', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: { course_id: '123' }
    })
    
    const response = await POST(request)
    expect(response.status).toBe(401)
  })
  
  it('validates required fields', async () => {
    const request = createMockRequest({
      method: 'POST',
      body: {}, // Missing required fields
      session: { user: { id: '1' } }
    })
    
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

## 🔧 Common Patterns

### Error Boundary
```typescript
// components/ErrorBoundary.tsx
'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Try again
      </button>
    </div>
  )
}
```

### Data Fetching with SWR
```typescript
// hooks/useCourses.ts
import useSWR from 'swr'
import { getGolfCourses } from '@/lib/supabase'

export function useCourses(filters?: CourseFilters) {
  const key = filters 
    ? ['courses', filters.province, filters.region, filters.search]
    : 'courses'
    
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getGolfCourses(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )
  
  return {
    courses: data || [],
    isLoading,
    error,
    refresh: mutate
  }
}
```

---
*Consistency is key! Follow these patterns for maintainable code.*