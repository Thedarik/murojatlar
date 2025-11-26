import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat } from '../config/supabase'
import Statistics from '../components/Statistics'
import './AdminDashboard.css'
import logImage from '../assets/log.png'

interface TumanAdminData {
  tuman: string
  username: string
  isAuthenticated: boolean
}

function TumanDashboard() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [tumanAdmin, setTumanAdmin] = useState<TumanAdminData | null>(null)
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTashkilot, setFilterTashkilot] = useState('')

  const translations = {
    uz: {
      title: 'Tuman Admin Panel',
      logout: 'Chiqish',
      loading: 'Yuklanmoqda...',
      error: 'Xatolik yuz berdi',
      viewMurojaatlar: 'Murojaatlarni ko\'rish'
    },
    'uz-cyrl': {
      title: 'Туман Админ Панел',
      logout: 'Чиқиш',
      loading: 'Юкланмоқда...',
      error: 'Хатолик юз берди',
      viewMurojaatlar: 'Мурожаатларни кўриш'
    },
    ru: {
      title: 'Панель районного админа',
      logout: 'Выход',
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      viewMurojaatlar: 'Просмотреть обращения'
    }
  }

  const t = translations[language]

  useEffect(() => {
    const storedData = localStorage.getItem('tumanAdmin')
    if (storedData) {
      const data = JSON.parse(storedData) as TumanAdminData
      if (data.isAuthenticated) {
        setTumanAdmin(data)
      } else {
        navigate('/tuman/login')
      }
    } else {
      navigate('/tuman/login')
    }
  }, [navigate])

  const loadMurojaatlar = useCallback(async () => {
    if (!tumanAdmin?.tuman) return
    
    setLoading(true)
    try {
      const { data, error: supabaseError } = await supabase
        .from('murojaatlar')
        .select('*')
        .eq('tuman_shahar', tumanAdmin.tuman)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      setMurojaatlar(data || [])
    } catch (err: any) {
      console.error('Murojaatlarni yuklashda xatolik:', err)
    } finally {
      setLoading(false)
    }
  }, [tumanAdmin?.tuman])

  useEffect(() => {
    if (tumanAdmin) {
      loadMurojaatlar()
    }
  }, [tumanAdmin, loadMurojaatlar])

  const handleLogout = () => {
    localStorage.removeItem('tumanAdmin')
    navigate('/tuman/login')
  }

  if (!tumanAdmin) {
    return <div className="loading-message">{t.loading}</div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-info">
          <img src={logImage} alt="Logo" className="admin-header-logo" />
          <div>
            <h1>{t.title}</h1>
            <span className="tuman-badge">{tumanAdmin.tuman}</span>
          </div>
        </div>
        <div className="admin-header-actions">
          <span className="admin-username">{tumanAdmin.username}</span>
          <button onClick={handleLogout} className="logout-button">
            {t.logout}
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Murojaatlar tugmasi */}
        <div className="dashboard-actions">
          <button 
            className="view-murojaatlar-btn"
            onClick={() => navigate('/tuman/murojaatlar')}
          >
            📋 {t.viewMurojaatlar}
          </button>
        </div>

        {/* Statistika va grafiklar */}
        {!loading && murojaatlar.length > 0 && (
          <Statistics
            murojaatlar={murojaatlar}
            language={language}
            selectedTashkilot={filterTashkilot}
            onTashkilotFilter={setFilterTashkilot}
            hidePieChart={true}
          />
        )}
      </div>
    </div>
  )
}

export default TumanDashboard
