import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from './hooks/useUser'
import Welcome from './components/Welcome'
import Home from './components/Home'
import MultiplicationModule from './components/MultiplicationModule'
import AdditionModule from './components/AdditionModule'
import SubtractionModule from './components/SubtractionModule'
import DivisionModule from './components/DivisionModule'

function App() {
  const { t } = useTranslation()
  const {
    user,
    loading,
    login,
    logout,
    updateMultiplicationProgress,
    addPoints,
    getModuleProgress,
    getPointsToNextLevel,
    isLoggedIn,
  } = useUser()
  const [currentModule, setCurrentModule] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-600 animate-pulse">
          {t('common.loading')}
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Welcome onLogin={login} />
  }

  if (currentModule === 'multiplication') {
    return (
      <MultiplicationModule
        user={user}
        onBack={() => setCurrentModule(null)}
        onUpdateProgress={updateMultiplicationProgress}
        addPoints={addPoints}
      />
    )
  }

  if (currentModule === 'addition') {
    return (
      <AdditionModule
        user={user}
        onBack={() => setCurrentModule(null)}
        addPoints={addPoints}
        getModuleProgress={getModuleProgress}
        getPointsToNextLevel={getPointsToNextLevel}
      />
    )
  }

  if (currentModule === 'subtraction') {
    return (
      <SubtractionModule
        user={user}
        onBack={() => setCurrentModule(null)}
        addPoints={addPoints}
        getModuleProgress={getModuleProgress}
        getPointsToNextLevel={getPointsToNextLevel}
      />
    )
  }

  if (currentModule === 'division') {
    return (
      <DivisionModule
        user={user}
        onBack={() => setCurrentModule(null)}
        addPoints={addPoints}
        getModuleProgress={getModuleProgress}
        getPointsToNextLevel={getPointsToNextLevel}
      />
    )
  }

  return (
    <Home
      user={user}
      onSelectModule={setCurrentModule}
      onLogout={logout}
      getModuleProgress={getModuleProgress}
    />
  )
}

export default App
