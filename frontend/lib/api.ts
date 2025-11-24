const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
const CHATBOT_ENDPOINT = process.env.NEXT_PUBLIC_API_CHATBOT_ENDPOINT || '/api/chatbot'

export interface ChatResponse {
  response: string
  error?: string
}

export async function sendChatMessage(prompt: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}${CHATBOT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ChatResponse = await response.json()
    return data
  } catch (error) {
    console.error('Failed to send chat message:', error)
    throw error
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    console.error('Server health check failed:', error)
    return false
  }
}