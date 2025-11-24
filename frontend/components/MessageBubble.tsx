interface MessageBubbleProps {
  message: {
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
  }
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl rounded-2xl px-4 py-3 ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
            : 'bg-slate-700/50 text-slate-100 rounded-bl-none border border-slate-600/50'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <span className="text-xs opacity-60 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}