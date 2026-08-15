import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function generateQuestion(selectedTable) {
  let a, b
  if (selectedTable === 'all') {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 10) + 1
  } else {
    a = selectedTable
    b = Math.floor(Math.random() * 10) + 1
  }
  if (Math.random() > 0.5 && selectedTable === 'all') {
    return { a: b, b: a, answer: a * b }
  }
  return { a, b, answer: a * b }
}

export default function MultiplicationModule({ user, onBack, onUpdateProgress }) {
  const { t } = useTranslation()
  const [view, setView] = useState('select')
  const [selectedTable, setSelectedTable] = useState(null)

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const startLearn = (table) => {
    setSelectedTable(table)
    setView('learn')
  }

  const startPractice = (table) => {
    setSelectedTable(table)
    const qs = Array.from({ length: 10 }, () => generateQuestion(table))
    setQuestions(qs)
    setCurrentIdx(0)
    setScore(0)
    setUserAnswer('')
    setFeedback(null)
    setAnswered(false)
    setView('practice')
  }

  const checkAnswer = () => {
    if (answered || userAnswer === '') return
    const q = questions[currentIdx]
    const isCorrect = parseInt(userAnswer, 10) === q.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setAnswered(true)
    if (isCorrect) setScore((s) => s + 1)
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

  const handleFinish = useCallback(() => {
    onUpdateProgress('multiplication', selectedTable, score, questions.length)
  }, [score, selectedTable, questions.length, onUpdateProgress])

  useEffect(() => {
    if (view === 'result') {
      handleFinish()
    }
  }, [view, handleFinish])

  const starsEarned = () => {
    const pct = Math.round((score / questions.length) * 100)
    if (pct >= 90) return 3
    if (pct >= 70) return 2
    if (pct >= 50) return 1
    return 0
  }

  if (view === 'select') {
    return (
      <div className="min-h-screen p-4 pb-12">
        <header className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800"
          >
            ← {t('multiplication.back')}
          </button>
          <LanguageSwitcher />
        </header>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
            {t('multiplication.title')}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {t('multiplication.selectTable')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const stars = user?.progress?.multiplication?.tables?.[n]?.stars || 0
              return (
                <div
                  key={n}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center gap-3 border-2 border-transparent hover:border-indigo-300 transition"
                >
                  <div className="text-3xl font-black text-indigo-600">{n}</div>
                  <div className="text-yellow-400 text-sm">
                    {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => startLearn(n)}
                      className="flex-1 py-2 rounded-xl bg-indigo-100 text-indigo-700 text-sm font-bold hover:bg-indigo-200"
                    >
                      {t('multiplication.learn')}
                    </button>
                    <button
                      onClick={() => startPractice(n)}
                      className="flex-1 py-2 rounded-xl bg-pink-100 text-pink-700 text-sm font-bold hover:bg-pink-200"
                    >
                      {t('multiplication.practice')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{t('multiplication.allTables')}</h3>
                <p className="text-white/80 text-sm">Random questions from 1-10</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startLearn('all')}
                  className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 font-bold"
                >
                  {t('multiplication.learn')}
                </button>
                <button
                  onClick={() => startPractice('all')}
                  className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50"
                >
                  {t('multiplication.practice')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'learn') {
    const tablesToShow =
      selectedTable === 'all'
        ? Array.from({ length: 10 }, (_, i) => i + 1)
        : [selectedTable]

    return (
      <div className="min-h-screen p-4 pb-12">
        <header className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
          <button
            onClick={() => setView('select')}
            className="flex items-center gap-2 text-indigo-600 font-bold"
          >
            ← {t('multiplication.back')}
          </button>
          <LanguageSwitcher />
        </header>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
            {selectedTable === 'all'
              ? t('multiplication.allTables')
              : t('multiplication.tableOf', { n: selectedTable })}
          </h1>

          <div className="space-y-8">
            {tablesToShow.map((n) => (
              <div key={n} className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-center text-purple-600 mb-4">
                  {t('multiplication.tableOf', { n })}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((m) => (
                    <div
                      key={m}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 text-center border border-indigo-100"
                    >
                      <div className="text-lg font-bold text-gray-800">
                        {n} {t('multiplication.times')} {m}
                      </div>
                      <div className="text-2xl font-black text-indigo-600 mt-1">
                        = {n * m}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => startPractice(selectedTable)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              {t('multiplication.practice')} 💪
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
          <button
            onClick={() => setView('select')}
            className="text-indigo-600 font-bold"
          >
            ← {t('multiplication.back')}
          </button>
          <div className="text-sm font-bold text-gray-600">
            {currentIdx + 1} / {questions.length}
          </div>
          <LanguageSwitcher />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 animate-bounce-in">
            <p className="text-center text-gray-500 font-medium mb-2">
              {t('multiplication.practiceMode')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-center text-indigo-700 mb-8">
              {t('multiplication.question', { a: q.a, b: q.b })}
            </h2>

            <input
              type="number"
              inputMode="numeric"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !answered && checkAnswer()}
              disabled={answered}
              className={`w-full text-center text-4xl font-black py-4 rounded-2xl border-4 outline-none transition mb-6 ${
                feedback === 'correct'
                  ? 'border-green-400 bg-green-50 text-green-700 animate-correct'
                  : feedback === 'wrong'
                  ? 'border-red-400 bg-red-50 text-red-700 animate-shake'
                  : 'border-indigo-200 focus:border-indigo-500'
              }`}
              placeholder="?"
              autoFocus
            />

            {feedback === 'correct' && (
              <p className="text-center text-green-600 font-bold text-xl mb-4">
                {t('multiplication.correct')}
              </p>
            )}
            {feedback === 'wrong' && (
              <p className="text-center text-red-600 font-bold text-xl mb-4">
                {t('multiplication.wrong', { answer: q.answer })}
              </p>
            )}

            {!answered ? (
              <button
                onClick={checkAnswer}
                disabled={userAnswer === ''}
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg disabled:opacity-40 hover:bg-indigo-700 transition"
              >
                {t('multiplication.check')}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg hover:shadow-lg transition"
              >
                {currentIdx + 1 >= questions.length
                  ? t('multiplication.finish')
                  : t('multiplication.next')}
              </button>
            )}
          </div>

          <p className="mt-6 text-gray-600 font-medium">
            {t('multiplication.score', { score, total: questions.length })}
          </p>
        </div>
      </div>
    )
  }

  if (view === 'result') {
    const stars = starsEarned()
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce-in">
          <div className="text-6xl mb-4">
            {stars === 3 ? '🏆' : stars >= 1 ? '⭐' : '💪'}
          </div>
          <h2 className="text-2xl font-extrabold text-indigo-700 mb-2">
            {t('multiplication.greatJob', { name: user.name })}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            {t('multiplication.youScored', { score, total: questions.length })}
          </p>
          <div className="text-4xl text-yellow-400 mb-2">
            {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </div>
          <p className="text-purple-600 font-bold mb-8">
            {t('multiplication.starsEarned', { stars })}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startPractice(selectedTable)}
              className="w-full py-3.5 rounded-2xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition"
            >
              {t('multiplication.tryAgain')}
            </button>
            <button
              onClick={() => setView('select')}
              className="w-full py-3.5 rounded-2xl bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition"
            >
              {t('multiplication.continue')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
