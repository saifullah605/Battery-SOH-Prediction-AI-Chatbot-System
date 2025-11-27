'use client'

import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'


export default function DashboardPage() {
  const router = useRouter()


  return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        
        {/* Top Bar */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => router.push('/predict')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Prediction Tool
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          
         
          {/* Chat Interface */}
          <div className="flex flex-1 h-full">
            <ChatInterface />
          </div>
        </div>
      </div>

  )
}
