import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Welcome({ onLogin }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length >= 2) {
      onLogin(name.trim())
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md animate-bounce-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            {t('app.title')}
          </h1>
          <p className="text-lg text-purple-600 font-medium">
            {t('app.subtitle')}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {t('welcome.title')}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {t('welcome.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('welcome.placeholder')}
              className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-lg font-medium text-center text-gray-800 placeholder:text-gray-400 transition"
              autoFocus
              maxLength={20}
            />
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {t('welcome.start')} 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
