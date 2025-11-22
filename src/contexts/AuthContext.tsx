import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  username: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Oddiy admin login (production uchun Supabase Auth yoki boshqa xavfsiz yechim ishlatish kerak)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // Production uchun environment variable'dan o'qish kerak
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // localStorage'dan autentifikatsiya holatini olish
    return localStorage.getItem('admin_authenticated') === 'true'
  })
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('admin_username')
  })

  const login = async (username: string, password: string): Promise<boolean> => {
    // Oddiy tekshirish (production uchun Supabase Auth ishlatish kerak)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      setUsername(username)
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_username', username)
      return true
    }
    return false
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

