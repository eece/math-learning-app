import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'mathApp_user'

const LEVEL_THRESHOLDS = [0, 0, 80, 200, 400, 700]

const defaultModuleProgress = () => ({
  points: 0,
  level: 1,
  practiced: 0,
  correct: 0,
})

const defaultProgress = () => ({
  multiplication: {
    tables: Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [
        i + 1,
        { practiced: 0, correct: 0, bestScore: 0, stars: 0 }
      ])
    ),
    totalStars: 0,
    points: 0,
    level: 1,
  },
  addition: defaultModuleProgress(),
  subtraction: defaultModuleProgress(),
  division: defaultModuleProgress(),
})

function ensureProgress(user) {
  if (!user.progress) user.progress = defaultProgress()
  if (!user.progress.multiplication) {
    user.progress.multiplication = defaultProgress().multiplication
  }
  ;['addition', 'subtraction', 'division'].forEach((m) => {
    if (!user.progress[m]) user.progress[m] = defaultModuleProgress()
  })
  if (user.progress.multiplication.points === undefined) {
    user.progress.multiplication.points = 0
    user.progress.multiplication.level = 1
  }
  return user
}

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = ensureProgress(JSON.parse(raw))
        setUser(parsed)
      }
    } catch (e) {
      console.error('Failed to load user', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveUser = useCallback((newUser) => {
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }, [])

  const login = useCallback((name) => {
    const newUser = {
      name: name.trim(),
      createdAt: new Date().toISOString(),
      progress: defaultProgress(),
    }
    saveUser(newUser)
  }, [saveUser])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const updateMultiplicationProgress = useCallback((table, correctCount, totalQuestions) => {
    if (!user) return
    const scorePercent = Math.round((correctCount / totalQuestions) * 100)
    let stars = 0
    if (scorePercent >= 90) stars = 3
    else if (scorePercent >= 70) stars = 2
    else if (scorePercent >= 50) stars = 1

    const updated = ensureProgress({ ...user })
    const mult = { ...updated.progress.multiplication }
    const tables = { ...mult.tables }

    if (table !== 'all') {
      const t = { ...tables[table] }
      t.practiced += 1
      t.correct += correctCount
      t.bestScore = Math.max(t.bestScore || 0, scorePercent)
      t.stars = Math.max(t.stars || 0, stars)
      tables[table] = t
      mult.tables = tables
      mult.totalStars = Object.values(tables).reduce((sum, tb) => sum + (tb.stars || 0), 0)
    }

    const pointsGained = correctCount * 10
    mult.points = (mult.points || 0) + pointsGained
    let newLevel = 1
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
      if (mult.points >= LEVEL_THRESHOLDS[i]) {
        newLevel = i
        break
      }
    }
    mult.level = Math.max(mult.level || 1, newLevel)

    updated.progress = { ...updated.progress, multiplication: mult }
    saveUser(updated)
  }, [user, saveUser])

  const addPoints = useCallback((module, pointsToAdd) => {
    if (!user || pointsToAdd <= 0) return { leveledUp: false, newLevel: 1 }

    const updated = ensureProgress({ ...user })
    const mod = { ...(updated.progress[module] || defaultModuleProgress()) }
    const oldLevel = mod.level || 1
    mod.points = (mod.points || 0) + pointsToAdd
    mod.correct = (mod.correct || 0) + Math.round(pointsToAdd / 10)

    let newLevel = 1
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
      if (mod.points >= LEVEL_THRESHOLDS[i]) {
        newLevel = i
        break
      }
    }
    mod.level = Math.max(oldLevel, newLevel)
    const leveledUp = mod.level > oldLevel

    updated.progress = { ...updated.progress, [module]: mod }
    saveUser(updated)

    return { leveledUp, newLevel: mod.level, points: mod.points }
  }, [user, saveUser])

  const getModuleProgress = useCallback((module) => {
    if (!user) return defaultModuleProgress()
    return user.progress?.[module] || defaultModuleProgress()
  }, [user])

  const getPointsToNextLevel = useCallback((module) => {
    const prog = getModuleProgress(module)
    const currentLevel = prog.level || 1
    if (currentLevel >= LEVEL_THRESHOLDS.length - 1) return 0
    const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1]
    return Math.max(0, nextThreshold - (prog.points || 0))
  }, [getModuleProgress])

  return {
    user,
    loading,
    login,
    logout,
    updateMultiplicationProgress,
    addPoints,
    getModuleProgress,
    getPointsToNextLevel,
    LEVEL_THRESHOLDS,
    isLoggedIn: !!user?.name,
  }
}
