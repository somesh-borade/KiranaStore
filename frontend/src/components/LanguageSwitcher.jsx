import './LanguageSwitcher.css'
import { useLanguage } from '../context/LanguageContext.jsx'

function LanguageSwitcher() {
  const { language, setLanguage, languages, t } = useLanguage()

  return (
    <label className="language-switcher">
      <span>{t('language')}</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        {languages.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSwitcher
