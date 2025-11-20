import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-switcher">
      <button
        type="button"
        className={`lang-button ${language === 'uz' ? 'active' : ''}`}
        onClick={() => setLanguage('uz')}
        aria-label="O'zbek tili (Lotin)"
      >
        O'Z
      </button>
      <button
        type="button"
        className={`lang-button ${language === 'uz-cyrl' ? 'active' : ''}`}
        onClick={() => setLanguage('uz-cyrl')}
        aria-label="O'zbek tili (Kiril)"
      >
        ЎЗ
      </button>
      <button
        type="button"
        className={`lang-button ${language === 'ru' ? 'active' : ''}`}
        onClick={() => setLanguage('ru')}
        aria-label="Русский язык"
      >
        РУ
      </button>
    </div>
  )
}

export default LanguageSwitcher

