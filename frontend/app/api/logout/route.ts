import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  })

  // Clear auth cookie if using cookies instead of localStorage
  response.cookies.set('authToken', '', { maxAge: 0 })

  return response
}