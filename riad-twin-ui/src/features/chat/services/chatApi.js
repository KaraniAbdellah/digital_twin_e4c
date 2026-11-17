import { API_URL, USE_MOCK, REQUEST_TIMEOUT_MS } from '../../riad/constants'
import { fetchWithTimeout } from '../../riad/utils/http'
import { runMockCommand } from '../../riad/services/mockBackend'

const AGENT_TIMEOUT_MS = Math.max(REQUEST_TIMEOUT_MS, 30000) // LLM calls can be slow
const FAKE_THINKING_MS = 700

// POST /chat { message } -> { reply, state? }
// Falls back to the demo agent when there is no backend.
export async function sendChatMessage(message) {
  if (!USE_MOCK) {
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        },
        AGENT_TIMEOUT_MS,
      )
      const data = await response.json()
      return { reply: data.reply, state: data.state, mode: 'live' }
    } catch {
      // backend is down: fall through to the demo agent
    }
  }

  await new Promise((resolve) => setTimeout(resolve, FAKE_THINKING_MS))
  return { ...runMockCommand(message), mode: 'demo' }
}
