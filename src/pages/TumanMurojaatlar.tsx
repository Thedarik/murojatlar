import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat, DarajaType, HolatType } from '../config/supabase'
import './AdminDashboard.css'
import { normalizeByLanguage } from '../utils/transliteration'
import logImage from '../assets/log.png'

interface TumanAdminData {
  tuman: string
  username: string
  isAuthenticated: boolean
}

function TumanMurojaatlar() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [tumanAdmin, setTumanAdmin] = useState<TumanAdminData | null>(null)
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTashkilot, setFilterTashkilot] = useState('')
  const [filterHolat, setFilterHolat] = useState<string>('')
  const [selectedMurojaat, setSelectedMurojaat] = useState<Murojaat | null>(null)

  const translations = {
    uz: {
      title: 'Murojaatlar',
      logout: 'Chiqish',
      back: 'Orqaga',
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
      close: 'Yopish',
      details: 'Murojaat tafsilotlari',
      daraja: 'Daraja',
      oddiy: 'Oddiy',
      muhim: 'Muhim',
      zudlik: 'Zudlik bilan',
      setDaraja: 'Darajani belgilash',
      holat: 'Holat',
      yangi: 'Yangi',
      amalda: 'Amalda',
      tugallangan: 'Tugallangan',
      setHolat: 'Holatni belgilash',
      filterHolat: 'Holat bo\'yicha'
    },
    'uz-cyrl': {
      title: 'Мурожаатлар',
      logout: 'Чиқиш',
      back: 'Орқага',
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
      close: 'Ёпиш',
      details: 'Мурожаат тафсилотлари',
      daraja: 'Даража',
      oddiy: 'Оддий',
      muhim: 'Муҳим',
      zudlik: 'Зудлик билан',
      setDaraja: 'Даражани белгилаш',
      holat: 'Ҳолат',
      yangi: 'Янги',
      amalda: 'Амалда',
      tugallangan: 'Тугалланган',
      setHolat: 'Ҳолатни белгилаш',
      filterHolat: 'Ҳолат бўйича'
    },
    ru: {
      title: 'Обращения',
      logout: 'Выход',
      back: 'Назад',
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
      close: 'Закрыть',
      details: 'Детали обращения',
      daraja: 'Приоритет',
      oddiy: 'Обычный',
      muhim: 'Важный',
      zudlik: 'Срочно',
      setDaraja: 'Установить приоритет',
      holat: 'Статус',
      yangi: 'Новый',
      amalda: 'В работе',
      tugallangan: 'Завершено',
      setHolat: 'Установить статус',
      filterHolat: 'По статусу'
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

  const filteredMurojaatlar = murojaatlar.filter(murojaat => {
    const matchesSearch = searchTerm === '' || 
      murojaat.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      murojaat.telefon.includes(searchTerm) ||
      murojaat.murojaat_mazmuni.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTashkilot = filterTashkilot === '' || 
      (murojaat.tashkilot && murojaat.tashkilot.toLowerCase() === filterTashkilot.toLowerCase())
    const matchesHolat = filterHolat === '' || murojaat.holat === filterHolat

    return matchesSearch && matchesTashkilot && matchesHolat
  })

  // Barcha tashkilotlar ro'yxati
  const allTashkilotlar = [
    "Jizzax Suv Ta'minoti AJ",
    "Boshqarmasining ekologiyasi",
    "Qurilish va uy-joy kommunal xo'jaligi bosh boshqarmasi",
    "XET korxonasi",
    "Xudud gaz Jizzax",
    "Ijtimoiy soha",
    "Issiqlik Manbai MCHJ",
    "Ko'mir ta'minoti",
    "Boshqalar"
  ]

  // Tashkilotlar ro'yxati va ularning soni
  const tashkilotlarWithCount = useMemo(() => {
    const counts: Record<string, number> = {}
    
    // Avval barcha tashkilotlarni 0 bilan boshlash
    allTashkilotlar.forEach(t => {
      counts[t.toLowerCase()] = 0
    })
    
    // Murojaatlardan hisoblash
    murojaatlar.forEach(m => {
      if (!m.tashkilot) return
      const tashkilotLower = m.tashkilot.toLowerCase()
      
      // Har bir tashkilotni tekshirish
      allTashkilotlar.forEach(t => {
        if (t.toLowerCase() === tashkilotLower) {
          counts[t.toLowerCase()] = (counts[t.toLowerCase()] || 0) + 1
        }
      })
    })
    
    return allTashkilotlar.map(name => ({ name, count: counts[name.toLowerCase()] || 0 }))
  }, [murojaatlar])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDarajaChange = async (daraja: DarajaType) => {
    if (!selectedMurojaat?.id) return
    
    // Optimistic update - avval UI'ni yangilaymiz
    setSelectedMurojaat({ ...selectedMurojaat, daraja })
    setMurojaatlar(murojaatlar.map(m => 
      m.id === selectedMurojaat.id ? { ...m, daraja } : m
    ))
    
    // Keyin Supabase'ga yuboramiz
    supabase
      .from('murojaatlar')
      .update({ daraja })
      .eq('id', selectedMurojaat.id)
      .then(({ error }) => {
        if (error) console.error('Darajani yangilashda xatolik:', error)
      })
  }

  const handleHolatChange = async (holat: HolatType) => {
    if (!selectedMurojaat?.id) return
    
    // Optimistic update - avval UI'ni yangilaymiz
    setSelectedMurojaat({ ...selectedMurojaat, holat })
    setMurojaatlar(murojaatlar.map(m => 
      m.id === selectedMurojaat.id ? { ...m, holat } : m
    ))
    
    // Keyin Supabase'ga yuboramiz
    supabase
      .from('murojaatlar')
      .update({ holat })
      .eq('id', selectedMurojaat.id)
      .then(({ error }) => {
        if (error) console.error('Holatni yangilashda xatolik:', error)
      })
  }

  const getDarajaBadge = (daraja?: string) => {
    if (!daraja) return null
    const labels: Record<string, string> = {
      oddiy: t.oddiy,
      muhim: t.muhim,
      zudlik: t.zudlik
    }
    return <span className={`daraja-badge ${daraja}`}>{labels[daraja]}</span>
  }

  const getHolatBadge = (holat?: string) => {
    const labels: Record<string, string> = {
      yangi: t.yangi,
      amalda: t.amalda,
      tugallangan: t.tugallangan
    }
    const displayHolat = holat || 'yangi'
    return <span className={`holat-badge ${displayHolat}`}>{labels[displayHolat]}</span>
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
          <button onClick={() => navigate('/tuman/dashboard')} className="back-button">
            ← {t.back}
          </button>
          <button onClick={handleLogout} className="logout-button">
            {t.logout}
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Tashkilotlar filtrlari */}
        <div className="tashkilot-filters">
          <button
            className={`filter-button ${filterTashkilot === '' ? 'active' : ''}`}
            onClick={() => setFilterTashkilot('')}
          >
            {t.all}
            <span className="filter-count">{murojaatlar.length}</span>
          </button>
          {tashkilotlarWithCount.map(({ name, count }) => (
            <button
              key={name}
              className={`filter-button ${filterTashkilot === name ? 'active' : ''}`}
              onClick={() => setFilterTashkilot(name)}
            >
              {name}
              <span className="filter-count">{count}</span>
            </button>
          ))}
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
              value={filterHolat}
              onChange={(e) => setFilterHolat(e.target.value)}
              className="filter-select"
            >
              <option value="">{t.filterHolat} - {t.all}</option>
              <option value="yangi">{t.yangi}</option>
              <option value="amalda">{t.amalda}</option>
              <option value="tugallangan">{t.tugallangan}</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

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
                    <th>{t.daraja}</th>
                    <th>{t.holat}</th>
                    <th>{t.sana}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMurojaatlar.map((murojaat) => (
                    <tr key={murojaat.id} onClick={() => setSelectedMurojaat(murojaat)} className="clickable-row">
                      <td>{murojaat.fio}</td>
                      <td>{murojaat.telefon}</td>
                      <td>{murojaat.manzil}</td>
                      <td className="mazmun-cell">{murojaat.murojaat_mazmuni}</td>
                      <td>{murojaat.tashkilot}</td>
                      <td>{getDarajaBadge(murojaat.daraja)}</td>
                      <td>{getHolatBadge(murojaat.holat)}</td>
                      <td>{formatDate(murojaat.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Murojaat tafsilotlari modali */}
      {selectedMurojaat && (
        <div className="modal-overlay" onClick={() => setSelectedMurojaat(null)}>
          <div className="murojaat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.details}</h2>
              <button className="modal-close-btn" onClick={() => setSelectedMurojaat(null)}>×</button>
            </div>
            <div className="modal-body">
              {/* Chap tomon - Ma'lumotlar */}
              <div className="modal-left">
                <div className="detail-row">
                  <span className="detail-label">{t.fio}:</span>
                  <span className="detail-value">{selectedMurojaat.fio}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t.telefon}:</span>
                  <span className="detail-value">{selectedMurojaat.telefon}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t.tuman}:</span>
                  <span className="detail-value">{selectedMurojaat.tuman_shahar}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t.manzil}:</span>
                  <span className="detail-value">{selectedMurojaat.manzil}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t.tashkilot}:</span>
                  <span className="detail-value">{selectedMurojaat.tashkilot}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t.sana}:</span>
                  <span className="detail-value">{formatDate(selectedMurojaat.created_at)}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">{t.mazmun}:</span>
                  <p className="detail-text">{selectedMurojaat.murojaat_mazmuni}</p>
                </div>
              </div>

              {/* O'ng tomon - Daraja va Holat */}
              <div className="modal-right">
                {/* Daraja tanlash */}
                <div className="action-section">
                  <span className="action-label">{t.setDaraja}:</span>
                  <div className="action-buttons vertical">
                    <button 
                      className={`daraja-btn oddiy ${selectedMurojaat.daraja === 'oddiy' ? 'active' : ''}`}
                      onClick={() => handleDarajaChange('oddiy')}
                    >
                      {t.oddiy}
                    </button>
                    <button 
                      className={`daraja-btn muhim ${selectedMurojaat.daraja === 'muhim' ? 'active' : ''}`}
                      onClick={() => handleDarajaChange('muhim')}
                    >
                      {t.muhim}
                    </button>
                    <button 
                      className={`daraja-btn zudlik ${selectedMurojaat.daraja === 'zudlik' ? 'active' : ''}`}
                      onClick={() => handleDarajaChange('zudlik')}
                    >
                      {t.zudlik}
                    </button>
                  </div>
                </div>

                {/* Holat tanlash */}
                <div className="action-section">
                  <span className="action-label">{t.setHolat}:</span>
                  <div className="action-buttons vertical">
                    <button 
                      className={`holat-btn yangi ${(selectedMurojaat.holat || 'yangi') === 'yangi' ? 'active' : ''}`}
                      onClick={() => handleHolatChange('yangi')}
                    >
                      {t.yangi}
                    </button>
                    <button 
                      className={`holat-btn amalda ${selectedMurojaat.holat === 'amalda' ? 'active' : ''}`}
                      onClick={() => handleHolatChange('amalda')}
                    >
                      {t.amalda}
                    </button>
                    <button 
                      className={`holat-btn tugallangan ${selectedMurojaat.holat === 'tugallangan' ? 'active' : ''}`}
                      onClick={() => handleHolatChange('tugallangan')}
                    >
                      {t.tugallangan}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-btn" onClick={() => setSelectedMurojaat(null)}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TumanMurojaatlar

