'use client'

import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'


export default function DashboardPage() {
  const router = useRouter()


  return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        
      

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
