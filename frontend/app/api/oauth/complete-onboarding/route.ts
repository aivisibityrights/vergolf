import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const profileData = await request.json()
    
    // Get session info from cookies or headers
    const mockSession = request.cookies.get('vergolf_mock_session')
    const aiverIdData = request.headers.get('x-aiverid-data')
    
    if (!mockSession && !aiverIdData) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }
    
    let userId: string
    let aiverId: string | null = null
    
    if (mockSession) {
      // Mock user flow
      const mockData = JSON.parse(mockSession.value)
      
      // Create user in Supabase
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: profileData.email,
        email_confirm: true,
        user_metadata: {
          name: profileData.name,
          user_type: profileData.user_type
        }
      })
      
      if (authError) {
        console.error('Auth creation error:', authError)
        throw new Error('Failed to create auth user')
      }
      
      userId = authUser.user.id
      aiverId = mockData.aiverid
    } else {
      // Real AIVerID flow (future implementation)
      const aiverData = JSON.parse(aiverIdData!)
      
      // Create user in Supabase with AIVerID
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: profileData.email,
        email_confirm: true,
        user_metadata: {
          name: profileData.name,
          user_type: profileData.user_type,
          aiverid: aiverData.aiverid
        }
      })
      
      if (authError) throw new Error('Failed to create auth user')
      
      userId = authUser.user.id
      aiverId = aiverData.aiverid
    }
    
    // Create user profile in users table
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        aiverid: aiverId,
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone,
        user_type: profileData.user_type,
        // Type-specific fields
        handicap: profileData.handicap,
        experience_years: profileData.experience_years,
        languages: profileData.languages,
        hourly_rate: profileData.hourly_rate,
        certification: profileData.certification,
        specialties: profileData.specialties,
        lesson_rate: profileData.lesson_rate,
        // Default values
        is_verified: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Try to clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw new Error('Failed to create user profile')
    }
    
    // Create session cookie
    const response = NextResponse.json({ 
      success: true,
      user: userProfile,
      redirectUrl: `/dashboard/${profileData.user_type}`
    })
    
    // Set session cookie
    response.cookies.set('vergolf_session', JSON.stringify({
      userId: userProfile.id,
      email: userProfile.email,
      userType: userProfile.user_type,
      name: userProfile.name
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    // Clear mock session if exists
    if (mockSession) {
      response.cookies.delete('vergolf_mock_session')
    }
    
    return response
    
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}