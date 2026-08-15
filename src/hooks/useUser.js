import { useState, useEffect, useCallback } from 'react'

const USERS_KEY = 'mathApp_users'
const CURRENT_ID_KEY = 'mathApp_currentUserId'

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
        { practiced: 0, correct: 0, bestScore: 0, stars: 0 },
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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      return Array.isArray(list) ? list.map(ensureProgress) : []
    }
  } catch (e) {
    console.error(e)
  }
  try {
    const old = localStorage.getItem('mathApp_user')
    if (old) {
      const parsed = ensureProgress(JSON.parse(old))
      const migrated = {
        id: generateId(),
        name: parsed.name || 'User',
        createdAt: parsed.createdAt || new Date().toISOString(),
        progress: parsed.progress || defaultProgress(),
      }
      localStorage.setItem(USERS_KEY, JSON.stringify([migrated]))
      localStorage.setItem(CURRENT_ID_KEY, migrated.id)
      localStorage.removeItem('mathApp_user')
      return [migrated]
    }
  } catch (e) {}
  return []
}

export function useUser() {
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const list = loadUsers()
    setUsers(list)
    const savedId = localStorage.getItem(CURRENT_ID_KEY)
    if (savedId && list.some((u) => u.id === savedId)) {
      setCurrentUserId(savedId)
    } else if (list.length === 1) {
      setCurrentUserId(list[0].id)
      localStorage.setItem(CURRENT_ID_KEY, list[0].id)
    }
    setLoading(false)
  }, [])

  const saveUsers = useCallback((newUsers) => {
    setUsers(newUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(newUsers))
  }, [])

  const user = users.find((u) => u.id === currentUserId) || null

  const selectUser = useCallback((id) => {
    setCurrentUserId(id)
    localStorage.setItem(CURRENT_ID_KEY, id)
  }, [])

  const addUser = useCallback(
    (name) => {
      const newUser = {
        id: generateId(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        progress: defaultProgress(),
      }
      const updated = [...users, newUser]
      saveUsers(updated)
      selectUser(newUser.id)
      return newUser
    },
    [users, saveUsers, selectUser]
  )

  const updateUserName = useCallback(
    (id, newName) => {
      const updated = users.map((u) =>
        u.id === id ? { ...u, name: newName.trim() } : u
      )
      saveUsers(updated)
    },
    [users, saveUsers]
  )

  const deleteUser = useCallback(
    (id) => {
      const updated = users.filter((u) => u.id !== id)
      saveUsers(updated)
      if (currentUserId === id) {
        if (updated.length > 0) {
          selectUser(updated[0].id)
        } else {
          setCurrentUserId(null)
          localStorage.removeItem(CURRENT_ID_KEY)
        }
      }
    },
    [users, currentUserId, saveUsers, selectUser]
  )

  const logout = useCallback(() => {
    setCurrentUserId(null)
    localStorage.removeItem(CURRENT_ID_KEY)
  }, [])

  const updateCurrentUser = useCallback(
    (updater) => {
      if (!currentUserId) return
      const updated = users.map((u) => {
        if (u.id !== currentUserId) return u
        return ensureProgress(updater({ ...u }))
      })
      saveUsers(updated)
    },
    [users, currentUserId, saveUsers]
  )

  const updateMultiplicationProgress = useCallback(
    (table, correctCount, totalQuestions) => {
      if (!user) return
      const scorePercent = Math.round((correctCount / totalQuestions) * 100)
      let stars = 0
      if (scorePercent >= 90) stars = 3
      else if (scorePercent >= 70) stars = 2
      else if (scorePercent >= 50) stars = 1

      updateCurrentUser((u) => {
        const mult = { ...u.progress.multiplication }
        const tables = { ...mult.tables }
        if (table !== 'all') {
          const t = { ...tables[table] }
          t.practiced += 1
          t.correct += correctCount
          t.bestScore = Math.max(t.bestScore || 0, scorePercent)
          t.stars = Math.max(t.stars || 0, stars)
          tables[table] = t
          mult.tables = tables
          mult.totalStars = Object.values(tables).reduce(
            (sum, tb) => sum + (tb.stars || 0),
            0
          )
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
        u.progress = { ...u.progress, multiplication: mult }
        return u
      })
    },
    [user, updateCurrentUser]
  )

  const addPoints = useCallback(
    (module, pointsToAdd) => {
      if (!user || pointsToAdd <= 0) return { leveledUp: false, newLevel: 1 }

      let result = { leveledUp: false, newLevel: 1, points: 0 }

      updateCurrentUser((u) => {
        const mod = { ...(u.progress[module] || defaultModuleProgress()) }
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
        result = {
          leveledUp: mod.level > oldLevel,
          newLevel: mod.level,
          points: mod.points,
        }
        u.progress = { ...u.progress, [module]: mod }
        return u
      })

      return result
    },
    [user, updateCurrentUser]
  )

  const getModuleProgress = useCallback(
    (module) => {
      if (!user) return defaultModuleProgress()
      return user.progress?.[module] || defaultModuleProgress()
    },
    [user]
  )

  const getPointsToNextLevel = useCallback(
    (module) => {
      const prog = getModuleProgress(module)
      const currentLevel = prog.level || 1
      if (currentLevel >= LEVEL_THRESHOLDS.length - 1) return 0
      const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1]
      return Math.max(0, nextThreshold - (prog.points || 0))
    },
    [getModuleProgress]
  )

  return {
    user,
    users,
    loading,
    isLoggedIn: !!user,
    selectUser,
    addUser,
    updateUserName,
    deleteUser,
    logout,
    updateMultiplicationProgress,
    addPoints,
    getModuleProgress,
    getPointsToNextLevel,
    LEVEL_THRESHOLDS,
  }
}
