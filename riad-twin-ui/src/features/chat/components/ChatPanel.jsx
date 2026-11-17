import { useEffect, useRef, useState } from 'react'
import { useRiad } from '../../../global/context/RiadContext'
import MessageBubble from './MessageBubble'
import SuggestionChips from './SuggestionChips'

export default function ChatPanel() {
  const { messages, sending, sendMessage } = useRiad()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!input.trim() || sending) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="border-b border-sand-100 px-5 py-4">
        <h2 className="font-display text-lg font-bold text-stone-800">Riad Assistant</h2>
        <p className="text-xs text-stone-500">Ask questions or give control commands</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="animate-pulse rounded-2xl rounded-bl-md bg-sand-100 px-4 py-2.5 text-sm text-stone-500">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-3 border-t border-sand-100 px-5 py-4">
        <SuggestionChips onSelect={sendMessage} disabled={sending} />

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-xl border border-sand-200 bg-sand-50 px-4 py-2.5 text-sm outline-none focus:border-zellige-500"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-xl bg-zellige-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zellige-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
