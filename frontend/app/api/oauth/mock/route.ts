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
        client_id: process.env.NEXT_PUBLIC_AIVERID_CLIENT_ID, // Fixed: Added NEXT_PUBLIC_
        client_secret: process.env.AIVERID_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/oauth/callback`
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
    
    // 3. Check if user already exists in our database
    const { data: existingUser, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('aiverid', aiverIdUser.aiverid)
      .maybeSingle()
    
    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }
    
    if (existingUser) {
      // Existing user - create session cookie
      const response = NextResponse.json({ 
        user: existingUser,
        isNewUser: false,
        redirectUrl: `/dashboard/${existingUser.user_type}`
      })
      
      // Set session cookie
      response.cookies.set('vergolf_session', JSON.stringify({
        userId: existingUser.id,
        email: existingUser.email,
        userType: existingUser.user_type,
        name: existingUser.name
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      return response
    } else {
      // New user - prepare for onboarding
      return NextResponse.json({ 
        isNewUser: true,
        aiverIdData: {
          aiverid: aiverIdUser.aiverid,
          email: aiverIdUser.email,
          name: aiverIdUser.name || '',
          verified: aiverIdUser.verified || false
        }
      })
    }
    
  } catch (error) {
    console.error('AIVerID OAuth error:', error)
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
    clientId: process.env.NEXT_PUBLIC_AIVERID_CLIENT_ID,
    authUrl: process.env.NEXT_PUBLIC_AIVERID_AUTH_URL
  })
}