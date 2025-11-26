import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat } from '../config/supabase'
import './AdminDashboard.css'
import { normalizeByLanguage } from '../utils/transliteration'
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
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTashkilot, setFilterTashkilot] = useState('')

  const translations = {
    uz: {
      title: 'Tuman Admin Panel',
      logout: 'Chiqish',
      search: 'Qidirish...',
      filterTashkilot: 'Tashkilot bo\'yicha',
      all: 'Barchasi',
      fio: 'F.I.SH',
      telefon: 'Telefon',
      tuman: 'Tuman/Shahar',
      manzil: 'Manzil',
      mazmun: 'Murojaat mazmuni',
      tashkilot: 'Tashkilot',
      sana: 'Sana',
      noData: 'Murojaatlar topilmadi',
      loading: 'Yuklanmoqda...',
      error: 'Xatolik yuz berdi',
      totalAppeals: 'Jami murojaatlar'
    },
    'uz-cyrl': {
      title: 'Туман Админ Панел',
      logout: 'Чиқиш',
      search: 'Қидириш...',
      filterTashkilot: 'Ташкилот бўйича',
      all: 'Барчаси',
      fio: 'Ф.И.Ш',
      telefon: 'Телефон',
      tuman: 'Туман/Шаҳар',
      manzil: 'Манзил',
      mazmun: 'Мурожаат мазмуни',
      tashkilot: 'Ташкилот',
      sana: 'Сана',
      noData: 'Мурожаатлар топилмади',
      loading: 'Юкланмоқда...',
      error: 'Хатолик юз берди',
      totalAppeals: 'Жами мурожаатлар'
    },
    ru: {
      title: 'Панель районного админа',
      logout: 'Выход',
      search: 'Поиск...',
      filterTashkilot: 'По организации',
      all: 'Все',
      fio: 'Ф.И.О',
      telefon: 'Телефон',
      tuman: 'Район/Город',
      manzil: 'Адрес',
      mazmun: 'Содержание обращения',
      tashkilot: 'Организация',
      sana: 'Дата',
      noData: 'Обращения не найдены',
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      totalAppeals: 'Всего обращений'
    }
  }

  const t = translations[language]

  // Tuman admin ma'lumotlarini tekshirish
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
    setError(null)
    try {
      const { data, error: supabaseError } = await supabase
        .from('murojaatlar')
        .select('*')
        .eq('tuman_shahar', tumanAdmin.tuman)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      setMurojaatlar(data || [])
    } catch (err: any) {
      setError(err.message || t.error)
      console.error('Murojaatlarni yuklashda xatolik:', err)
    } finally {
      setLoading(false)
    }
  }, [tumanAdmin?.tuman, t.error])

  useEffect(() => {
    if (tumanAdmin) {
      loadMurojaatlar()
    }
  }, [tumanAdmin, loadMurojaatlar])

  const handleLogout = () => {
    localStorage.removeItem('tumanAdmin')
    navigate('/tuman/login')
  }

  // Filtrlash va qidirish
  const filteredMurojaatlar = murojaatlar.filter(murojaat => {
    const matchesSearch = searchTerm === '' || 
      murojaat.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      murojaat.telefon.includes(searchTerm) ||
      murojaat.murojaat_mazmuni.toLowerCase().includes(searchTerm.toLowerCase())
    
    const normalizedTashkilot = normalizeByLanguage(murojaat.tashkilot || '', language)
    const matchesTashkilot = filterTashkilot === '' || normalizedTashkilot === filterTashkilot

    return matchesSearch && matchesTashkilot
  })

  // Tashkilotlar ro'yxati
  const tashkilotlar = useMemo(() => {
    const unique = new Set<string>()
    murojaatlar.forEach(m => {
      if (!m.tashkilot) return
      const normalized = normalizeByLanguage(m.tashkilot, language)
      if (normalized) {
        unique.add(normalized)
      }
    })
    return Array.from(unique)
  }, [murojaatlar, language])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '-'
    }
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        {/* Statistika */}
        <div className="tuman-stats">
          <div className="tuman-stat-card">
            <span className="stat-label">{t.totalAppeals}</span>
            <span className="stat-value">{murojaatlar.length}</span>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filterTashkilot}
              onChange={(e) => setFilterTashkilot(e.target.value)}
              className="filter-select"
            >
              <option value="">{t.filterTashkilot} - {t.all}</option>
              {tashkilotlar.map(tashkilot => (
                <option key={tashkilot} value={tashkilot}>{tashkilot}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-message">{t.loading}</div>
        ) : (
          <div className="murojaatlar-table-container">
            {filteredMurojaatlar.length === 0 ? (
              <div className="no-data">{t.noData}</div>
            ) : (
              <table className="murojaatlar-table">
                <thead>
                  <tr>
                    <th>{t.fio}</th>
                    <th>{t.telefon}</th>
                    <th>{t.manzil}</th>
                    <th>{t.mazmun}</th>
                    <th>{t.tashkilot}</th>
                    <th>{t.sana}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMurojaatlar.map((murojaat) => (
                    <tr key={murojaat.id}>
                      <td>{murojaat.fio}</td>
                      <td>{murojaat.telefon}</td>
                      <td>{murojaat.manzil}</td>
                      <td className="mazmun-cell">{murojaat.murojaat_mazmuni}</td>
                      <td>{murojaat.tashkilot}</td>
                      <td>{formatDate(murojaat.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TumanDashboard

