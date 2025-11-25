'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Send, LogOut } from 'lucide-react'
import MessageBubble from './MessageBubble'
import LoadingDots from './LoadingDots'
import { getStoredUser, clearStoredUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatInterface() {
  const router = useRouter()
  const user = getStoredUser()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Battery Health Assistant. Ask me anything about battery SOH, health, maintenance, or recycling.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef<number>(messages.length + 1)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // -------------------------------------------------------
  // SEND MESSAGE TO BACKEND USING /api/chatbot
  // -------------------------------------------------------
  const sendToBackend = async (prompt: string) => {
    const response = await fetch("http://localhost:8080/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),  // IMPORTANT 🔥
    })

    return await response.json()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: nextIdRef.current++,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = inputValue
    setInputValue('')
    setLoading(true)

    try {
      const data = await sendToBackend(messageToSend)

      const botMessage: Message = {
        id: nextIdRef.current++,
        text: data?.response || "Sorry, I couldn't process that.",
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: nextIdRef.current++,
        text: 'Unable to connect to the server. Please ensure the backend is running.',
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSendMessage()
    }
  }

  const handleLogout = async () => {
    clearStoredUser()
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Battery SOH Assistant</h2>
          <p className="text-sm text-slate-400">Powered by AI</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/60 text-slate-100 rounded-2xl rounded-bl-none border border-slate-600/50 px-6 py-4">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 bg-slate-800/50 p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about battery SOH, maintenance, or anything else..."
            disabled={loading}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg px-6 py-3 font-semibold flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
