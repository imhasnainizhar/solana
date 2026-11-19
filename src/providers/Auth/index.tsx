'use client'

import type { User } from '@/payload-types'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

/**
 * Client-side view of the current session. Sign-in itself is passwordless and
 * happens through full-page flows (Google OAuth / emailed magic link) that set
 * Payload's session cookie server-side — see src/auth.
 */
type AuthContext = {
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  // Tracks the single event of logging in or out (for effects that run once).
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>()

  const logout = useCallback(async () => {
    const res = await fetch('/api/users/logout', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (!res.ok) throw new Error('An error occurred while attempting to logout.')
    setUser(null)
    setStatus('loggedOut')
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        })
        if (!res.ok) throw new Error('An error occurred while fetching your account.')
        const { user: meUser } = await res.json()
        setUser(meUser || null)
        setStatus(meUser ? 'loggedIn' : undefined)
      } catch {
        setUser(null)
      }
    }
    void fetchMe()
  }, [])

  return <Context.Provider value={{ logout, setUser, status, user }}>{children}</Context.Provider>
}

export const useAuth = () => useContext(Context)
