import { SUGGESTIONS } from '../constants'

export default function SuggestionChips({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((text) => (
        <button
          key={text}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(text)}
          className="rounded-full border border-sand-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-zellige-500 hover:text-zellige-600 disabled:opacity-50"
        >
          {text}
        </button>
      ))}
    </div>
  )
}
