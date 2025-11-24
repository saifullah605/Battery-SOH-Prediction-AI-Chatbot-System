import { NextRequest, NextResponse } from 'next/server'

interface LoginBody {
  email: string
  password: string
}

// Mock database - in production, use real database
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@battery.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@battery.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
]

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json()

    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user (in production, query database)
    const user = MOCK_USERS.find(
      (u) => u.email === body.email && u.password === body.password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}