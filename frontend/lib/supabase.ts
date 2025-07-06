import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (ตรงกับ structure ใหม่)
export type AccountType = 'golfer' | 'caddy' | 'pro' | 'course_owner'

export interface User {
  id: string
  aiverid: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  account_type: AccountType
  phone?: string
  avatar_url?: string
  stripe_customer_id?: string
  is_verified: boolean
  is_active: boolean
  location?: {
    lat: number
    lng: number
    address?: string
  }
  created_at: string
  updated_at: string
}

export interface GolferProfile {
  id: string
  user_id: string
  handicap?: number
  preferred_tee?: 'black' | 'blue' | 'white' | 'red'
  play_style?: 'casual' | 'competitive' | 'practice'
  experience_years?: number
  average_score?: number
  equipment_brand?: string
  home_course?: string
  preferred_courses?: string[]
  bio?: string
  stats?: {
    rounds_played?: number
    eagles?: number
    birdies?: number
  }
}

export interface CaddyProfile {
  id: string
  user_id: string
  experience_years?: number
  languages?: string[]
  rating?: number
  total_reviews?: number
  hourly_rate?: number
  daily_rate?: number
  home_course?: string
  specialties?: string[]
  availability?: Record<string, boolean>
  bio?: string
  certification?: string
}

export interface GolfCourse {
  id: string
  name: string
  slug: string
  description?: string
  address?: string
  province?: string
  region?: 'north' | 'northeast' | 'central' | 'east' | 'west' | 'south'
  location?: {
    lat: number
    lng: number
  }
  holes?: number
  par?: number
  slope_rating?: number
  course_rating?: number
  price_weekday?: number
  price_weekend?: number
  price_twilight?: number
  facilities?: Record<string, boolean>
  images?: string[]
  contact_phone?: string
  contact_email?: string
  website?: string
  operating_hours?: {
    open: string
    close: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  booking_code: string
  golfer_id: string
  course_id: string
  booking_date: string
  tee_time: string
  holes: 9 | 18
  players: number
  cart_required: boolean
  caddy_id?: string
  total_price?: number
  payment_method?: string
  payment_status: string
  stripe_payment_intent_id?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  created_at: string
  updated_at: string
}

// Auth helper functions
export const signInWithAIVerID = async (code: string) => {
  const response = await fetch('/api/oauth/aiverid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to authenticate')
  }
  
  return response.json()
}

export const getCurrentUser = async (): Promise<User | null> => {
  const sessionResponse = await fetch('/api/oauth/session')
  if (!sessionResponse.ok) return null
  
  const sessionData = await sessionResponse.json()
  if (!sessionData.session) return null
  
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', sessionData.session.email)
    .single()
    
  if (error || !profile) return null
  
  return profile as User
}

export const signOut = async () => {
  await fetch('/api/oauth/session', { method: 'DELETE' })
}

// User profile functions
export const getUserProfile = async (userId: string, accountType: AccountType) => {
  const table = `${accountType.replace('_owner', '')}_profiles`
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as User
}

// Golf course functions
export const getGolfCourses = async (filters?: {
  province?: string
  region?: string
  search?: string
}) => {
  let query = supabase
    .from('golf_courses')
    .select('*')
    .eq('is_active', true)
  
  if (filters?.province) {
    query = query.eq('province', filters.province)
  }
  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  
  const { data, error } = await query.order('name')
  
  if (error) throw error
  return data as GolfCourse[]
}

export const getGolfCourseBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('golf_courses')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data as GolfCourse
}

// Booking functions
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'booking_code' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()
  
  if (error) throw error
  return data as Booking
}

export const getUserBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      golf_courses (
        name,
        slug,
        address,
        province
      ),
      caddy:users!bookings_caddy_id_fkey (
        first_name,
        last_name,
        phone
      )
    `)
    .or(`golfer_id.eq.${userId},caddy_id.eq.${userId}`)
    .order('booking_date', { ascending: false })
  
  if (error) throw error
  return data
}

// Buddy matching functions
export const createBuddyRequest = async (requestData: {
  requester_id: string
  course_id: string
  play_date: string
  tee_time: string
  players_needed: number
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'any'
  preferred_age_range?: string
  preferred_play_style?: 'casual' | 'competitive' | 'practice'
  notes?: string
  is_active?: boolean
}) => {
  const { data, error } = await supabase
    .from('buddy_requests')
    .insert(requestData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getActiveBuddyRequests = async (filters?: {
  course_id?: string
  play_date?: string
  skill_level?: string
}) => {
  let query = supabase
    .from('buddy_requests')
    .select(`
      *,
      requester:users!buddy_requests_requester_id_fkey (
        first_name,
        last_name,
        display_name
      ),
      course:golf_courses!buddy_requests_course_id_fkey (
        name,
        slug
      )
    `)
    .eq('is_active', true)
  
  if (filters?.course_id) {
    query = query.eq('course_id', filters.course_id)
  }
  if (filters?.play_date) {
    query = query.eq('play_date', filters.play_date)
  }
  if (filters?.skill_level && filters.skill_level !== 'any') {
    query = query.eq('skill_level', filters.skill_level)
  }
  
  const { data, error } = await query.order('play_date')
  
  if (error) throw error
  return data
}

// Review functions
export const createReview = async (reviewData: {
  reviewer_id: string
  reviewee_id?: string
  course_id?: string
  booking_id: string
  rating: number
  comment?: string
}) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getCourseReviews = async (courseId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:users!reviews_reviewer_id_fkey (
        first_name,
        last_name,
        display_name
      )
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}