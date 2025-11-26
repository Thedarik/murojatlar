import { createClient } from '@supabase/supabase-js'

// Environment variables dan o'qish (.env.local fayldan)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aiyvldjxxixjkovgwqna.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeXZsZGp4eGl4amtvdmd3cW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NzMsImV4cCI6MjA3OTIxNDg3M30.NX4lLK-GmwsVceK48aQasWSoA1FzSLPbZiONO-tM5Co'

// Environment variable'lar topilmasa xatolik chiqarish
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL yoki Anon Key topilmadi! Iltimos, .env.local faylini tekshiring.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Murojaat {
  id?: number
  fio: string
  telefon: string
  tuman_shahar: string
  manzil: string
  murojaat_mazmuni: string
  tashkilot: string
  created_at?: string
  updated_at?: string
}

// Tuman admin uchun interface
export interface TumanAdmin {
  id?: number
  tuman: string
  username: string
  password: string
  created_at?: string
}

// Bosh admin uchun interface
export interface MainAdmin {
  id?: number
  username: string
  password: string
  created_at?: string
}

