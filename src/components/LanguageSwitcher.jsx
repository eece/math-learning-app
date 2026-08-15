import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'tr', label: 'TR', flag: '🇹🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
]

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('mathApp_language', lng)
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2.5 py-1.5 rounded-full text-sm font-bold transition-all ${
            i18n.language === lang.code
              ? 'bg-indigo-600 text-white shadow-md scale-105'
              : 'bg-white/80 text-gray-700 hover:bg-white shadow'
          }`}
          title={lang.label}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  )
}
