import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Welcome({
  users = [],
  onSelectUser,
  onAddUser,
  onUpdateUserName,
  onDeleteUser,
}) {
  const { t } = useTranslation()
  const [mode, setMode] = useState(users.length === 0 ? 'add' : 'list')
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return
    onAddUser(name.trim())
    setName('')
    setMode('list')
  }

  const handleEdit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2 || !editingId) return
    onUpdateUserName(editingId, name.trim())
    setName('')
    setEditingId(null)
    setMode('list')
  }

  const startEdit = (user) => {
    setEditingId(user.id)
    setName(user.name)
    setMode('edit')
  }

  const requestDelete = (id) => setConfirmDeleteId(id)

  const confirmDelete = () => {
    if (confirmDeleteId) {
      onDeleteUser(confirmDeleteId)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-200/40 rounded-full blur-3xl" />

      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10 animate-bounce-in">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🧮</div>
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            {t('app.title')}
          </h1>
          <p className="text-lg text-purple-600 font-medium">
            {t('app.subtitle')}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/50">
          {mode === 'list' && (
            <>
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                {t('welcome.selectUser')}
              </h2>

              {users.length === 0 ? (
                <p className="text-center text-gray-500 mb-4">
                  {t('welcome.noUsers')}
                </p>
              ) : (
                <ul className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {users.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center gap-2 bg-indigo-50 rounded-2xl p-3 border border-indigo-100"
                    >
                      <button
                        onClick={() => onSelectUser(u.id)}
                        className="flex-1 text-left font-bold text-indigo-800 hover:text-indigo-600 truncate"
                      >
                        👤 {u.name}
                      </button>
                      <button
                        onClick={() => startEdit(u)}
                        className="p-2 rounded-xl bg-white text-gray-600 hover:bg-indigo-100 text-sm"
                        title={t('welcome.edit')}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => requestDelete(u.id)}
                        className="p-2 rounded-xl bg-white text-red-500 hover:bg-red-50 text-sm"
                        title={t('welcome.delete')}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => {
                  setName('')
                  setMode('add')
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition"
              >
                + {t('welcome.addNew')}
              </button>
            </>
          )}

          {mode === 'add' && (
            <>
              <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                {t('welcome.addNew')}
              </h2>
              <p className="text-center text-gray-600 mb-5">
                {t('welcome.subtitle')}
              </p>
              <form onSubmit={handleAdd} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('welcome.placeholder')}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-lg font-medium text-center"
                  autoFocus
                  maxLength={20}
                />
                <div className="flex gap-3">
                  {users.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setMode('list')}
                      className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold"
                    >
                      {t('welcome.cancel')}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={name.trim().length < 2}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold disabled:opacity-50"
                  >
                    {t('welcome.start')} 🚀
                  </button>
                </div>
              </form>
            </>
          )}

          {mode === 'edit' && (
            <>
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                {t('welcome.edit')}
              </h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('welcome.placeholder')}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-lg font-medium text-center"
                  autoFocus
                  maxLength={20}
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('list')
                      setEditingId(null)
                      setName('')
                    }}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold"
                  >
                    {t('welcome.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={name.trim().length < 2}
                    className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-50"
                  >
                    {t('welcome.save')}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-bounce-in">
            <div className="text-4xl text-center mb-3">⚠️</div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              {t('welcome.confirmDeleteTitle')}
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {t('welcome.confirmDeleteMessage')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold"
              >
                {t('welcome.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600"
              >
                {t('welcome.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
