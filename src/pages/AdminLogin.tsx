import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './AdminLogin.css'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
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





