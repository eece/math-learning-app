import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const modules = [
  {
    id: 'multiplication',
    icon: '✖️',
    color: 'from-pink-400 to-rose-500',
    available: true,
  },
  {
    id: 'addition',
    icon: '➕',
    color: 'from-green-400 to-emerald-500',
    available: true,
  },
  {
    id: 'subtraction',
    icon: '➖',
    color: 'from-blue-400 to-cyan-500',
    available: false,
  },
  {
    id: 'division',
    icon: '➗',
    color: 'from-amber-400 to-orange-500',
    available: false,
  },
  {
    id: 'fourOps',
    icon: '🔢',
    color: 'from-violet-400 to-purple-500',
    available: false,
  },
]

export default function Home({ user, onSelectModule, onLogout, getModuleProgress }) {
  const { t } = useTranslation()
  const totalStars = user?.progress?.multiplication?.totalStars || 0
  const additionProg = getModuleProgress ? getModuleProgress('addition') : { level: 1, points: 0 }

  return (
    <div className="min-h-screen p-4 pb-12">
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
            {t('home.greeting', { name: user.name })}
          </h1>
          <p className="text-purple-600 font-medium flex items-center gap-3 mt-1 flex-wrap">
            <span>⭐ {t('home.stars', { count: totalStars })}</span>
            <span className="text-emerald-600">➕ Lv.{additionProg.level} · {additionProg.points} pts</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {t('home.logout')}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
          {t('home.chooseModule')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const prog = getModuleProgress ? getModuleProgress(mod.id) : null
            return (
              <button
                key={mod.id}
                onClick={() => mod.available && onSelectModule(mod.id)}
                disabled={!mod.available}
                className={`relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 ${
                  mod.available
                    ? 'hover:scale-[1.03] hover:shadow-2xl cursor-pointer shadow-lg'
                    : 'opacity-70 cursor-not-allowed'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${mod.color} ${
                    !mod.available ? 'grayscale' : ''
                  }`}
                />
                <div className="relative z-10 text-white">
                  <div className="text-5xl mb-3">{mod.icon}</div>
                  <h3 className="text-xl font-bold mb-1">
                    {t(`home.${mod.id}`)}
                  </h3>
                  {mod.available && prog && (
                    <p className="text-sm opacity-90 mt-1">
                      {t('levels.level')} {prog.level} · {prog.points} {t('levels.points').toLowerCase()}
                    </p>
                  )}
                  {!mod.available && (
                    <span className="inline-block mt-2 px-3 py-1 bg-black/20 rounded-full text-sm font-semibold">
                      {t('home.comingSoon')}
                    </span>
                  )}
                  {mod.available && (
                    <span className="inline-block mt-2 text-sm font-medium opacity-90">
                      →
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
