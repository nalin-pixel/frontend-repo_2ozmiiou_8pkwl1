import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function Test() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [backendUrl, setBackendUrl] = useState('')
  const [databaseStatus, setDatabaseStatus] = useState(null)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      setBackendUrl(baseUrl)
      const response = await fetch(`${baseUrl}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      if (response.ok) {
        const data = await response.json()
        setBackendStatus(`Connected - ${data.message || 'OK'}`)
        await checkDatabaseConnection(baseUrl)
      } else {
        setBackendStatus(`Failed - ${response.status} ${response.statusText}`)
        setDatabaseStatus({ error: 'Backend not accessible' })
      }
    } catch (error) {
      setBackendStatus(`Error - ${error.message}`)
      setDatabaseStatus({ error: 'Backend not accessible' })
    }
  }

  const checkDatabaseConnection = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/test`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      if (response.ok) {
        const dbData = await response.json()
        setDatabaseStatus(dbData)
      } else {
        setDatabaseStatus({ error: `Failed to check database - ${response.status}` })
      }
    } catch (error) {
      setDatabaseStatus({ error: `Database check failed - ${error.message}` })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="noise-overlay relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/70 shadow-2xl rounded-2xl max-w-xl w-full overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-zinc-100/5 via-transparent to-white/5" />
        <div className="relative p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100 mb-6 text-center">
            Backend & Database Test
          </h1>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Backend URL</h3>
              <p className="text-sm text-zinc-400 break-all bg-zinc-800/60 border border-zinc-700/60 p-2 rounded">
                {backendUrl || 'Detecting...'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Backend Status</h3>
              <p className="text-sm font-mono bg-zinc-800/60 border border-zinc-700/60 p-2 rounded text-zinc-200">
                {backendStatus}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Database Status</h3>
              <div className="text-sm bg-zinc-800/60 border border-zinc-700/60 p-3 rounded text-zinc-200">
                {databaseStatus ? (
                  databaseStatus.error ? (
                    <p className="text-red-400 font-mono">{databaseStatus.error}</p>
                  ) : (
                    <div className="space-y-2">
                      <p><span className="font-semibold">Backend:</span> {databaseStatus.backend}</p>
                      <p><span className="font-semibold">Database:</span> {databaseStatus.database}</p>
                      <p><span className="font-semibold">DB URL:</span> {databaseStatus.database_url}</p>
                      <p><span className="font-semibold">DB Name:</span> {databaseStatus.database_name}</p>
                      <p><span className="font-semibold">Connection:</span> {databaseStatus.connection_status}</p>
                      {databaseStatus.collections && databaseStatus.collections.length > 0 && (
                        <p><span className="font-semibold">Collections:</span> {databaseStatus.collections.join(', ')}</p>
                      )}
                    </div>
                  )
                ) : (
                  <p className="text-zinc-400 font-mono">Checking database...</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={checkBackendConnection}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2 px-4 rounded border border-white/15 transition-colors"
              >
                Test Again
              </motion.button>
              <a
                href="/"
                className="w-full bg-zinc-700/30 hover:bg-zinc-700/40 text-white font-semibold py-2 px-4 rounded border border-zinc-600/40 text-center transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Test
