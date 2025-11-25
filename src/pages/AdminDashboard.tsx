import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat } from '../config/supabase'
import Statistics from '../components/Statistics'
import './AdminDashboard.css'
import { normalizeByLanguage } from '../utils/transliteration'

function AdminDashboard() {
  const { logout, username } = useAuth()
  const { language } = useLanguage()
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTuman, setFilterTuman] = useState('')
  const [filterTashkilot, setFilterTashkilot] = useState('')

  const translations = {
    uz: {
      title: 'Admin Panel - Murojaatlar',
      logout: 'Chiqish',
      search: 'Qidirish...',
      filterTuman: 'Tuman bo\'yicha',
      filterTashkilot: 'Tashkilot bo\'yicha',
      all: 'Barchasi',
      fio: 'F.I.SH',
      telefon: 'Telefon',
      tuman: 'Tuman/Shahar',
      manzil: 'Manzil',
      mazmun: 'Murojaat mazmuni',
      tashkilot: 'Tashkilot',
      sana: 'Sana',
      actions: 'Amallar',
      delete: 'O\'chirish',
      noData: 'Murojaatlar topilmadi',
      loading: 'Yuklanmoqda...',
      confirmDelete: 'Bu murojaatni o\'chirishni xohlaysizmi?',
      deleted: 'Murojaat o\'chirildi',
      error: 'Xatolik yuz berdi'
    },
    'uz-cyrl': {
      title: 'Админ Панел - Мурожаатлар',
      logout: 'Чиқиш',
      search: 'Қидириш...',
      filterTuman: 'Туман бўйича',
      filterTashkilot: 'Ташкилот бўйича',
      all: 'Барчаси',
      fio: 'Ф.И.Ш',
      telefon: 'Телефон',
      tuman: 'Туман/Шаҳар',
      manzil: 'Манзил',
      mazmun: 'Мурожаат мазмуни',
      tashkilot: 'Ташкилот',
      sana: 'Сана',
      actions: 'Амаллар',
      delete: 'Ўчириш',
      noData: 'Мурожаатлар топилмади',
      loading: 'Юкланмоқда...',
      confirmDelete: 'Бу мурожаатни ўчиришни хоҳлайсизми?',
      deleted: 'Мурожаат ўчирилди',
      error: 'Хатолик юз берди'
    },
    ru: {
      title: 'Панель администратора - Обращения',
      logout: 'Выход',
      search: 'Поиск...',
      filterTuman: 'По району',
      filterTashkilot: 'По организации',
      all: 'Все',
      fio: 'Ф.И.О',
      telefon: 'Телефон',
      tuman: 'Район/Город',
      manzil: 'Адрес',
      mazmun: 'Содержание обращения',
      tashkilot: 'Организация',
      sana: 'Дата',
      actions: 'Действия',
      delete: 'Удалить',
      noData: 'Обращения не найдены',
      loading: 'Загрузка...',
      confirmDelete: 'Вы уверены, что хотите удалить это обращение?',
      deleted: 'Обращение удалено',
      error: 'Произошла ошибка'
    }
  }

  const t = translations[language]

  const loadMurojaatlar = useCallback(async () => {
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
  }, [t.error])

  useEffect(() => {
    loadMurojaatlar()
  }, [loadMurojaatlar])

  const handleDelete = async (id: number) => {
    if (!window.confirm(t.confirmDelete)) return

    try {
      const { error: supabaseError } = await supabase
        .from('murojaatlar')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      alert(t.deleted)
      loadMurojaatlar()
    } catch (err: any) {
      alert(err.message || t.error)
      console.error('O\'chirishda xatolik:', err)
    }
  }

  // Filtrlash va qidirish
  const filteredMurojaatlar = murojaatlar.filter(murojaat => {
    const matchesSearch = searchTerm === '' || 
      murojaat.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      murojaat.telefon.includes(searchTerm) ||
      murojaat.murojaat_mazmuni.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTuman = filterTuman === '' || murojaat.tuman_shahar === filterTuman
    const normalizedTashkilot = normalizeByLanguage(murojaat.tashkilot || '', language)
    const matchesTashkilot = filterTashkilot === '' || normalizedTashkilot === filterTashkilot

    return matchesSearch && matchesTuman && matchesTashkilot
  })

  // Tumanlar va tashkilotlar ro'yxati
  const tumanlar = Array.from(new Set(murojaatlar.map(m => m.tuman_shahar))).filter(Boolean)
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
    // Invalid date tekshiruvi
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

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>{t.title}</h1>
        <div className="admin-header-actions">
          <span className="admin-username">{username}</span>
          <button onClick={logout} className="logout-button">
            {t.logout}
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Statistika va grafiklar */}
        {!loading && murojaatlar.length > 0 && (
          <Statistics
            murojaatlar={murojaatlar}
            language={language}
            selectedTashkilot={filterTashkilot}
            onTashkilotFilter={setFilterTashkilot}
          />
        )}

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
              value={filterTuman}
              onChange={(e) => setFilterTuman(e.target.value)}
              className="filter-select"
            >
              <option value="">{t.filterTuman} - {t.all}</option>
              {tumanlar.map(tuman => (
                <option key={tuman} value={tuman}>{tuman}</option>
              ))}
            </select>
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
                    <th>{t.tuman}</th>
                    <th>{t.manzil}</th>
                    <th>{t.mazmun}</th>
                    <th>{t.tashkilot}</th>
                    <th>{t.sana}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMurojaatlar.map((murojaat) => (
                    <tr key={murojaat.id}>
                      <td>{murojaat.fio}</td>
                      <td>{murojaat.telefon}</td>
                      <td>{murojaat.tuman_shahar}</td>
                      <td>{murojaat.manzil}</td>
                      <td className="mazmun-cell">{murojaat.murojaat_mazmuni}</td>
                      <td>{murojaat.tashkilot}</td>
                      <td>{formatDate(murojaat.created_at)}</td>
                      <td>
                        <button
                          onClick={() => murojaat.id && handleDelete(murojaat.id)}
                          className="delete-button"
                        >
                          {t.delete}
                        </button>
                      </td>
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

export default AdminDashboard

