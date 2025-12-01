import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat } from '../config/supabase'
import Statistics from '../components/Statistics'
import './AdminDashboard.css'
import { normalizeByLanguage } from '../utils/transliteration'
import logImage from '../assets/log.png'

function AdminDashboard() {
  const { logout, username } = useAuth()
  const { language } = useLanguage()
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTuman, setFilterTuman] = useState('')
  const [filterTashkilot, setFilterTashkilot] = useState('')
  const [editingDateId, setEditingDateId] = useState<number | null>(null)
  const [dateValue, setDateValue] = useState('')

  const translations = {
    uz: {
      title: 'Admin Panel - Murojaatlar',
      logout: 'Chiqish',
      search: 'Qidirish...',
      filterTuman: 'Hududlar kesimida',
      filterTashkilot: 'Tashkilotlar kesimida',
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
      error: 'Xatolik yuz berdi',
      editDate: 'Sanani tahrirlash',
      saveDate: 'Saqlash',
      cancelDate: 'Bekor qilish'
    },
    'uz-cyrl': {
      title: 'Админ Панел - Мурожаатлар',
      logout: 'Чиқиш',
      search: 'Қидириш...',
      filterTuman: 'Ҳудудлар кесимида',
      filterTashkilot: 'Ташкилотлар кесимида',
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
      error: 'Хатолик юз берди',
      editDate: 'Санани таҳрирлаш',
      saveDate: 'Сақлаш',
      cancelDate: 'Бекор қилиш'
    },
    ru: {
      title: 'Панель администратора - Обращения',
      logout: 'Выход',
      search: 'Поиск...',
      filterTuman: 'По регионам',
      filterTashkilot: 'По организациям',
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
      error: 'Произошла ошибка',
      editDate: 'Редактировать дату',
      saveDate: 'Сохранить',
      cancelDate: 'Отмена'
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

  // Sanani datetime-local formatiga o'tkazish
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Datetime-local formatdan ISO formatga o'tkazish
  const parseDateFromInput = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return null
    const date = new Date(dateTimeLocal)
    if (isNaN(date.getTime())) return null
    return date.toISOString()
  }

  const handleDateEdit = (murojaat: Murojaat) => {
    setEditingDateId(murojaat.id || null)
    setDateValue(formatDateForInput(murojaat.created_at))
  }

  const handleDateSave = async (murojaatId: number) => {
    const newDate = parseDateFromInput(dateValue)
    if (!newDate) return

    const oldMurojaat = murojaatlar.find(m => m.id === murojaatId)
    if (!oldMurojaat) return

    // Optimistic update
    setMurojaatlar(murojaatlar.map(m =>
      m.id === murojaatId ? { ...m, created_at: newDate } : m
    ))
    setEditingDateId(null)

    // Supabase'ga yuborish
    try {
      const { error } = await supabase
        .from('murojaatlar')
        .update({ created_at: newDate })
        .eq('id', murojaatId)

      if (error) throw error
    } catch (err) {
      console.error('Sanani yangilashda xatolik:', err)
      // Xatolik bo'lsa, eski holatga qaytarish
      setMurojaatlar(murojaatlar.map(m =>
        m.id === murojaatId ? { ...m, created_at: oldMurojaat.created_at } : m
      ))
    }
  }

  const handleDateCancel = () => {
    setEditingDateId(null)
    setDateValue('')
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-info">
          <img src={logImage} alt="Logo" className="admin-header-logo" />
          <h1>{t.title}</h1>
        </div>
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
              <option value="">{t.filterTuman}</option>
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
              <option value="">{t.filterTashkilot}</option>
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
                      <td>
                        {editingDateId === murojaat.id ? (
                          <div className="date-edit-inline">
                            <input
                              type="datetime-local"
                              value={dateValue}
                              onChange={(e) => setDateValue(e.target.value)}
                              className="date-input-inline"
                              autoFocus
                            />
                            <div className="date-edit-actions-inline">
                              <button
                                className="save-date-btn-inline"
                                onClick={() => murojaat.id && handleDateSave(murojaat.id)}
                                title={t.saveDate}
                              >
                                ✓
                              </button>
                              <button
                                className="cancel-date-btn-inline"
                                onClick={handleDateCancel}
                                title={t.cancelDate}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="date-display-inline">
                            <span onClick={() => handleDateEdit(murojaat)} className="date-clickable" title={t.editDate}>
                              {formatDate(murojaat.created_at)}
                            </span>
                          </div>
                        )}
                      </td>
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

