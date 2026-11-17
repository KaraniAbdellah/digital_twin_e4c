import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchStatus } from '../../features/riad/services/riadApi'
import { POLL_INTERVAL_MS } from '../../features/riad/constants'
import { sendChatMessage } from '../../features/chat/services/chatApi'
import { WELCOME_MESSAGE } from '../../features/chat/constants'
import { createMessage } from '../../features/chat/utils/createMessage'

const RiadContext = createContext(null)

export function RiadProvider({ children }) {
  const [status, setStatus] = useState(null) // latest state of the Riad
  const [mode, setMode] = useState('demo') // 'live' (backend) or 'demo' (fake data)
  const [messages, setMessages] = useState([createMessage('assistant', WELCOME_MESSAGE)])
  const [sending, setSending] = useState(false)

  // Poll the Riad state so the 3D scene always shows the latest values.
  useEffect(() => {
    let active = true

    const load = async () => {
      const result = await fetchStatus()
      if (!active) return
      setStatus(result.status)
      setMode(result.mode)
    }

    load()
    const timer = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [])

  const sendMessage = useCallback(async (text) => {
    const content = text.trim()
    if (!content) return

    setMessages((prev) => [...prev, createMessage('user', content)])
    setSending(true)

    try {
      const result = await sendChatMessage(content)
      setMessages((prev) => [...prev, createMessage('assistant', result.reply)])
      if (result.state) setStatus(result.state) // show the agent's change immediately
      setMode(result.mode)
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', 'Sorry, I could not reach the agent. Please try again.'),
      ])
    } finally {
      setSending(false)
    }
  }, [])

  return (
    <RiadContext.Provider value={{ status, mode, messages, sending, sendMessage }}>
      {children}
    </RiadContext.Provider>
  )
}

export function useRiad() {
  const context = useContext(RiadContext)
  if (!context) throw new Error('useRiad must be used inside <RiadProvider>')
  return context
}
