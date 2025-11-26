import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../config/supabase'
import './AdminLogin.css'
import logImage from '../assets/log.png'

function TumanLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { language } = useLanguage()
  const navigate = useNavigate()

  const translations = {
    uz: {
      title: 'Tuman Admin',
      subtitle: 'Tizimga kirish',
      username: 'Login',
      password: 'Parol',
      login: 'Kirish',
      error: 'Noto\'g\'ri login yoki parol',
      loading: 'Kirilmoqda...'
    },
    'uz-cyrl': {
      title: 'Туман Админ',
      subtitle: 'Тизимга кириш',
      username: 'Логин',
      password: 'Парол',
      login: 'Кириш',
      error: 'Нотўғри логин ёки парол',
      loading: 'Кирилмоқда...'
    },
    ru: {
      title: 'Районный админ',
      subtitle: 'Вход в систему',
      username: 'Логин',
      password: 'Пароль',
      login: 'Войти',
      error: 'Неверный логин или пароль',
      loading: 'Вход...'
    }
  }

  const t = translations[language]

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: dbError } = await supabase
        .from('tuman_admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (dbError || !data) {
        setError(t.error)
      } else {
        // Tuman ma'lumotlarini localStorage ga saqlash
        localStorage.setItem('tumanAdmin', JSON.stringify({
          tuman: data.tuman,
          username: data.username,
          isAuthenticated: true
        }))
        navigate('/tuman/dashboard')
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

export default TumanLogin

