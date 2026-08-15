import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function MultIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 mb-3">
      <circle cx="40" cy="40" r="36" fill="#EC4899" opacity="0.2"/>
      <path d="M25 25 L55 55 M55 25 L25 55" stroke="#EC4899" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="5" fill="#F472B6"/>
      <circle cx="60" cy="20" r="5" fill="#F472B6"/>
      <circle cx="20" cy="60" r="5" fill="#F472B6"/>
      <circle cx="60" cy="60" r="5" fill="#F472B6"/>
    </svg>
  )
}

function AddIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 mb-3">
      <circle cx="40" cy="40" r="36" fill="#10B981" opacity="0.2"/>
      <rect x="20" y="34" width="40" height="12" rx="6" fill="#10B981"/>
      <rect x="34" y="20" width="12" height="40" rx="6" fill="#10B981"/>
      <circle cx="40" cy="12" r="4" fill="#34D399"/>
      <circle cx="40" cy="68" r="4" fill="#34D399"/>
    </svg>
  )
}

function SubIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 mb-3">
      <circle cx="40" cy="40" r="36" fill="#3B82F6" opacity="0.2"/>
      <rect x="18" y="34" width="44" height="12" rx="6" fill="#3B82F6"/>
      <circle cx="24" cy="22" r="5" fill="#60A5FA"/>
      <circle cx="56" cy="22" r="5" fill="#60A5FA"/>
      <circle cx="24" cy="58" r="5" fill="#60A5FA"/>
      <circle cx="56" cy="58" r="5" fill="#60A5FA"/>
    </svg>
  )
}

function DivIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 mb-3">
      <circle cx="40" cy="40" r="36" fill="#F59E0B" opacity="0.2"/>
      <circle cx="40" cy="22" r="7" fill="#F59E0B"/>
      <rect x="22" y="34" width="36" height="12" rx="6" fill="#F59E0B"/>
      <circle cx="40" cy="58" r="7" fill="#F59E0B"/>
    </svg>
  )
}

function FourOpsIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 mb-3">
      <circle cx="40" cy="40" r="36" fill="#8B5CF6" opacity="0.2"/>
      <text x="40" y="50" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#8B5CF6">123</text>
    </svg>
  )
}

const modules = [
  { id: 'multiplication', Icon: MultIcon, color: 'from-pink-400 to-rose-500', available: true },
  { id: 'addition', Icon: AddIcon, color: 'from-emerald-400 to-green-500', available: true },
  { id: 'subtraction', Icon: SubIcon, color: 'from-blue-400 to-cyan-500', available: true },
  { id: 'division', Icon: DivIcon, color: 'from-amber-400 to-orange-500', available: true },
  { id: 'fourOps', Icon: FourOpsIcon, color: 'from-violet-400 to-purple-500', available: false },
]

export default function Home({ user, onSelectModule, onLogout, getModuleProgress }) {
  const { t } = useTranslation()
  const totalStars = user?.progress?.multiplication?.totalStars || 0
  const additionProg = getModuleProgress ? getModuleProgress('addition') : { level: 1, points: 0 }
  const subtractionProg = getModuleProgress ? getModuleProgress('subtraction') : { level: 1, points: 0 }
  const divisionProg = getModuleProgress ? getModuleProgress('division') : { level: 1, points: 0 }

  return (
    <div className="min-h-screen p-4 pb-12 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-5 w-32 h-32 bg-emerald-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-amber-200/40 rounded-full blur-3xl" />

      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 drop-shadow-sm">
            {t('home.greeting', { name: user.name })} 👋
          </h1>
          <div className="flex flex-wrap gap-3 mt-2 text-sm font-medium">
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full">⭐ {totalStars}</span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">➕ Lv.{additionProg.level}</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">➖ Lv.{subtractionProg.level}</span>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">➗ Lv.{divisionProg.level}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 underline">
            {t('home.logout')}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
          {t('home.chooseModule')} 🎮
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const prog = getModuleProgress ? getModuleProgress(mod.id) : null
            const Icon = mod.Icon
            return (
              <button
                key={mod.id}
                onClick={() => mod.available && onSelectModule(mod.id)}
                disabled={!mod.available}
                className={`relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 ${
                  mod.available
                    ? 'hover:scale-[1.04] hover:shadow-2xl cursor-pointer shadow-lg active:scale-95'
                    : 'opacity-70 cursor-not-allowed'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} ${!mod.available ? 'grayscale' : ''}`} />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
                
                <div className="relative z-10 text-white flex flex-col items-start">
                  <Icon />
                  <h3 className="text-xl font-bold mb-1">{t(`home.${mod.id}`)}</h3>
                  {mod.available && prog && (
                    <p className="text-sm opacity-90 mt-1 bg-black/15 px-2 py-0.5 rounded-full">
                      {t('levels.level')} {prog.level} · {prog.points} {t('levels.points').toLowerCase()}
                    </p>
                  )}
                  {!mod.available && (
                    <span className="inline-block mt-2 px-3 py-1 bg-black/20 rounded-full text-sm font-semibold">
                      {t('home.comingSoon')} 🚀
                    </span>
                  )}
                  {mod.available && (
                    <span className="mt-3 text-sm font-medium opacity-90">{t('common.start')}</span>
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
