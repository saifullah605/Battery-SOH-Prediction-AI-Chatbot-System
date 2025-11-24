import { NextRequest, NextResponse } from 'next/server'

interface RegisterBody {
  email: string
  password: string
  name: string
  confirmPassword: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json()

    // Validation
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In production, save to database
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: body.email,
      name: body.name,
      role: 'user',
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}