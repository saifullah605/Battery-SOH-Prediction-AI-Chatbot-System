'use client'

import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'

interface ChatSession {
  id: string
  title: string
  date: string
  messageCount: number
}

interface ChatHistoryProps {
  sessions: ChatSession[]
  activeSession: string | null
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
}

export default function ChatHistory({
  sessions,
  activeSession,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatHistoryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700 flex flex-col h-full">

      {/* New Chat Button */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs text-slate-500 mt-2">
              Start a new conversation
            </p>
          </div>
        ) : (
          <div className="p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onMouseEnter={() => setHoveredId(session.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative mb-2 group"
              >
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeSession === session.id
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {session.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {session.date}
                  </p>

                  <p className="text-xs text-slate-600">
                    {session.messageCount} messages
                  </p>
                </button>

                {/* Delete Button */}
                {hoveredId === session.id && (
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        <p>Conversations are saved locally</p>
      </div>
    </div>
  )
}
