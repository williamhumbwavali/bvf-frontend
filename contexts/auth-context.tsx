'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  username: string
  role: string
  avatarUrl?: string | null
  bio?: string | null
}

interface AuthContextData {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  setAuth: (
    accessToken: string,
    user: AuthUser,
  ) => void

  logout: () => void

  updateUser: (
    updatedUser: any,
  ) => void
}

const AuthContext = createContext<
  AuthContextData | undefined
>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [accessToken, setAccessToken] =
    useState<string | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem('accessToken')

      const storedUser =
        localStorage.getItem('user')

      if (
        !storedToken ||
        storedToken === 'undefined' ||
        storedToken === 'null' ||
        !storedUser ||
        storedUser === 'undefined' ||
        storedUser === 'null'
      ) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')

        setAccessToken(null)
        setUser(null)

        return
      }

      const parsedUser: AuthUser =
        JSON.parse(storedUser)

      if (
        !parsedUser ||
        !parsedUser.id ||
        !parsedUser.email
      ) {
        throw new Error(
          'Dados do usuário armazenados são inválidos.',
        )
      }

      setAccessToken(storedToken)
      setUser(parsedUser)
    } catch (error) {
      console.error(
        'Erro ao recuperar autenticação:',
        error,
      )

      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')

      setAccessToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  function setAuth(
    token: string,
    userData: AuthUser,
  ) {
    if (!token || !userData) {
      console.error(
        'Tentativa de salvar autenticação inválida.',
      )

      return
    }

    localStorage.setItem(
      'accessToken',
      token,
    )

    localStorage.setItem(
      'user',
      JSON.stringify(userData),
    )

    setAccessToken(token)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    setAccessToken(null)
    setUser(null)
  }

  /**
   * Atualiza apenas os campos alterados
   * e mantém os restantes dados do usuário.
   */
  function updateUser(
    updatedUser: Partial<AuthUser>,
  ) {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser
      }

      const newUser: AuthUser = {
        ...currentUser,
        ...updatedUser,
      }

      localStorage.setItem(
        'user',
        JSON.stringify(newUser),
      )

      return newUser
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated:
          !!accessToken && !!user,
        isLoading,
        setAuth,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de AuthProvider',
    )
  }

  return context
}