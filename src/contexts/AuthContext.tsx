import { createContext, useContext, useState, ReactNode } from 'react'
import { supabase } from '../config/supabase'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  username: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true'
  })
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('admin_username')
  })

  const login = async (inputUsername: string, inputPassword: string): Promise<boolean> => {
    try {
      // Supabase'dan admin ma'lumotlarini tekshirish
      const { data, error } = await supabase
        .from('main_admin')
        .select('*')
        .eq('username', inputUsername)
        .eq('password', inputPassword)
        .single()

      if (error || !data) {
        return false
      }

      setIsAuthenticated(true)
      setUsername(inputUsername)
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_username', inputUsername)
      return true
    } catch (err) {
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUsername(null)
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_username')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

