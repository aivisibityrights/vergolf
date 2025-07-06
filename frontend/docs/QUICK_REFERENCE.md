# VerGolf Quick Reference
*Keep this open while coding! 🚀*

## 🚀 Common Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Check code quality
npm run type-check            # Check TypeScript

# Database
npx supabase login            # Login to Supabase
npx supabase link             # Link to project
npx supabase db push          # Push migrations
npx supabase db reset         # Reset database

# Git
git add .                     # Stage changes
git commit -m "feat: ..."     # Commit with message
git push                      # Push to GitHub

# Deployment
vercel                        # Deploy to Vercel
vercel --prod                 # Deploy to production
```

## 📁 Where to Put Things

```
vergolf/frontend/
├── app/                      # Next.js App Router
│   ├── (public)/            # No auth needed
│   │   ├── page.tsx         # Homepage
│   │   ├── courses/         # Golf courses
│   │   └── about/           # About pages
│   │
│   ├── (auth)/              # Auth flow
│   │   ├── login/           # Login page
│   │   └── oauth/callback/  # OAuth callback
│   │
│   ├── (member)/            # Login required
│   │   ├── dashboard/       # User dashboards
│   │   ├── booking/         # Booking flow
│   │   └── profile/         # User profile
│   │
│   ├── api/                 # API routes
│   │   ├── oauth/           # OAuth endpoints
│   │   ├── courses/         # Course CRUD
│   │   └── bookings/        # Booking CRUD
│   │
│   └── layout.tsx           # Root layout
│
├── components/              # React components
│   ├── ui/                  # Basic UI (Button, Card)
│   ├── features/            # Feature components
│   └── layouts/             # Layout components
│
├── lib/                     # Utilities
│   ├── supabase.ts         # DB client & types
│   ├── utils.ts            # Helper functions
│   └── constants.ts        # App constants
│
├── public/                  # Static files
├── docs/                    # Documentation
└── .env.local              # Environment vars
```

## 🔑 Authentication Patterns

### Check if User is Logged In
```typescript
// In components
import { useAuth } from '@/contexts/AuthContext'

export function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <Spinner />
  if (!user) return <LoginPrompt />
  
  return <div>Welcome {user.email}!</div>
}
```

### Protect a Page
```typescript
// In page component
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute roles={['golfer', 'pro']}>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

### Require Auth for Action
```typescript
import { useRequireAuth } from '@/hooks/useRequireAuth'

export function BookingButton() {
  const { requireAuth } = useRequireAuth()
  
  const handleBook = () => {
    if (!requireAuth('จองสนาม')) return
    
    // Proceed with booking
    router.push('/booking')
  }
  
  return <button onClick={handleBook}>จองสนาม</button>
}
```

## 🌐 API Patterns

### GET Request
```typescript
// Fetch courses
const courses = await fetch('/api/courses').then(r => r.json())

// With query params
const filtered = await fetch('/api/courses?province=bangkok').then(r => r.json())
```

### POST Request
```typescript
// Create booking
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    course_id: '123',
    booking_date: '2025-07-10',
    tee_time: '07:00',
    players: 4
  })
})

if (!response.ok) {
  const error = await response.json()
  throw new Error(error.message)
}

const booking = await response.json()
```

### Using Supabase Client
```typescript
import { supabase } from '@/lib/supabase'

// Read data
const { data, error } = await supabase
  .from('golf_courses')
  .select('*')
  .eq('province', 'bangkok')
  .order('name')

// Insert data
const { data, error } = await supabase
  .from('bookings')
  .insert({
    golfer_id: user.id,
    course_id: courseId,
    booking_date: date
  })
  .select()
  .single()

// Update data
const { error } = await supabase
  .from('users')
  .update({ phone: '+66812345678' })
  .eq('id', userId)

// Delete data
const { error } = await supabase
  .from('bookings')
  .delete()
  .eq('id', bookingId)
```

## 🎨 Common UI Components

### Button
```typescript
<button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
  Click me
</button>

// Disabled state
<button 
  disabled={loading}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

### Card
```typescript
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-xl font-semibold mb-2">{title}</h3>
  <p className="text-gray-600">{description}</p>
</div>
```

### Form Input
```typescript
<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium mb-2">
    Email
  </label>
  <input
    type="email"
    id="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    required
  />
</div>
```

### Loading Spinner
```typescript
<div className="flex items-center justify-center p-4">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
</div>
```

## 🌏 Thai Labels

```typescript
const labels = {
  // Navigation
  home: 'หน้าแรก',
  courses: 'สนามกอล์ฟ',
  booking: 'จองสนาม',
  dashboard: 'แดชบอร์ด',
  profile: 'โปรไฟล์',
  
  // Auth
  login: 'เข้าสู่ระบบ',
  logout: 'ออกจากระบบ',
  register: 'สมัครสมาชิก',
  
  // Roles
  golfer: 'นักกอล์ฟ',
  caddie: 'แคดดี้',
  pro: 'โปรกอล์ฟ',
  course_owner: 'เจ้าของสนาม',
  
  // Actions
  search: 'ค้นหา',
  filter: 'กรอง',
  save: 'บันทึก',
  cancel: 'ยกเลิก',
  confirm: 'ยืนยัน',
  
  // Status
  pending: 'รอดำเนินการ',
  confirmed: 'ยืนยันแล้ว',
  cancelled: 'ยกเลิกแล้ว',
  completed: 'เสร็จสิ้น'
}
```

## 🐛 Debugging

### Check Auth State
```typescript
// In browser console
const { user, loading } = useAuth()
console.log('User:', user)
console.log('Loading:', loading)

// Check session
const session = await supabase.auth.getSession()
console.log('Session:', session)
```

### Check API Response
```typescript
// Add to API route
console.log('Request body:', await request.json())
console.log('Headers:', request.headers)

// In component
const response = await fetch('/api/test')
console.log('Status:', response.status)
console.log('Headers:', response.headers)
console.log('Body:', await response.json())
```

### Check Environment Variables
```typescript
// Never log secrets!
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL)
console.log('Has secret key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
```

## 🚨 Common Errors & Fixes

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### "Hydration mismatch"
```typescript
// Use useEffect for client-only code
useEffect(() => {
  // Client-only code here
  setMounted(true)
}, [])

if (!mounted) return null
```

### "TypeError: Cannot read property of undefined"
```typescript
// Use optional chaining
const name = user?.profile?.name || 'Guest'

// Check before mapping
{courses?.length > 0 && courses.map(course => ...)}
```

### "CORS error"
```typescript
// In API route, add headers
return NextResponse.json(data, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }
})
```

### Database Connection Error
```bash
# Check Supabase status
https://status.supabase.com

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
npx supabase db remote status
```

## 📱 Mobile Testing

```bash
# 1. Find your local IP
# Mac: 
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig

# 2. Access from mobile (same network)
http://[YOUR_IP]:3000

# 3. Enable mobile debugging
# iPhone: Settings > Safari > Advanced > Web Inspector
# Android: Chrome > chrome://inspect
```

## 🚀 Deployment Checklist

```bash
# Before deploying
- [ ] Run build locally: npm run build
- [ ] Check TypeScript: npm run type-check
- [ ] Test all pages
- [ ] Update .env in Vercel
- [ ] Check console for errors

# Deploy
vercel --prod

# After deploying
- [ ] Test production URL
- [ ] Check API endpoints
- [ ] Test auth flow
- [ ] Monitor logs in Vercel
```

## 💡 VS Code Snippets

### React Component
```json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "export default function ${1:ComponentName}() {",
      "  return (",
      "    <div>",
      "      ${2:Content}",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

### API Route
```json
{
  "API Route": {
    "prefix": "api",
    "body": [
      "import { NextRequest, NextResponse } from 'next/server'",
      "",
      "export async function ${1:GET}(request: NextRequest) {",
      "  try {",
      "    ${2:// Logic here}",
      "    return NextResponse.json({ success: true })",
      "  } catch (error) {",
      "    console.error('${1} error:', error)",
      "    return NextResponse.json(",
      "      { error: 'Internal server error' },",
      "      { status: 500 }",
      "    )",
      "  }",
      "}"
    ]
  }
}
```

---
*Happy coding! Remember: When in doubt, check the docs or ask สมนึก! 🤖*