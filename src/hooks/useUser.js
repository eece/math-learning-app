import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'mathApp_user'

const defaultProgress = () => ({
  multiplication: {
    tables: Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [
        i + 1,
        { practiced: 0, correct: 0, bestScore: 0, stars: 0 }
      ])
    ),
    totalStars: 0,
  },
})

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Ensure progress structure exists
        if (!parsed.progress) parsed.progress = defaultProgress()
        if (!parsed.progress.multiplication) {
          parsed.progress.multiplication = defaultProgress().multiplication
        }
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

  const updateProgress = useCallback((module, table, correctCount, totalQuestions) => {
    if (!user) return

    const scorePercent = Math.round((correctCount / totalQuestions) * 100)
    let stars = 0
    if (scorePercent >= 90) stars = 3
    else if (scorePercent >= 70) stars = 2
    else if (scorePercent >= 50) stars = 1

    const updated = { ...user }
    const mult = { ...updated.progress.multiplication }
    const tables = { ...mult.tables }

    if (table === 'all') {
      // Update overall or average - for simplicity, give stars to a special key or just total
      mult.totalStars = Math.max(mult.totalStars || 0, stars)
    } else {
      const t = { ...tables[table] }
      t.practiced += 1
      t.correct += correctCount
      t.bestScore = Math.max(t.bestScore || 0, scorePercent)
      t.stars = Math.max(t.stars || 0, stars)
      tables[table] = t
      mult.tables = tables

      // Recalculate total stars
      mult.totalStars = Object.values(tables).reduce((sum, tb) => sum + (tb.stars || 0), 0)
    }

    updated.progress = { ...updated.progress, multiplication: mult }
    saveUser(updated)
  }, [user, saveUser])

  return {
    user,
    loading,
    login,
    logout,
    updateProgress,
    isLoggedIn: !!user?.name,
  }
}
