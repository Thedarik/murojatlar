import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './AdminLogin.css'
import logImage from '../assets/log.png'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()

  const translations = {
    uz: {
      title: 'Admin Panel',
      subtitle: 'Tizimga kirish',
      username: 'Foydalanuvchi nomi',
      password: 'Parol',
      login: 'Kirish',
      error: 'Noto\'g\'ri foydalanuvchi nomi yoki parol',
      loading: 'Kirilmoqda...'
    },
    'uz-cyrl': {
      title: 'Админ Панел',
      subtitle: 'Тизимга кириш',
      username: 'Фойдаланувчи номи',
      password: 'Парол',
      login: 'Кириш',
      error: 'Ното\'ғ\'ри фойдаланувчи номи ёки парол',
      loading: 'Кирилмоқда...'
    },
    ru: {
      title: 'Панель администратора',
      subtitle: 'Вход в систему',
      username: 'Имя пользователя',
      password: 'Пароль',
      login: 'Войти',
      error: 'Неверное имя пользователя или пароль',
      loading: 'Вход...'
    }
  }

  const t = translations[language]

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        navigate('/admin/dashboard')
      } else {
        setError(t.error)
      }
    } catch (err) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <img src={logImage} alt="Logo" className="login-logo" />
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t.username}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t.loading : t.login}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin





