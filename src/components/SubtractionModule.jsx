import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function playApplause() {
  try {
    const audio = new Audio('https://bigsoundbank.com/UPLOAD/mp3/2363.mp3')
    audio.volume = 0.55
    audio.play().catch(() => {})
  } catch (e) {}
}

const LEVEL_CONFIG = {
  1: { max: 10, descKey: 'levelDesc1' },
  2: { max: 20, descKey: 'levelDesc2' },
  3: { max: 50, descKey: 'levelDesc3' },
  4: { max: 100, descKey: 'levelDesc4' },
  5: { max: 200, descKey: 'levelDesc5' },
}

function generateQuestion(level) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1]
  const max = cfg.max
  let a = Math.floor(Math.random() * max) + 1
  let b = Math.floor(Math.random() * a) + 1
  return { a, b, answer: a - b }
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-2" fill="none">
      <circle cx="32" cy="32" r="30" fill="#3B82F6" opacity="0.15"/>
      <rect x="16" y="28" width="32" height="8" rx="4" fill="#3B82F6"/>
      <circle cx="20" cy="18" r="4" fill="#60A5FA"/>
      <circle cx="44" cy="18" r="4" fill="#60A5FA"/>
      <circle cx="20" cy="46" r="4" fill="#60A5FA"/>
      <circle cx="44" cy="46" r="4" fill="#60A5FA"/>
    </svg>
  )
}

export default function SubtractionModule({
  user,
  onBack,
  addPoints,
  getModuleProgress,
  getPointsToNextLevel,
}) {
  const { t } = useTranslation()
  const [view, setView] = useState('select')
  const [practiceLevel, setPracticeLevel] = useState(1)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [sessionPoints, setSessionPoints] = useState(0)
  const [leveledUpInfo, setLeveledUpInfo] = useState(null)

  const prog = getModuleProgress('subtraction')
  const pointsToNext = getPointsToNextLevel('subtraction')
  const maxUnlockedLevel = Math.min(prog.level || 1, 5)

  const startLearn = (lvl) => {
    setPracticeLevel(lvl)
    setView('learn')
  }

  const startPractice = (lvl) => {
    setPracticeLevel(lvl)
    const qs = Array.from({ length: 10 }, () => generateQuestion(lvl))
    setQuestions(qs)
    setCurrentIdx(0)
    setScore(0)
    setSessionPoints(0)
    setUserAnswer('')
    setFeedback(null)
    setAnswered(false)
    setLeveledUpInfo(null)
    setView('practice')
  }

  const checkAnswer = () => {
    if (answered || userAnswer === '') return
    const q = questions[currentIdx]
    const isCorrect = parseInt(userAnswer, 10) === q.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setAnswered(true)
    if (isCorrect) {
      setScore((s) => s + 1)
      setSessionPoints((p) => p + 10)
      playApplause()
      const result = addPoints('subtraction', 10)
      if (result?.leveledUp) setLeveledUpInfo(result)
    }
  }

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      setView('result')
      return
    }
    setCurrentIdx((i) => i + 1)
    setUserAnswer('')
    setFeedback(null)
    setAnswered(false)
  }

  if (view === 'select') {
    return (
      <div className="min-h-screen p-4 pb-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-16 w-48 h-48 bg-cyan-200/40 rounded-full blur-3xl" />

        <header className="flex items-center justify-between mb-6 max-w-3xl mx-auto relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800">
            ← {t('subtraction.back')}
          </button>
          <LanguageSwitcher />
        </header>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <MinusIcon />
            <h1 className="text-3xl font-extrabold text-blue-700 mb-2">{t('subtraction.title')}</h1>
            <p className="text-lg font-bold text-gray-700">{t('subtraction.currentLevel', { n: prog.level })}</p>
            <p className="text-blue-600 font-medium">{t('subtraction.points', { points: prog.points })}</p>
            {pointsToNext > 0 && (
              <p className="text-sm text-gray-500 mt-1">{t('subtraction.toNextLevel', { remaining: pointsToNext })}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const unlocked = lvl <= maxUnlockedLevel
              const cfg = LEVEL_CONFIG[lvl]
              return (
                <div
                  key={lvl}
                  className={`rounded-3xl p-5 border-2 transition ${
                    unlocked
                      ? 'bg-white/90 backdrop-blur border-blue-200 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-blue-700">{t('subtraction.level', { n: lvl })}</h3>
                    {!unlocked && <span className="text-xs font-bold text-gray-500">🔒 {t('levels.locked')}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{t(`subtraction.${cfg.descKey}`)}</p>
                  {unlocked ? (
                    <div className="flex gap-2">
                      <button onClick={() => startLearn(lvl)} className="flex-1 py-2.5 rounded-xl bg-blue-100 text-blue-800 text-sm font-bold hover:bg-blue-200">
                        {t('subtraction.learn')}
                      </button>
                      <button onClick={() => startPractice(lvl)} className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600">
                        {t('subtraction.practice')}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">{t('subtraction.toNextLevel', { remaining: pointsToNext })}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'learn') {
    const examples = Array.from({ length: 8 }, () => generateQuestion(practiceLevel))
    return (
      <div className="min-h-screen p-4 pb-12">
        <header className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
          <button onClick={() => setView('select')} className="flex items-center gap-2 text-blue-600 font-bold">
            ← {t('subtraction.back')}
          </button>
          <LanguageSwitcher />
        </header>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-center text-blue-700 mb-2">
            {t('subtraction.level', { n: practiceLevel })} – {t('subtraction.examples')}
          </h1>
          <p className="text-center text-gray-600 mb-6">{t(`subtraction.${LEVEL_CONFIG[practiceLevel].descKey}`)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {examples.map((ex, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-md border border-blue-100">
                <div className="text-lg font-bold text-gray-800">{ex.a} − {ex.b}</div>
                <div className="text-2xl font-black text-blue-600 mt-1">= {ex.answer}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => startPractice(practiceLevel)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              {t('subtraction.practice')} 💪
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'practice') {
    const q = questions[currentIdx]
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <header className="flex items-center justify-between mb-4 max-w-lg mx-auto w-full">
          <button onClick={() => setView('select')} className="text-blue-600 font-bold">← {t('subtraction.back')}</button>
          <div className="text-sm font-bold text-gray-600">{currentIdx + 1} / {questions.length} · +{sessionPoints} pts</div>
          <LanguageSwitcher />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 animate-bounce-in border-4 border-blue-100">
            <p className="text-center text-gray-500 font-medium mb-1">{t('subtraction.level', { n: practiceLevel })}</p>
            <h2 className="text-3xl sm:text-4xl font-black text-center text-blue-700 mb-8">
              {t('subtraction.question', { a: q.a, b: q.b })}
            </h2>
            <input
              type="number"
              inputMode="numeric"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !answered && checkAnswer()}
              disabled={answered}
              className={`w-full text-center text-4xl font-black py-4 rounded-2xl border-4 outline-none transition mb-6 ${
                feedback === 'correct' ? 'border-green-400 bg-green-50 text-green-700 animate-correct'
                : feedback === 'wrong' ? 'border-red-400 bg-red-50 text-red-700 animate-shake'
                : 'border-blue-200 focus:border-blue-500'
              }`}
              placeholder="?"
              autoFocus
            />
            {feedback === 'correct' && <p className="text-center text-green-600 font-bold text-xl mb-4">{t('subtraction.correct')}</p>}
            {feedback === 'wrong' && <p className="text-center text-red-600 font-bold text-xl mb-4">{t('subtraction.wrong', { answer: q.answer })}</p>}
            {!answered ? (
              <button onClick={checkAnswer} disabled={userAnswer === ''} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg disabled:opacity-40 hover:bg-blue-700 transition">
                {t('subtraction.check')}
              </button>
            ) : (
              <button onClick={nextQuestion} className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-lg transition">
                {currentIdx + 1 >= questions.length ? t('subtraction.finish') : t('subtraction.next')}
              </button>
            )}
          </div>
          <p className="mt-6 text-gray-600 font-medium">{t('subtraction.score', { score, total: questions.length })}</p>
        </div>
      </div>
    )
  }

  if (view === 'result') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce-in border-4 border-blue-100">
          <div className="text-6xl mb-4">{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}</div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-2">{t('subtraction.greatJob', { name: user.name })}</h2>
          <p className="text-lg text-gray-600 mb-2">{t('subtraction.youScored', { score, total: questions.length })}</p>
          <p className="text-blue-600 font-bold text-xl mb-2">{t('subtraction.pointsEarned', { points: sessionPoints })}</p>
          {leveledUpInfo && (
            <p className="text-purple-600 font-bold text-lg mb-4 animate-bounce-in">{t('subtraction.levelUp', { n: leveledUpInfo.newLevel })}</p>
          )}
          <p className="text-sm text-gray-500 mb-6">
            {t('subtraction.currentLevel', { n: getModuleProgress('subtraction').level })} · {t('subtraction.points', { points: getModuleProgress('subtraction').points })}
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => startPractice(practiceLevel)} className="w-full py-3.5 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
              {t('subtraction.tryAgain')}
            </button>
            <button onClick={() => setView('select')} className="w-full py-3.5 rounded-2xl bg-blue-100 text-blue-800 font-bold hover:bg-blue-200 transition">
              {t('subtraction.continue')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
