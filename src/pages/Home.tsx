import MurojaatForma from '../components/MurojaatForma'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import '../App.css'

function Home() {
  const { t } = useLanguage()

  return (
    <div className="app">
      <header className="app-header">
        <LanguageSwitcher />
        <h1>{t.header.title}</h1>
        <p className="subtitle">{t.header.subtitle}</p>
      </header>
      <main className="app-main">
        <MurojaatForma />
      </main>
      <footer className="app-footer">
        <p>{t.footer.copyright}</p>
      </footer>
    </div>
  )
}

export default Home





