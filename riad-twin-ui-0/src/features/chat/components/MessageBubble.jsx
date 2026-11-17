export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser ? 'rounded-br-md bg-zellige-600 text-white' : 'rounded-bl-md bg-sand-100 text-stone-800'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
