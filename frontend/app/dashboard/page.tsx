'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import ChatHistory from '@/components/ChatHistory'
import ProtectedRoute from '@/components/ProtectedRoute'

interface ChatSession {
  id: string
  title: string
  date: string
  messageCount: number
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Battery Health Discussion',
      date: 'Today',
      messageCount: 5,
    },
    {
      id: '2',
      title: 'SOH Prediction Query',
      date: 'Yesterday',
      messageCount: 8,
    },
    {
      id: '3',
      title: 'Battery Recycling Info',
      date: '2 days ago',
      messageCount: 12,
    },
  ])
  const [activeSession, setActiveSession] = useState<string | null>('1')

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      date: 'Just now',
      messageCount: 1,
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSession(newSession.id)
  }

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (activeSession === id) {
      setActiveSession(sessions[0]?.id || null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Chat History Sidebar */}
        <ChatHistory
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={setActiveSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />

        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </ProtectedRoute>
  )
}