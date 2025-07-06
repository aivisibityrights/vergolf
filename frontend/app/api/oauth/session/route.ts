import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Get full user profile from database
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (profile) {
        return NextResponse.json({
          session: {
            userId: profile.id,
            email: profile.email,
            name: profile.name,
            userType: profile.user_type,
            firstName: profile.first_name,
            lastName: profile.last_name
          },
          type: 'authenticated'
        })
      }
    }
    
    // Check for mock session (development only)
    const mockSession = request.cookies.get('vergolf_mock_session')
    if (mockSession) {
      return NextResponse.json({
        session: JSON.parse(mockSession.value),
        type: 'mock'
      })
    }
    
    // No session found
    return NextResponse.json({
      session: null,
      type: 'none'
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({
      session: null,
      type: 'error',
      error: 'Failed to get session'
    })
  }
}

export async function DELETE() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Sign out from Supabase
    await supabase.auth.signOut()
    
    const response = NextResponse.json({ success: true })
    
    // Also clear any mock session cookies
    response.cookies.delete('vergolf_mock_session')
    response.cookies.delete('vergolf_session')
    
    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to sign out'
    }, { status: 500 })
  }
}