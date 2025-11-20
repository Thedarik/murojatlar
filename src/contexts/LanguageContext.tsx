import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, Translations, translations } from '../types/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // localStorage'dan til tanlovini olish
    const saved = localStorage.getItem('language') as Language | null
    return saved && (saved === 'uz' || saved === 'uz-cyrl' || saved === 'ru') ? saved : 'uz'
  })

  useEffect(() => {
    // Til o'zgarganda localStorage'ga saqlash
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

