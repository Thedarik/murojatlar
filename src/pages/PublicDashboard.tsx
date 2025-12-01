import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat } from '../config/supabase'
import Statistics from '../components/Statistics'
import './PublicDashboard.css'
import { normalizeByLanguage } from '../utils/transliteration'
import logImage from '../assets/log.png'

function PublicDashboard() {
  const { language } = useLanguage()
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterTashkilot, setFilterTashkilot] = useState('')

  const translations = {
    uz: {
      title: 'Admin Panel - Murojaatlar',
      loading: 'Yuklanmoqda...',
      error: 'Xatolik yuz berdi'
    },
    'uz-cyrl': {
      title: 'Админ Панел - Мурожаатлар',
      loading: 'Юкланмоқда...',
      error: 'Хатолик юз берди'
    },
    ru: {
      title: 'Панель администратора - Обращения',
      loading: 'Загрузка...',
      error: 'Произошла ошибка'
    }
  }

  const t = translations[language]

  const loadMurojaatlar = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supabaseError } = await supabase
        .from('murojaatlar')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      setMurojaatlar(data || [])
    } catch (err: any) {
      setError(err.message || t.error)
      console.error('Murojaatlarni yuklashda xatolik:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMurojaatlar()
  }, [])

  // Filtrlash - faqat tashkilot bo'yicha
  const filteredMurojaatlar = useMemo(() => {
    if (!filterTashkilot) return murojaatlar
    
    return murojaatlar.filter(murojaat => {
      const normalizedTashkilot = normalizeByLanguage(murojaat.tashkilot || '', language)
      return normalizedTashkilot === filterTashkilot
    })
  }, [murojaatlar, filterTashkilot, language])

  return (
    <div className="public-dashboard">
      <header className="public-header">
        <div className="public-header-info">
          <img src={logImage} alt="Logo" className="public-header-logo" />
          <h1>{t.title}</h1>
        </div>
      </header>

      <div className="public-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-message">{t.loading}</div>
        ) : (
          <Statistics
            murojaatlar={filteredMurojaatlar}
            language={language}
            selectedTashkilot={filterTashkilot}
            onTashkilotFilter={setFilterTashkilot}
          />
        )}
      </div>
    </div>
  )
}

export default PublicDashboard

