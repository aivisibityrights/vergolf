# VerGolf Security Guidelines
*Version 1.0 - July 2025*

## 🔒 Core Security Principles

### 1. Never Trust the Frontend
- Frontend = UI Display Only
- All security checks MUST be on backend
- User can modify any frontend code

### 2. Authentication vs Authorization
- **Authentication**: Who are you? (AIVerID)
- **Authorization**: What can you do? (Role-based)

### 3. Defense in Depth
```
Frontend (Level 1) → API (Level 2) → Database (Level 3)
   ↓                    ↓                ↓
UI Check           Auth Check        RLS Policies
```

## 🛡️ Implementation Checklist

### For Every Feature:
- [ ] Frontend shows/hides UI based on role
- [ ] API endpoint checks authentication
- [ ] API endpoint checks authorization (role)
- [ ] Input validation on frontend
- [ ] Input validation on backend (strict)
- [ ] Database RLS policy created
- [ ] Rate limiting implemented
- [ ] Error messages don't leak info

## 📝 Code Templates

### API Route Template:
```typescript
// app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  // 1. Environment check
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  // 2. Auth check
  const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/session`)
  if (!sessionResponse.ok) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const { session } = await sessionResponse.json()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // 3. Get user and check role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', session.email)
    .single()
    
  if (!user || user.account_type !== 'allowed_role') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
  
  // 4. Validate input
  const body = await request.json()
  if (!body.requiredField) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    )
  }
  
  // 5. Business logic
  try {
    // Your logic here
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### RLS Policy Template:
```sql
-- Enable RLS on table
ALTER TABLE golf_courses ENABLE ROW LEVEL SECURITY;

-- Read own data
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (id = auth.uid());

-- Update own data
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Golfer can read all courses
CREATE POLICY "courses_read_all" ON golf_courses
  FOR SELECT TO authenticated
  USING (true);

-- Course owner can update own courses
CREATE POLICY "courses_update_own" ON golf_courses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM course_managers 
      WHERE course_managers.course_id = golf_courses.id
      AND course_managers.user_id = auth.uid()
    )
  );
```

## ⚠️ Common Security Mistakes

### 1. ❌ Exposing Secrets
```javascript
// WRONG - Visible in browser!
const API_KEY = "sk_live_123";

// RIGHT - Server only
const API_KEY = process.env.STRIPE_SECRET_KEY;
```

### 2. ❌ Frontend-only validation
```javascript
// WRONG
if (user.isAdmin) {
  deleteEverything(); // Anyone can call this!
}

// RIGHT
// Frontend - just UI
if (user.account_type === 'course_owner') {
  return <AdminPanel />
}

// Backend - real check
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()

if (user?.account_type !== 'course_owner') {
  return forbidden()
}
```

### 3. ❌ Leaking information
```javascript
// WRONG
return { error: "User john@example.com not found" };

// RIGHT
return { error: "Invalid credentials" };
```

## 🚨 Security Incident Response

1. **If breach suspected**:
   ```bash
   # 1. Rotate keys immediately
   - Supabase: Generate new service role key
   - Stripe: Roll secret key
   - AIVerID: Request new client secret
   
   # 2. Check logs
   - Supabase: Dashboard → Logs
   - Vercel: Function logs
   - GitHub: Security tab
   
   # 3. Notify
   - Email: security@vergolf.com
   - Team lead immediately
   ```

2. **Regular audits**:
   - Daily: Check error logs
   - Weekly: Review new code
   - Monthly: Audit RLS policies
   - Quarterly: Penetration testing

## 🔑 Environment Variables

### Required in Production:
```bash
# ❌ NEVER commit these!
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
AIVERID_CLIENT_SECRET=y65d5e998...
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...

# ✅ Safe to commit (public keys)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_AIVERID_CLIENT_ID=aiv_vergolf_production_2025
```

### Vercel Environment Setup:
1. Go to: https://vercel.com/[your-team]/vergolf/settings/environment-variables
2. Add each variable with proper scope:
   ```
   Production ✓ | Preview ✓ | Development ✓
   ```
3. For secrets: Production only
4. Redeploy after adding

## 🛡️ AIVerID OAuth Security

### Session Management:
```typescript
// Store minimal data in session
req.session = {
  aiverid: user.aiverid,
  email: user.email,
  account_type: user.account_type,
  expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
}

// Never store sensitive data
// ❌ password, payment_methods, personal_info
```

### Token Validation:
```typescript
// Always verify tokens server-side
const userInfo = await fetch(AIVERID_USERINFO_URL, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
})

if (!userInfo.ok) {
  throw new Error('Invalid token')
}
```

## 📊 Security Monitoring

### What to log:
- ✅ Failed login attempts
- ✅ Permission denied events
- ✅ Unusual patterns (e.g., 100 bookings/minute)
- ❌ Passwords or tokens
- ❌ Personal information

### Alert on:
- 5+ failed logins from same IP
- Unauthorized API access attempts
- Database query errors
- Payment failures

---
*Security is everyone's responsibility. When in doubt, ask!*