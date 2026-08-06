import { useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

type CheckName = 'server' | 'api' | 'articles'
type RequestState = { loading: boolean; result: string }

const checks: Array<{ name: CheckName; label: string; path: string }> = [
  { name: 'server', label: 'GET /health', path: '/health' },
  { name: 'api', label: 'GET /api/health', path: '/api/health' },
  { name: 'articles', label: 'GET /api/articles?status=published', path: '/api/articles?status=published' },
]

const initialState: Record<CheckName, RequestState> = {
  server: { loading: false, result: '' },
  api: { loading: false, result: '' },
  articles: { loading: false, result: '' },
}

async function readResponse(response: Response) {
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? `Request failed with status ${response.status}`)
  return body
}

export default function HealthTestPage() {
  const [states, setStates] = useState(initialState)

  const runCheck = async (name: CheckName, path: string) => {
    if (!apiBaseUrl) {
      setStates((current) => ({
        ...current,
        [name]: { loading: false, result: 'VITE_API_BASE_URL is not configured.' },
      }))
      return
    }

    setStates((current) => ({ ...current, [name]: { loading: true, result: '' } }))
    try {
      const body = await readResponse(await fetch(`${apiBaseUrl}${path}`))
      setStates((current) => ({
        ...current,
        [name]: { loading: false, result: JSON.stringify(body, null, 2) },
      }))
    } catch (error) {
      setStates((current) => ({
        ...current,
        [name]: { loading: false, result: error instanceof Error ? error.message : 'Unknown error' },
      }))
    }
  }

  const runAll = () => Promise.all(checks.map((check) => runCheck(check.name, check.path)))

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Frontend–Backend Connection Test</h1>
      <p className="mt-2 text-gray-600">
        API base URL: <code>{apiBaseUrl || 'Not configured'}</code>
      </p>
      <button className="mt-8 rounded bg-black px-4 py-2 text-white" onClick={() => void runAll()}>
        Run all checks
      </button>

      <div className="mt-6 grid gap-4">
        {checks.map((check) => {
          const state = states[check.name]
          return (
            <section key={check.name} className="rounded-xl border p-6">
              <h2 className="text-xl font-medium">{check.label}</h2>
              <button
                className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                onClick={() => void runCheck(check.name, check.path)}
                disabled={state.loading}
              >
                {state.loading ? 'Testing…' : 'Run check'}
              </button>
              {state.result && <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">{state.result}</pre>}
            </section>
          )
        })}
      </div>
    </main>
  )
}
