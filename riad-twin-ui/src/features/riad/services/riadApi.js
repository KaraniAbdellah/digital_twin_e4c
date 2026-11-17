import { API_URL, USE_MOCK, REQUEST_TIMEOUT_MS } from '../constants'
import { fetchWithTimeout } from '../utils/http'
import { getMockStatus } from './mockBackend'

// GET /status -> current state of the Riad.
// Falls back to demo data when there is no backend, so the UI always works.
export async function fetchStatus() {
  if (!USE_MOCK) {
    try {
      const response = await fetchWithTimeout(`${API_URL}/status`, {}, REQUEST_TIMEOUT_MS)
      return { status: await response.json(), mode: 'live' }
    } catch {
      // backend is down: fall through to demo data
    }
  }
  return { status: getMockStatus(), mode: 'demo' }
}
