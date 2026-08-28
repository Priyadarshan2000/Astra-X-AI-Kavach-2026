const API_BASE = import.meta.env.VITE_API_URL || '/api'
const TIMEOUT_MS = 2500

async function request(path, { method = 'GET', body, token, isForm, timeoutMs } = {}) {
  const headers = {}
  if (!isForm) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs ?? TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    let data = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (!res.ok) {
      const error = new Error(data?.message || `Request failed (${res.status})`)
      error.status = res.status
      error.payload = data
      throw error
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeout = new Error('API timeout')
      timeout.status = 503
      throw timeout
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  register: (payload) => request('/register.php', { method: 'POST', body: payload }),
  login: (payload) => request('/login.php', { method: 'POST', body: payload }),
  upload: (form, token) => request('/upload.php', { method: 'POST', body: form, token, isForm: true }),
  scan: (payload, token) => request('/scan.php', { method: 'POST', body: payload, token }),
  patch: (payload, token) => request('/patch.php', { method: 'POST', body: payload, token }),
  fuzz: (payload, token) => request('/fuzz.php', { method: 'POST', body: payload, token }),
  regression: (payload, token) => request('/regression.php', { method: 'POST', body: payload, token }),
  reports: (token) => request('/reports.php', { token }),
  chat: (payload) => request('/chat.php', { method: 'POST', body: payload, timeoutMs: 15000 }),
}

export function isApiReachableError(error) {
  return error instanceof TypeError || error.status === 404 || error.status >= 500
}
