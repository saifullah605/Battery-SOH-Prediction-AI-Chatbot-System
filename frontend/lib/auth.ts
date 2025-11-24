export interface User {
  id: string
  email: string
  name: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  confirmPassword: string
}

// Simulate JWT token (in production, use real JWT)
export const generateToken = (user: User): string => {
  return btoa(JSON.stringify(user))
}

export const parseToken = (token: string): User | null => {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('authToken')
  if (!token) return null
  return parseToken(token)
}

export const setStoredUser = (user: User): void => {
  const token = generateToken(user)
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearStoredUser = (): void => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('authToken')
}