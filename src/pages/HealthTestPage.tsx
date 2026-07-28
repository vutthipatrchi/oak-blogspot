import { useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

type RequestState = {
  loading: boolean
  result: string
}

const initialState: RequestState = { loading: false, result: '' }

async function readResponse(response: Response) {
  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed with status ${response.status}`)
  }
  return body
}

export default function HealthTestPage() {
  const [health, setHealth] = useState<RequestState>(initialState)

  const testHealth = async () => {
    if (!apiBaseUrl) {
      setHealth({ loading: false, result: 'VITE_API_BASE_URL is not configured.' })
      return
    }

    setHealth({ loading: true, result: '' })
    try {
      const response = await fetch(`${apiBaseUrl}/health`)
      const body = await readResponse(response)
      setHealth({ loading: false, result: JSON.stringify(body, null, 2) })
    } catch (error) {
      setHealth({ loading: false, result: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Frontend–Backend Connection Test</h1>
      <p className="mt-2 text-gray-600">
        API base URL: <code>{apiBaseUrl || 'Not configured'}</code>
      </p>

      <section className="mt-10 rounded-xl border p-6">
        <h2 className="text-xl font-medium">GET /health</h2>
        <button className="mt-4 rounded bg-black px-4 py-2 text-white" onClick={testHealth} disabled={health.loading}>
          {health.loading ? 'Testing…' : 'Test /health'}
        </button>
        {health.result && <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">{health.result}</pre>}
      </section>
    </main>
  )
}
