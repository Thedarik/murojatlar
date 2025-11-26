import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, TumanAdmin, MainAdmin } from '../config/supabase'
import './AdminDashboard.css'
import './SuperAdminDashboard.css'
import logImage from '../assets/log.png'

function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [admins, setAdmins] = useState<TumanAdmin[]>([])
  const [mainAdmin, setMainAdmin] = useState<MainAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Yangi admin qo'shish uchun
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ tuman: '', username: '', password: '' })
  
  // Tahrirlash uchun
  const [editingAdmin, setEditingAdmin] = useState<TumanAdmin | null>(null)
  const [editingMainAdmin, setEditingMainAdmin] = useState<MainAdmin | null>(null)
  
  // Parolni ko'rsatish
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set())
  const [mainAdminPasswordVisible, setMainAdminPasswordVisible] = useState(false)
  
  // Tab
  const [activeTab, setActiveTab] = useState<'tuman' | 'main'>('tuman')

  const translations = {
    uz: {
      title: 'Super Admin Panel',
      logout: 'Chiqish',
      addAdmin: 'Yangi admin qo\'shish',
      tuman: 'Tuman',
      username: 'Login',
      password: 'Parol',
      actions: 'Amallar',
      edit: 'Tahrirlash',
      delete: 'O\'chirish',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      noData: 'Adminlar topilmadi',
      loading: 'Yuklanmoqda...',
      confirmDelete: 'Bu adminni o\'chirishni xohlaysizmi?',
      success: 'Muvaffaqiyatli bajarildi',
      error: 'Xatolik yuz berdi',
      totalAdmins: 'Jami adminlar',
      tumanAdmins: 'Tuman adminlari',
      mainAdmin: 'Bosh admin'
    },
    'uz-cyrl': {
      title: 'Супер Админ Панел',
      logout: 'Чиқиш',
      addAdmin: 'Янги админ қўшиш',
      tuman: 'Туман',
      username: 'Логин',
      password: 'Парол',
      actions: 'Амаллар',
      edit: 'Таҳрирлаш',
      delete: 'Ўчириш',
      save: 'Сақлаш',
      cancel: 'Бекор қилиш',
      noData: 'Админлар топилмади',
      loading: 'Юкланмоқда...',
      confirmDelete: 'Бу админни ўчиришни хоҳлайсизми?',
      success: 'Муваффақиятли бажарилди',
      error: 'Хатолик юз берди',
      totalAdmins: 'Жами админлар',
      tumanAdmins: 'Туман админлари',
      mainAdmin: 'Бош админ'
    },
    ru: {
      title: 'Панель Супер Админа',
      logout: 'Выход',
      addAdmin: 'Добавить админа',
      tuman: 'Район',
      username: 'Логин',
      password: 'Пароль',
      actions: 'Действия',
      edit: 'Редактировать',
      delete: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
      noData: 'Админы не найдены',
      loading: 'Загрузка...',
      confirmDelete: 'Вы уверены, что хотите удалить этого админа?',
      success: 'Успешно выполнено',
      error: 'Произошла ошибка',
      totalAdmins: 'Всего админов',
      tumanAdmins: 'Районные админы',
      mainAdmin: 'Главный админ'
    }
  }

  const t = translations[language] as any

  // Auth tekshirish
  useEffect(() => {
    const storedData = localStorage.getItem('superAdmin')
    if (!storedData) {
      navigate('/super/login')
      return
    }
    const data = JSON.parse(storedData)
    if (!data.isAuthenticated) {
      navigate('/super/login')
    }
  }, [navigate])

  const loadAdmins = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Tuman adminlarini yuklash
      const { data, error: supabaseError } = await supabase
        .from('tuman_admins')
        .select('*')
        .order('tuman', { ascending: true })

      if (supabaseError) throw supabaseError
      setAdmins(data || [])
      
      // Bosh adminni yuklash
      const { data: mainData, error: mainError } = await supabase
        .from('main_admin')
        .select('*')
        .single()
      
      if (!mainError && mainData) {
        setMainAdmin(mainData)
      }
    } catch (err: any) {
      setError(err.message || t.error)
    } finally {
      setLoading(false)
    }
  }, [t.error])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  const handleLogout = () => {
    localStorage.removeItem('superAdmin')
    navigate('/super/login')
  }

  const handleAddAdmin = async () => {
    if (!newAdmin.tuman || !newAdmin.username || !newAdmin.password) return

    try {
      const { error: supabaseError } = await supabase
        .from('tuman_admins')
        .insert([newAdmin])

      if (supabaseError) throw supabaseError
      
      setShowAddModal(false)
      setNewAdmin({ tuman: '', username: '', password: '' })
      loadAdmins()
    } catch (err: any) {
      alert(err.message || t.error)
    }
  }

  const handleUpdateAdmin = async () => {
    if (!editingAdmin || !editingAdmin.id) return

    try {
      const { error: supabaseError } = await supabase
        .from('tuman_admins')
        .update({
          tuman: editingAdmin.tuman,
          username: editingAdmin.username,
          password: editingAdmin.password
        })
        .eq('id', editingAdmin.id)

      if (supabaseError) throw supabaseError
      
      setEditingAdmin(null)
      loadAdmins()
    } catch (err: any) {
      alert(err.message || t.error)
    }
  }

  const handleDeleteAdmin = async (id: number) => {
    if (!window.confirm(t.confirmDelete)) return

    try {
      const { error: supabaseError } = await supabase
        .from('tuman_admins')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      loadAdmins()
    } catch (err: any) {
      alert(err.message || t.error)
    }
  }

  const handleUpdateMainAdmin = async () => {
    if (!editingMainAdmin || !editingMainAdmin.id) return

    try {
      const { error: supabaseError } = await supabase
        .from('main_admin')
        .update({
          username: editingMainAdmin.username,
          password: editingMainAdmin.password
        })
        .eq('id', editingMainAdmin.id)

      if (supabaseError) throw supabaseError
      
      setEditingMainAdmin(null)
      loadAdmins()
    } catch (err: any) {
      alert(err.message || t.error)
    }
  }

  return (
    <div className="admin-dashboard super-dashboard">
      <header className="admin-header super-header">
        <div className="admin-header-info">
          <img src={logImage} alt="Logo" className="admin-header-logo" />
          <div>
            <h1>{t.title}</h1>
            <span className="super-badge">Super Admin</span>
          </div>
        </div>
        <div className="admin-header-actions">
          <button onClick={handleLogout} className="logout-button">
            {t.logout}
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'tuman' ? 'active' : ''}`}
            onClick={() => setActiveTab('tuman')}
          >
            {t.tumanAdmins} ({admins.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            {t.mainAdmin}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-message">{t.loading}</div>
        ) : activeTab === 'main' ? (
          /* Bosh admin */
          <div className="main-admin-section">
            {mainAdmin ? (
              <div className="admin-card main-admin-card">
                {editingMainAdmin ? (
                  <div className="admin-card-edit">
                    <input
                      type="text"
                      value={editingMainAdmin.username}
                      onChange={(e) => setEditingMainAdmin({ ...editingMainAdmin, username: e.target.value })}
                      placeholder={t.username}
                    />
                    <input
                      type="text"
                      value={editingMainAdmin.password}
                      onChange={(e) => setEditingMainAdmin({ ...editingMainAdmin, password: e.target.value })}
                      placeholder={t.password}
                    />
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleUpdateMainAdmin}>{t.save}</button>
                      <button className="cancel-btn" onClick={() => setEditingMainAdmin(null)}>{t.cancel}</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="admin-card-header">
                      <span className="admin-avatar main-avatar">A</span>
                      <h3>{t.mainAdmin}</h3>
                    </div>
                    <div className="admin-card-body">
                      <p><strong>{t.username}:</strong> {mainAdmin.username}</p>
                      <p className="password-row">
                        <strong>{t.password}:</strong> 
                        <span className="password-value">
                          {mainAdminPasswordVisible ? mainAdmin.password : '•'.repeat(mainAdmin.password.length)}
                        </span>
                        <button 
                          className="toggle-password-btn"
                          onClick={() => setMainAdminPasswordVisible(!mainAdminPasswordVisible)}
                        >
                          {mainAdminPasswordVisible ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </p>
                    </div>
                    <div className="admin-card-actions">
                      <button className="edit-btn" onClick={() => setEditingMainAdmin(mainAdmin)}>
                        {t.edit}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="no-data">Bosh admin topilmadi</div>
            )}
          </div>
        ) : (
          /* Tuman adminlari */
          <>
            <div className="actions-bar">
              <button className="add-admin-btn" onClick={() => setShowAddModal(true)}>
                + {t.addAdmin}
              </button>
            </div>
            <div className="admins-grid">
            {admins.length === 0 ? (
              <div className="no-data">{t.noData}</div>
            ) : (
              admins.map((admin) => (
                <div key={admin.id} className="admin-card">
                  {editingAdmin?.id === admin.id ? (
                    // Tahrirlash rejimi
                    <div className="admin-card-edit">
                      <input
                        type="text"
                        value={editingAdmin.tuman}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, tuman: e.target.value })}
                        placeholder={t.tuman}
                      />
                      <input
                        type="text"
                        value={editingAdmin.username}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, username: e.target.value })}
                        placeholder={t.username}
                      />
                      <input
                        type="text"
                        value={editingAdmin.password}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                        placeholder={t.password}
                      />
                      <div className="edit-actions">
                        <button className="save-btn" onClick={handleUpdateAdmin}>{t.save}</button>
                        <button className="cancel-btn" onClick={() => setEditingAdmin(null)}>{t.cancel}</button>
                      </div>
                    </div>
                  ) : (
                    // Ko'rish rejimi
                    <>
                      <div className="admin-card-header">
                        <span className="admin-avatar">{admin.tuman.charAt(0)}</span>
                        <h3>{admin.tuman}</h3>
                      </div>
                      <div className="admin-card-body">
                        <p><strong>{t.username}:</strong> {admin.username}</p>
                        <p className="password-row">
                          <strong>{t.password}:</strong> 
                          <span className="password-value">
                            {visiblePasswords.has(admin.id!) ? admin.password : '•'.repeat(admin.password.length)}
                          </span>
                          <button 
                            className="toggle-password-btn"
                            onClick={() => {
                              const newSet = new Set(visiblePasswords)
                              if (newSet.has(admin.id!)) {
                                newSet.delete(admin.id!)
                              } else {
                                newSet.add(admin.id!)
                              }
                              setVisiblePasswords(newSet)
                            }}
                          >
                            {visiblePasswords.has(admin.id!) ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            )}
                          </button>
                        </p>
                      </div>
                      <div className="admin-card-actions">
                        <button className="edit-btn" onClick={() => setEditingAdmin(admin)}>
                          {t.edit}
                        </button>
                        <button className="delete-btn" onClick={() => admin.id && handleDeleteAdmin(admin.id)}>
                          {t.delete}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          </>
        )}
      </div>

      {/* Yangi admin qo'shish modali */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t.addAdmin}</h2>
            <div className="modal-form">
              <input
                type="text"
                value={newAdmin.tuman}
                onChange={(e) => setNewAdmin({ ...newAdmin, tuman: e.target.value })}
                placeholder={t.tuman}
              />
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                placeholder={t.username}
              />
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                placeholder={t.password}
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddAdmin}>{t.save}</button>
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>{t.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperAdminDashboard

