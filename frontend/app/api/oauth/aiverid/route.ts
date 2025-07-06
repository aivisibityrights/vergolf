import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase Admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    if (!process.env.AIVERID_CLIENT_SECRET) {
      console.error('Missing AIVERID_CLIENT_SECRET')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }
    
    // 1. Exchange authorization code for access token with AIVerID
    const tokenResponse = await fetch(process.env.NEXT_PUBLIC_AIVERID_TOKEN_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.NEXT_PUBLIC_AIVERID_CLIENT_ID, // ✅ แก้ไขแล้ว
        client_secret: process.env.AIVERID_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/oauth/callback` // ✅ แก้ไขแล้ว
      })
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error('Token exchange failed:', errorData)
      return NextResponse.json(
        { error: 'Failed to exchange code for token', details: errorData },
        { status: 400 }
      )
    }
    
    const tokenData = await tokenResponse.json()
    
    // Validate token data
    if (!tokenData.access_token) {
      console.error('No access token received')
      return NextResponse.json(
        { error: 'Invalid token response' },
        { status: 400 }
      )
    }
    
    // 2. Get user information from AIVerID
    const userResponse = await fetch(process.env.NEXT_PUBLIC_AIVERID_USERINFO_URL!, {
      headers: { 
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })
    
    if (!userResponse.ok) {
      console.error('Failed to fetch user info')
      return NextResponse.json(
        { error: 'Failed to get user information' },
        { status: 400 }
      )
    }
    
    const aiverIdUser = await userResponse.json()
    console.log('AIVerID user data:', aiverIdUser)
    
    // Validate user data
    if (!aiverIdUser.aiverid || !aiverIdUser.email) {
      console.error('Invalid user data:', aiverIdUser)
      return NextResponse.json(
        { error: 'Invalid user information' },
        { status: 400 }
      )
    }
    
    // 3. Check if user already exists in our database
    const { data: existingUser, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('aiverid', aiverIdUser.aiverid)
      .maybeSingle() // Use maybeSingle instead of single to handle no results gracefully
    
    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }
    
    if (existingUser) {
      // Existing user - create session
      const sessionData = {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          aiverid: existingUser.aiverid,
          account_type: existingUser.account_type // ✅ แก้จาก user_type เป็น account_type
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
      
      // Store session
      const response = NextResponse.json({ 
        user: existingUser,
        isNewUser: false,
        redirectTo: `/dashboard/${existingUser.account_type}` // ✅ แก้จาก user_type
      })
      
      // Set secure cookie
      response.cookies.set('vergolf-session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 // 24 hours
      })
      
      return response
    } else {
      // New user - prepare for onboarding
      // Store AIVerID data temporarily for the onboarding process
      const tempSession = {
        aiverIdData: {
          aiverid: aiverIdUser.aiverid,
          email: aiverIdUser.email,
          name: aiverIdUser.name || '',
          verified: aiverIdUser.verified || false
        },
        expires: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      }
      
      const response = NextResponse.json({ 
        isNewUser: true,
        aiverIdData: tempSession.aiverIdData
      })
      
      // Set temporary session cookie
      response.cookies.set('vergolf-temp-session', JSON.stringify(tempSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1800 // 30 minutes
      })
      
      return response
    }
    
  } catch (error) {
    console.error('AIVerID OAuth error:', error)
    
    // Better error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error - please check your connection' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Authentication failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'AIVerID OAuth endpoint is running',
    timestamp: new Date().toISOString(),
    configured: {
      hasClientId: !!process.env.NEXT_PUBLIC_AIVERID_CLIENT_ID,
      hasClientSecret: !!process.env.AIVERID_CLIENT_SECRET,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  })
}